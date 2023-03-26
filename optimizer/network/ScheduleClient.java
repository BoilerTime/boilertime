package optimizer.network;

//Java threading and networking libraries
import java.io.*;
import java.net.Socket;
import java.util.Arrays;

import optimizer.algorithm.*;

public class ScheduleClient implements Runnable  {
    
    //The socket that is currently being run
    private Socket netSocket;

    public ScheduleClient(Socket s) {
        this.netSocket = s;
        System.out.println(s.toString());
    }

    @Override
    public void run() {
        System.out.println("Called at new Client!" + netSocket);
        try {
            NetworkHandler network = new NetworkHandler(netSocket.getInputStream(), netSocket.getOutputStream());
            communicateAndRun(network);
            network.close();
            System.out.println("Done");
        } catch (IOException e) {
            System.err.println("Issue: " + e);
            return;
        }
        this.terminate();
    }

    private void terminate() {
        try {
            netSocket.close();
        } catch (NullPointerException | IOException e) {
            System.err.println("Fatal Error: Couldn't terminate thread running on port: " + netSocket.getPort() + " becuase of " + e);
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
            switch (rawTOD) {
                case "Morning":
                    res = TimeOfDay.MORNGING;
                    network.sendMessage("{\"status\":200,\"message\":\"Received Time of Day\",\"data\":null}");
                    break;
                case "Afternoon":
                    res = TimeOfDay.AFTERNOON;
                    network.sendMessage("{\"status\":200,\"message\":\"Received Time of Day\",\"data\":null}");
                    break;
                default:
                    //Do smth
                    network.sendMessage("{\"status\":400,\"message\":\"Illegal Time of Day\",\"data\":null}");
                    break;
            }
        }
        return res; 
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
                x.addCourseTime(Integer.parseInt(network.getIncomingMessage()));
                x.addDuration(Integer.parseInt(network.getIncomingMessage()));
                x.addWeekDays(network.getIncomingMessage());
                x.addRating(Double.parseDouble(network.getIncomingMessage()));
                //System.out.println("Added a section combo: " + i);
            }
            return x.toCourseOverview();
        } catch (NumberFormatException e) {
            System.err.println("Issue: " + e);
        }
        return null;
    }

    private void writeBestToOutput(Population p, Schedule best, NetworkHandler network) {
        if(best == null) {
            network.sendMessage("{\"status\":404,\"message\":\"No Schedule Found\",\"data\":null}");
            return;
        }
        network.sendMessage(OptimizerDecoder.decodeOptimizedSchedule(best));
    }

    private void communicateAndRun(NetworkHandler network) {
        CourseOverview courses[];
        int numOfCourses = -1; //= getCoursesCount(input);
        while(numOfCourses < 1) {
            numOfCourses = getCoursesCount(network);
            System.out.println("Result is: " + numOfCourses);
        }
        courses = new CourseOverview[numOfCourses];
        TimeOfDay timePrefernce = getTODPrefernece(network);
        for(int i = 0; i < courses.length; i++) {
            courses[i] = getCourseInfo(network);
            /*
             * There was an error, terminate the thread and give up
             * To-do: Add a better error handling mechanism. 
             */
            if(courses[i] == null) {
                //terminate();
                return;
            }
            System.out.println(courses[i].getCourseName() + Arrays.toString(courses[i].getCourseDurations()) + Arrays.toString(courses[i].getCourseTimes()) + Arrays.deepToString(courses[i].getWeekDays()) + Arrays.toString(courses[i].getRatings()));
        }
        //System.out.println("Result: " + numOfCourses);
        Population resultPop = new Population(courses, network, timePrefernce);
        Schedule resultsIndividual = resultPop.getBestSchedule();
        writeBestToOutput(resultPop, resultsIndividual, network);
    }
}
