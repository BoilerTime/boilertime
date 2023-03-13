package optimizer.network;

//Java threading and networking libraries
import java.io.*;
import java.net.Socket;
import java.util.logging.Logger;
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
        int count = 0 ;
        try {
            input = new BufferedReader(new InputStreamReader(netSocket.getInputStream()));
            output = new DataOutputStream(netSocket.getOutputStream());
            getCourseInfo(input);
            /**while(count < 10) {
                System.out.println("Message: " + input.readLine() + " Received by " + netSocket.getPort());
                ///System.out.println("Message: " + inFromClient());
                count++;
            }**/
        } catch (IOException e) {
            System.err.println(e);
            return;
        }
        
        terminate();
    }

    private void terminate() {
        try {
            netSocket.close();
        } catch (NullPointerException | IOException e) {
            Logger.getLogger(getClass().getName()).severe(e.getMessage());
        }
    }

    private void getCourseInfo(BufferedReader input){
        boolean stop = false;
        System.out.println("Called!");
        try {
            //First, write a message that the socket has been oppened to the client
            output.writeBytes("{\"status\":200,\"message\":\"Socket Opened\",\"data\":null}");
            while(!stop) {
                System.out.println("Message: " + input.readLine() + " Received by " + netSocket.getPort());
                output.writeBytes("{\"status\":200,\"message\":\"Received!\",\"data\":null}" + "\n");
                System.out.println("W");
            }
            System.out.println("Wrote the initial message!");
        } catch (IOException e) {
            System.err.println("Couldn't read info from socket because of: " + e); 
        }
    }
/* 
    private void writeMessage(String message) {
        try {
            output = new DataOutputStream(netSocket.getOutputStream());
            output.writeBytes(message + "\n");
            output.flush();
        } catch (IOException e) {
            System.err.println("The problem was: " + e);
        }
    } */
}
