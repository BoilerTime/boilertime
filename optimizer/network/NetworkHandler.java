package optimizer.network;
import java.io.*;
import java.net.Socket;
import java.nio.CharBuffer;
import java.util.Arrays;

public class NetworkHandler {
    private InputStream rawIn; 
    private OutputStream rawOut;
    private boolean isInitialized; 

    public NetworkHandler(InputStream input, OutputStream output) {
        this.rawIn = input;
        this.rawOut = output;
        this.init(new BufferedReader(new InputStreamReader(input)),new PrintWriter(this.rawOut, true) );
    }

    private void init(BufferedReader input, PrintWriter output) {
        try {
            boolean found = false;
            String handshake = "";
            while(!found) {
                String s = input.readLine();
                System.out.println(s);
                //System.out.println("Message: " + s);
                handshake+= (s + "\n"); // Build handshake string up
                //System.out.println("Byte Array of Message: " + Arrays.toString(s.toCharArray()));
                if(s !=null && s.equals("")) {
                    found = true;
                }
                //output.println("HTTP/");
            }
            //System.out.println(HandshakeHelper.generateHandshake(handshake));
            String res = HandshakeHelper.generateHandshake(handshake);
            //System.out.println(res);
            output.print(res);
            output.flush();
            //output.println("UwU");
            //output.println("{\"status\":200,\"message\":\"Connection Open\",\"data\":null}");
            this.isInitialized = true; 
        } catch (IOException e) {
            System.err.println("Issue: " + e);
            //this.terminate();
            this.isInitialized = false;
            return;
        }
    }

    public String getIncomingMessage() {
        try {
            byte[] input = new byte[10];
            rawIn.read(input);
            
            for(int i = 0; i < input.length; i++) {
                //System.out.println(~input[i]);
                if(i == 0) {
                    System.out.print("message parameters: ");
                } else if (i == 1) {
                    System.out.print("message length: ");
                } else if(i > 1 && i < 5) {
                    System.out.print("message key: ");
                } else {
                    System.out.print("message content: ");
                }
                System.out.format("0x%x ", input[i]);
                System.out.println("");
            }
            return "Hello";
        } catch (IOException e) {
            return null;
        }
    }

    public int sendMessage() {
        try {
            byte[] z = { 85, 119, 85 };
            //netSocket.getOutputStream().write(z);
            //byte[] buffer = { 1, 5 };
            //char[] y = {(int) 129};
            //output.print(y);
            rawOut.write(129);
            rawOut.write(3);
            rawOut.write(z);
            //output.print(y);
            //netSocket.getOutputStream().write(buffer);
            rawOut.flush();
            return 1;
        } catch (IOException e) {
            return 0;
        }
    }
}
