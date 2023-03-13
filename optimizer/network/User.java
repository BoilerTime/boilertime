package optimizer.network;
//Networking imports
import java.io.*;
import java.net.Socket;
import java.util.Scanner;
public class User {
    public static void main(String[] args) {
        Socket user;
        System.out.println("Hello World!");
        try {
            user = new Socket("localhost", 3002);
            DataOutputStream outToServer = new DataOutputStream(user.getOutputStream());
            BufferedReader inFromServer = new BufferedReader(new InputStreamReader(user.getInputStream()));
            Scanner in = new Scanner(System.in);
            //inFromServer.notify();
            while(in.hasNextLine()) {
                String temp = in.nextLine();
                System.out.println("Sending message: " + temp);
                outToServer.writeBytes(temp + "\n");
                //System.out.println(inFromServer.notify();)
                System.out.println("Response: " + inFromServer.readLine()); // Print the server response.
                System.out.println("Continuing to next iteration!");
            }
        } catch (IOException e) {
						System.err.println(e);
            return;
        }

    } 
}
