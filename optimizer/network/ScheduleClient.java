package optimizer.network;

//Java threading and networking libraries
import java.io.*;
import java.net.Socket;
import java.util.Arrays;

import optimizer.Utils;
import optimizer.algorithm.*;
import optimizer.constants.PreferenceList;
import optimizer.constants.TimeOfDay;
import optimizer.constants.WeekDays;
import optimizer.parameters.BlockOverview;
import optimizer.parameters.CourseOverview;
import optimizer.parameters.CourseOverviewHelper;

public class ScheduleClient extends Thread  {
    
    //The socket that is currently being run
    private Socket netSocket;
    private Scheduler parentScheduler;
    private Synchronizer waiter;
    private boolean isWaitingToRun;
    private final int key;

    public ScheduleClient(Socket s, Scheduler x, Synchronizer waiter, int key) {
        this.netSocket = s;
        //System.out.println(s.toString());
        this.parentScheduler = x;
        this.waiter = waiter;
        this.isWaitingToRun = true;
        this.key = key;
    }

    @Override
    public void run() {
        System.out.println("(ScheduleClient.java) called to run a new client: " + netSocket.getPort() +  " with name: " + Thread.currentThread().getName() + " done");
        try {
            NetworkHandler network = new NetworkHandler(netSocket.getInputStream(), netSocket.getOutputStream());
            Optimizer toBeOptimized = getClientSchedule(network);
            if(toBeOptimized == null) {
                System.err.println("(ScheduleClient.java) Failed to get the schedule data for client: " + netSocket.getPort());
                this.failed(network);
                return;
            }
            synchronized(waiter) {
                this.notifyParent();
                while (this.isWaitingToRun) {
                    try {
                        waiter.wait();
                        System.out.println("Just got alerted of a status update! " + netSocket.getPort());
                        updateClient(network);
                    } catch (InterruptedException e) {
                        System.err.println("(ScheduleClient.java) Got a fatal exception waiting: " + e.toString());
                    }
                }
            }
            network.sendMessage("{\"status\":200,\"message\":\"Status Update\",\"data\":0}");
            this.optimize(toBeOptimized, network);
            /*try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }*/
            
            parentScheduler.completeOptimization();
            //currentThread.interrupt(
            System.out.println("(ScheduleClient.java) Done optimizing client: " + netSocket.getPort());
        } catch (IOException e) {
            System.err.println("Issue: " + e);
            return;
        }
        this.terminate();
    }

    private void terminate() {
        try {
            System.out.println("(ScheduleClient.java) Closing the connection!");
            netSocket.close();
        } catch (NullPointerException | IOException e) {
            System.err.println("(ScheduleClient.java)Fatal Error: Couldn't terminate thread running on port: " + netSocket.getPort() + " becuase of " + e);
        }
    }

    private int getNumericalCount(NetworkHandler network, int min, int max){
        //First, write a message that the socket has been oppened to the client
        //output.writeBytes("{\"status\":200,\"message\":\"Socket Opened\",\"data\":null}");
        String rawCount = network.getIncomingMessage();//nput.readLine();
        if(rawCount == null) {
            return -1;
        }
        int count;
        try {
            count = Integer.parseInt(rawCount);
        } catch (NumberFormatException e) {
            count = -1;
        }
        
        if(count >= min && count < max) {
            //System.out.println("Number of clases: " + numberOfClasses + " For " + netSocket.getPort());
            network.sendMessage("{\"status\":200,\"message\":\"Received Count\",\"data\":null}");
        } else {
            //System.err.println("Illegal number of classes sent!");
            network.sendMessage("{\"status\":400,\"message\":\"Illegal Count\",\"data\":null}");
            //Make it a negative value to allow us to conintue in a defined state
            count = -1;
        }
            //System.out.println("Wrote the initial message!");
        return count;
    }

    private TimeOfDay getTODPreference(NetworkHandler network) {
        String rawTOD = network.getIncomingMessage();
        TimeOfDay res = null;
        while(res == null) { 
            if(rawTOD.equalsIgnoreCase("morning")) {
                res = TimeOfDay.MORNGING;
                network.sendMessage("{\"status\":200,\"message\":\"Received Time of Day\",\"data\":null}");
            } else if (rawTOD.equalsIgnoreCase("afternoon")) {
                res = TimeOfDay.AFTERNOON;
                network.sendMessage("{\"status\":200,\"message\":\"Received Time of Day\",\"data\":null}");
            } else if(rawTOD.equalsIgnoreCase("none")) {
                res = TimeOfDay.NONE;
                network.sendMessage("{\"status\":200,\"message\":\"Received Time of Day\",\"data\":null}");
            } else {
                network.sendMessage("{\"status\":400,\"message\":\"Illegal Time of Day\",\"data\":null}");
                rawTOD = network.getIncomingMessage();
            }
            
        }
        return res; 
    }

    private PreferenceList[] getPreferenceOrderHelper(NetworkHandler network) {
        String rawOrder = network.getIncomingMessage();
        System.out.println("Incoming data:" + rawOrder);
        String[] options = rawOrder.split(",");
        PreferenceList[] preferences = new PreferenceList[options.length];
        for(int i = 0; i < options.length; i++) {
            if(options[i].equalsIgnoreCase("TOD")) {
                preferences[i] = PreferenceList.TOD;
            } else if (options[i].equalsIgnoreCase("RMP")) {
                preferences[i] = PreferenceList.RMP;
            } else if (options[i].equalsIgnoreCase("TAR")) {
                preferences[i] = PreferenceList.TAR;
            } else {
                System.out.println("Bad data: " + options[i]);
                System.out.println("Message overall: " + rawOrder);
                return null;
            }
        }
        return preferences;
    }

    private PreferenceList[] getPreferenceOrder(NetworkHandler network) {
        PreferenceList[] preferences = null;
        while(preferences == null) {
            preferences = getPreferenceOrderHelper(network);
            if(preferences != null) {
                network.sendMessage("{\"status\":200,\"message\":\"Received Preference Order\",\"data\":null}");
            } else {
                network.sendMessage("{\"status\":400,\"message\":\"Illegal Preference Order\",\"data\":null}");
            }
        }
        return preferences;
    }

    private int getCourseSizePref(NetworkHandler network) {
        int count = -1;
        while(count <= 0) {
            try {
                count = Integer.parseInt(network.getIncomingMessage());
                network.sendMessage("{\"status\":200,\"message\":\"Received Num Courses\",\"data\":null}");
            } catch (NumberFormatException e) {
                network.sendMessage("{\"status\":400,\"message\":\"Illegal Num Courses\",\"data\":null}");
            }
        }
        return count;
    }

    private CourseOverview getCourseInfo(NetworkHandler network) {
        //System.out.println("Called to get course info!");
        CourseOverviewHelper x = new CourseOverviewHelper();
        try {
            String temp; 
            //ystem.out.println("In try at getCourseInfo!");
            //first, we assign the course a name
            temp = network.getIncomingMessage();
            if(temp == null) {
                return null;
            }
            x.addCourseName(temp);
            //System.out.println("Added a name to the course!");
            temp = network.getIncomingMessage();
            System.out.println("Required message: " + temp);
            if(temp.equalsIgnoreCase("True")) {
                x.setRequired(true);
            } else {
                x.setRequired(false);
            }

            //next, we need to determine how many courses are going to be transmitted
            String t = network.getIncomingMessage();
            if(t == null) {
                return null;
            }
            int numOfTimes = Integer.parseInt(t);
            //System.out.println("Num of times: " + numOfTimes);
            //First, we instantiate the times for each
            x.instantiateHelper(numOfTimes);

            for(int i = 0; i < numOfTimes; i++) {
                String message = network.getIncomingMessage();
                x.addCourseTime(Integer.parseInt(message));

                message = network.getIncomingMessage();
                x.addDuration(Integer.parseInt(message));

                message = network.getIncomingMessage();
                x.addWeekDays(message);

                message = network.getIncomingMessage();
                x.addRating(Double.parseDouble(message));

                message = network.getIncomingMessage();
                x.addSectionId(message);
                //System.out.println("Added a section combo: " + i);
            }
            return x.toCourseOverview();
        } catch (NumberFormatException e) {
            System.err.println("(ScheduleClient.java) Issue: " + e);
        }
        return null;
    }

    private BlockOverview getBlockOverview(NetworkHandler network) {
        try {
            String name = network.getIncomingMessage();
            int startTime = Integer.parseInt(network.getIncomingMessage());
            int duration = Integer.parseInt(network.getIncomingMessage());
            WeekDays[] days = Utils.strListToDayList(network.getIncomingMessage());
            return new BlockOverview(name, startTime, duration, days);
        } catch (NumberFormatException e) {
            System.err.println("(ScheduleClient.java) Issue: " + e);
        }
        return null;
    }

    private void writeBestToOutput(Optimizer p, Schedule[] best, NetworkHandler network) {
        if(best == null) {
            network.sendMessage("{\"status\":404,\"message\":\"No Schedule Found\",\"data\":null}");
            return;
        }
        network.sendMessage(OptimizerDecoder.decodeOptimizedSchedule(best));
    }

    private Optimizer getClientSchedule(NetworkHandler network) {
        CourseOverview courses[];
        BlockOverview blocks[];
        int numOfCourses = getNumericalCount(network, 1, 11);
        int numOfBlocks = getNumericalCount(network, 0, 10);

        if(numOfCourses == -1 || numOfBlocks == -1) {
            this.terminate();
            return null;
        }

        courses = new CourseOverview[numOfCourses];
        blocks = new BlockOverview[numOfBlocks];

        //Get the inputted list of preferences from the client
        PreferenceList[] preferences = getPreferenceOrder(network);
        //Get the TOD preference from the client
        TimeOfDay timePreference = getTODPreference(network);
        int coursePref = getCourseSizePref(network);

        System.out.println("(ScheduleClient.java) Got all client detail for: " + netSocket.getPort());
        for(int i = 0; i < courses.length; i++) {
            courses[i] = getCourseInfo(network);

            /*
             * There was an error, terminate the thread and give up
             * TODO: Add a better error handling mechanism. 
             */
            if(courses[i] == null) {
                //terminate();
                return null;
            }
            System.out.println(courses[i].getCourseName() + Arrays.toString(courses[i].getCourseDurations()) + Arrays.toString(courses[i].getCourseTimes()) + Arrays.deepToString(courses[i].getWeekDays()) + Arrays.toString(courses[i].getRatings()));
        }
        System.out.println("(ScheduleClient.java) Got all course details for: " + netSocket.getPort());

        for(int i = 0; i < blocks.length; i++) {
            blocks[i] = this.getBlockOverview(network);
            
            /*
             * There was an error, terminate the thread and give up
             * TODO: Add a better error handling mechanism. 
             */
            if(blocks[i] == null) {
                return null;
            }
            System.out.println("Block: " + i + " " + blocks[i].getName() + blocks[i].getStartTime() + blocks[i].getDuration() + Arrays.toString(blocks[i].getWeekDays()));
        }
        System.out.println("(ScheduleClient.java) Got all block details for: " + netSocket.getPort());
        //System.out.println("Result: " + numOfCourses);
        return new Optimizer(courses, blocks, network, timePreference, preferences, coursePref);
    }

    public synchronized void runOptimizer() {
        this.isWaitingToRun = false;
    }

    public synchronized void notifyParent() {
        parentScheduler.gotData(key);
    }

    private void optimize(Optimizer p, NetworkHandler net) {
        try {
            Schedule[] best = p.getBestSchedule();
            this.writeBestToOutput(p, best, net);
        } catch(Exception e) {
            System.err.println("(ScheduleClient.java) Fatal error optimizing the schedule for: " + netSocket.getPort() + " because of " + e + " \n");
            e.printStackTrace();
            this.failed(net);
        }
    }

    private void updateClient(NetworkHandler network) {
        network.sendMessage("{\"status\":102,\"message\":\"Position in Queue Update\",\"data\":{\"currentPos\":" + waiter.getPosInQueue() + ",\"totalWaiting\":" + waiter.getWaitlistSize() + "}}");
    }

    private void failed(NetworkHandler network) {
        network.sendMessage("{\"status\":404,\"message\":\"Fatal Error in Schedule Input\",\"data\":\"There was an error in the schedule input sent to the server\"}");
        network.close();
        this.terminate();
        synchronized(this.parentScheduler) {
            this.parentScheduler.failedToGet(key);
        }
    }
}
