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
    private Population toBeOptimized;
    private Object waiter;
    private boolean isWaitingToRun;

    public ScheduleClient(Socket s, Scheduler x, Object waiter) {
        this.netSocket = s;
        System.out.println(s.toString());
        this.parentScheduler = x;
        this.waiter = waiter;
        this.isWaitingToRun = true;
    }

    @Override
    public void run() {
        System.out.println("Called at new Client!" + netSocket);
        try {
            NetworkHandler network = new NetworkHandler(netSocket.getInputStream(), netSocket.getOutputStream());
            this.toBeOptimized = getClientSchedule(network);
            if(this.toBeOptimized == null) {
                network.close();
                terminate();
            }

            synchronized(waiter) {
                System.out.println("Random count: " + parentScheduler.random());
                while (this.isWaitingToRun) {
                    try {
                        waiter.wait();
                        synchronized (parentScheduler) {
                            parentScheduler.completeOptimization();
                        }
                        //System.out.println("UWU");
                    } catch (InterruptedException e) {
                        System.err.println("Got a fatal exception waiting: " + e.toString());
                    }
                }
            }
            //currentThread.interrupt(
            System.out.println("Done");
        } catch (IOException e) {
            System.err.println("Issue: " + e);
            return;
        }
        this.terminate();
    }

    private void terminate() {
        try {
            System.out.println("Closing the connection!");
            netSocket.close();
        } catch (NullPointerException | IOException e) {
            System.err.println("Fatal Error: Couldn't terminate thread running on port: " + netSocket.getPort() + " becuase of " + e);
        }
    }

    private int getCoursesCount(NetworkHandler network){
        //First, write a message that the socket has been oppened to the client
        //output.writeBytes("{\"status\":200,\"message\":\"Socket Opened\",\"data\":null}");
        String rawClasses = network.getIncomingMessage();//nput.readLine();
        System.out.println("Got raw: " + rawClasses);
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
        System.out.println("Got Raw " + rawTOD);
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
            System.out.println("twt" + t);
            int numOfTimes = Integer.parseInt(t);
            //System.out.println("Num of times: " + numOfTimes);
            //First, we instantiate the times for each
            x.instantiateHelper(numOfTimes);

            for(int i = 0; i < numOfTimes; i++) {
                String message = network.getIncomingMessage();
                System.out.println("OwO" + message);
                x.addCourseTime(Integer.parseInt(message));

                message = network.getIncomingMessage();
                System.out.println("TwT" + message);
                x.addDuration(Integer.parseInt(message));

                message = network.getIncomingMessage();
                System.out.println(message);
                x.addWeekDays(message);

                message = network.getIncomingMessage();
                System.out.println(message);
                x.addRating(Double.parseDouble(message));

                message = network.getIncomingMessage();
                System.out.println(message);
                x.addSectionId(message);
                //System.out.println("Added a section combo: " + i);
            }
            return x.toCourseOverview();
        } catch (NumberFormatException e) {
            System.err.println("Issue: " + e);
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

        for(int i = 0; i < courses.length; i++) {
            courses[i] = getCourseInfo(network);
            System.out.println("UwU" + courses[i]);
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
        //Schedule[] resultOptions = resultPop.getBestSchedule();
        //writeBestToOutput(resultPop, resultOptions, network);
    }

    public synchronized void runOptimizer() {
        this.isWaitingToRun = false;
    }
}
