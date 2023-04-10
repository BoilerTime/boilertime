package optimizer.network;

//Java threading and networking libraries
import java.io.*;
import java.net.Socket;
import java.util.Arrays;

import optimizer.algorithm.*;

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
            Population toBeOptimized = getClientSchedule(network);
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
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            
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

    private int getCoursesCount(NetworkHandler network){
        //First, write a message that the socket has been oppened to the client
        //output.writeBytes("{\"status\":200,\"message\":\"Socket Opened\",\"data\":null}");
        String rawClasses = network.getIncomingMessage();//nput.readLine();
        if(rawClasses == null) {
            return -1;
        }
        int numberOfClasses;
        try {
            numberOfClasses = Integer.parseInt(rawClasses);
        } catch (NumberFormatException e) {
            numberOfClasses = -1;
        }
        
        if(numberOfClasses > 0 && numberOfClasses < 11) {
            //System.out.println("Number of clases: " + numberOfClasses + " For " + netSocket.getPort());
            network.sendMessage("{\"status\":200,\"message\":\"Received Number of Classes\",\"data\":null}");
        } else {
            //System.err.println("Illegal number of classes sent!");
            network.sendMessage("{\"status\":400,\"message\":\"Illegal\",\"data\":null}");
            //Make it a negative value to allow us to conintue in a defined state
            numberOfClasses = -1;
        }
            //System.out.println("Wrote the initial message!");
        return numberOfClasses;
    }

    private TimeOfDay getTODPrefernece(NetworkHandler network) {
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

    private boolean usingRMP(NetworkHandler network) {
        String rawRMP = network.getIncomingMessage();
        while(true) {
            if(rawRMP.equalsIgnoreCase("RMP")) {
                network.sendMessage("{\"status\":200,\"message\":\"Received RMP\",\"data\":null}");
                return true;
            } else if(rawRMP.equalsIgnoreCase("None")) {
                network.sendMessage("{\"status\":200,\"message\":\"Received RMP\",\"data\":null}");
                return false;
            } else {
                rawRMP = network.getIncomingMessage();
                network.sendMessage("{\"status\":400,\"message\":\"Illegal RMP\",\"data\":null}");
            }
        }
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
            if(temp.equals("True")) {
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

    private void writeBestToOutput(Population p, Schedule[] best, NetworkHandler network) {
        if(best == null) {
            network.sendMessage("{\"status\":404,\"message\":\"No Schedule Found\",\"data\":null}");
            return;
        }
        network.sendMessage(OptimizerDecoder.decodeOptimizedSchedule(best));
    }

    private Population getClientSchedule(NetworkHandler network) {
        CourseOverview courses[];
        int numOfCourses = getCoursesCount(network);
        if(numOfCourses == -1) {
            this.terminate();
            return null;
        }

        courses = new CourseOverview[numOfCourses];

        //Handle the fetching of preferences and generation of a preferences list/
        TimeOfDay timePreference = getTODPrefernece(network);
        boolean usingRMP = usingRMP(network);
        PreferenceList[] preferences = new PreferenceList[2];
        if(usingRMP) {
            preferences[0] = PreferenceList.RMP;
            preferences[1] = PreferenceList.TOD;
            timePreference = TimeOfDay.AFTERNOON;
        } else {
            preferences[1] = PreferenceList.TOD;
            preferences[0] = PreferenceList.RMP;
        }

        if(timePreference == TimeOfDay.NONE) {
            timePreference = TimeOfDay.MORNGING;
            //preferences[1] = TimeOfDay.MORNGING;
        }

        System.out.println("Got all client detail for: " + netSocket.getLocalPort());
        for(int i = 0; i < courses.length; i++) {
            courses[i] = getCourseInfo(network);
            /*
             * There was an error, terminate the thread and give up
             * To-do: Add a better error handling mechanism. 
             */
            if(courses[i] == null) {
                //terminate();
                return null;
            }
            System.out.println(courses[i].getCourseName() + Arrays.toString(courses[i].getCourseDurations()) + Arrays.toString(courses[i].getCourseTimes()) + Arrays.deepToString(courses[i].getWeekDays()) + Arrays.toString(courses[i].getRatings()));
        }
        //System.out.println("Result: " + numOfCourses);
        return new Population(courses, network, timePreference, preferences);
    }

    public synchronized void runOptimizer() {
        this.isWaitingToRun = false;
    }

    public synchronized void notifyParent() {
        parentScheduler.gotData(key);
    }

    private void optimize(Population p, NetworkHandler net) {
        Schedule[] best = p.getBestSchedule();
        this.writeBestToOutput(p, best, net);
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
