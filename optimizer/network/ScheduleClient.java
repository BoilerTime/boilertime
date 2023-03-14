package optimizer.network;

//Java threading and networking libraries
import java.io.*;
import java.net.Socket;
import optimizer.algorithm.*;

public class ScheduleClient implements Runnable  {
    
    //The socket that is currently being run
    private Socket netSocket;
    private BufferedReader input;
    private DataOutputStream output;

    public ScheduleClient(Socket s) {
        this.netSocket = s;
        System.out.println(s.toString());
    }

    @Override
    public void run() {
        System.out.println("Called at new Client!" + netSocket);
        CourseOverview courses[];
        try {
            input = new BufferedReader(new InputStreamReader(netSocket.getInputStream()));
            output = new DataOutputStream(netSocket.getOutputStream());
            int numOfCourses = -1; //= getCoursesCount(input);
            while(numOfCourses < 1) {
                numOfCourses = getCoursesCount(input);
                output.flush();
                System.out.println("Result is: " + numOfCourses);
            }
            courses = new CourseOverview[numOfCourses];
            for(int i = 0; i < courses.length; i++) {
                courses[i] = getCourseInfo(input);
                /*
                 * There was an error, terminate the thread and give up
                 * To-do: Add a better error handling mechanism. 
                 */
                if(courses[i] == null) {
                    terminate();
                }
            }
            //System.out.println("Result: " + numOfCourses);
        } catch (IOException e) {
            System.err.println("Issue: " + e);
            return;
        }
        terminate();
    }

    private void terminate() {
        try {
            netSocket.close();
        } catch (NullPointerException | IOException e) {
            System.err.println("Fatal Error: Couldn't terminate thread running on port: " + netSocket.getPort() + " becuase of " + e);
        }
    }

    private int getCoursesCount(BufferedReader input){

        System.out.println("Called to get course count");
        int numberOfClasses;
        try {
            //First, write a message that the socket has been oppened to the client
            //output.writeBytes("{\"status\":200,\"message\":\"Socket Opened\",\"data\":null}");
            String rawClasses = input.readLine();
            numberOfClasses = Integer.parseInt(rawClasses);
            if(numberOfClasses > 0 && numberOfClasses < 11) {
                //System.out.println("Number of clases: " + numberOfClasses + " For " + netSocket.getPort());
                output.writeBytes("{\"status\":200,\"message\":\"Received\",\"data\":null}" + "\n");
            } else {
                //System.err.println("Illegal number of classes sent!");
                output.writeBytes("{\"status\":400,\"message\":\"Illegal\",\"data\":null}" + "\n");
                //Make it a negative value to allow us to conintue in a defined state
                numberOfClasses = -1;
            }
            //System.out.println("Wrote the initial message!");
        } catch (IOException | NumberFormatException e) {
            System.err.println("Couldn't read info from socket because of: " + e); 
            return -1;
        }
        return numberOfClasses;
    }

    private CourseOverview getCourseInfo(BufferedReader input) {
        CourseOverviewHelper x = new CourseOverviewHelper();
        try {
            //first, we assign the course a name
            x.addCourseName(input.readLine());
            //next, we need to determine how many courses are going to be transmitted
            String t = input.readLine();
            int numOfTimes = Integer.parseInt(t);
            
            //First, we instantiate the times for each
            x.instantiateTimes(numOfTimes);
            for(int i = 0; i < numOfTimes; i++) {
                x.addDuration(Integer.parseInt(input.readLine()));
            }

            //Next, we add the course durations for each time
            int numOfDurations = Integer.parseInt(input.readLine());
            x.instantiateTimes(numOfDurations);
            for(int i = 0; i < numOfDurations; i++) {
                x.addDuration(Integer.parseInt(input.readLine()));
            }

            return x.toCourseOverview();
        } catch (IOException | NumberFormatException e) {
            System.err.println(e);
        }
        return null;
    }
}
