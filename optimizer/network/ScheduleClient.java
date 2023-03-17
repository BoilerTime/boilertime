package optimizer.network;

//Java threading and networking libraries
import java.io.*;
import java.net.Socket;
import java.nio.CharBuffer;
import java.util.Arrays;

import optimizer.algorithm.*;

public class ScheduleClient implements Runnable  {
    
    //The socket that is currently being run
    private Socket netSocket;
    private BufferedReader input;
    private PrintWriter output;

    public ScheduleClient(Socket s) {
        this.netSocket = s;
        System.out.println(s.toString());
    }

    @Override
    public void run() {
        System.out.println("Called at new Client!" + netSocket);
        try {
            //input = new BufferedReader(new InputStreamReader(netSocket.getInputStream()));
            //output = new PrintWriter(netSocket.getOutputStream(), true);
            NetworkHandler helper = new NetworkHandler(netSocket.getInputStream(), netSocket.getOutputStream());
            helper.getIncomingMessage();
            helper.sendMessage();
            //System.out.println(input.readLine());
            //waitForInit(input);
            //input = new BufferedReader(new InputStreamReader(netSocket.getInputStream()));
            /*char[] incoming = new char[10];
            input.read(incoming);
            for(int i = 0; i < incoming.length; i++) {
                byte lsb = (byte) ~incoming[i];
                byte msb = (byte) (~incoming[i] >>> 8);
                System.out.format("0x%x 0x%x \n ", msb, lsb);
            }*/


            //System.out.println(Arrays.toString(input));
            /*System.out.println(input.read());
            System.out.println(input.read());
            System.out.println(input.read());
            System.out.println(input.read());
            System.out.println(input.read());*/
            //char[] x= new char[50];
            //input.read(x);
            //System.out.println((int) x[0]);
            //System.out.println(Arrays.toString(x));
            //new InputStreamReader(netSocket.getInputStream()).rea

            //output = new PrintWriter(netSocket.getOutputStream(), true);
            //output.println("UwU");
            //char[] x = { 'a', 'b', '\n'};
            //output.println(x);
            //input = new BufferedReader(new InputStreamReader(netSocket.getInputStream()));
            /*System.out.println("Verified");
            char[] x = new char[100];
            System.out.println(input.read(x));
            System.out.println(Arrays.toString(x));
            System.out.println((int) x[0] + " " + (int) x[1]);
            int ptr = 0;
            while(x[ptr] == 65533) {
                ptr++;
            }
            System.out.println((int) x[ptr] + " " + ptr); 
            System.out.println(Integer.toBinaryString(x[ptr]));*/
            //String incoming = input.readLine();
            //System.out.println("Encountered end!" + incoming);
            /*for(int i = 0; i < 100; i++) {
                int temp = input.read();
                char x = 
                input.read(null)
                System.out.printf("Int Val: %d or Char: %c and as Bin String: %s\n", temp, temp, Integer.toBinaryString(temp));
                byte[] bytes = {
                    (byte)(temp >>> 24),
                    (byte)(temp >>> 16),
                    (byte)(temp >>> 8),
                    (byte)temp};
                for (byte b : bytes) {
                    System.out.format("0x%x ", b);
                }
                System.out.println("");
            }*/
            //System.out.println("twt" + input.read());
            //output.println("UwU");
            /*char[] y = new char[98];
            System.arraycopy(x, 2, y, ptr, 90);
            System.out.println(Arrays.toString(y));
            //System.arraycopy(x, ptr, x, ptr, ptr);
            
            byte[] z = { 127, 11, 0 };
            System.out.println("Huh!");
            netSocket.getOutputStream().write(z);
            netSocket.getOutputStream().flush();
            //output.write(z);
            //byte[] b = {0xff, 0xff, 0xff, 0xff};
            //netSocket.getOutputStream().write(b);
            //output.println(incoming);
            //communicateAndRun(input, output);*/
            //char[] y = {'\n', '\n', 'c'};
            //output = new PrintWriter(netSocket.getOutputStream(), true);
            //char[] y = { (int) 129, (int) 3, 'A', 'B', 'C' };
            //System.out.println("TWT" + y[0]);
            //char[] x = {'a', 'b', 'c', 'd'};
            //output.flush();
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
                output.println("{\"status\":200,\"message\":\"Received\",\"data\":null}");
            } else {
                //System.err.println("Illegal number of classes sent!");
                output.println("{\"status\":400,\"message\":\"Illegal\",\"data\":null}");
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
        //System.out.println("Called to get course info!");
        CourseOverviewHelper x = new CourseOverviewHelper();
        try {
            //ystem.out.println("In try at getCourseInfo!");
            //first, we assign the course a name
            x.addCourseName(input.readLine());
            //System.out.println("Added a name to the course!");
            //next, we need to determine how many courses are going to be transmitted
            String t = input.readLine();
            int numOfTimes = Integer.parseInt(t);
            //System.out.println("Num of times: " + numOfTimes);
            //First, we instantiate the times for each
            x.instantiateTimes(numOfTimes);
            x.instantiateDurations(numOfTimes);
            for(int i = 0; i < numOfTimes; i++) {
                x.addCourseTime(Integer.parseInt(input.readLine()));
                x.addDuration(Integer.parseInt(input.readLine()));
                //System.out.println("Added a section combo: " + i);
            }
            return x.toCourseOverview();
        } catch (IOException | NumberFormatException e) {
            System.err.println("Issue: " + e);
        }
        return null;
    }

    private void writeBestToOutput(Population p, Schedule best) {
        if(best == null) {
            output.println("{\"status\":404,\"message\":\"No Schedule Found\",\"data\":null}");
            return;
        }
        output.println(OptimizerDecoder.decodeOptimizedSchedule(best));
    }

    private void communicateAndRun(BufferedReader input, PrintWriter output) {
        CourseOverview courses[];
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
                //terminate();
                return;
            }
            System.out.println(courses[i].getCourseName() + Arrays.toString(courses[i].getCourseDurations()) + Arrays.toString(courses[i].getCourseTimes()));
        }
        //System.out.println("Result: " + numOfCourses);
        Population resultPop = new Population(courses);
        Schedule resultsIndividual = resultPop.getBestSchedule();
        writeBestToOutput(resultPop, resultsIndividual);
    }
}
