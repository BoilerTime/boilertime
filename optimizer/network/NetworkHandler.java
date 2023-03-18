package optimizer.network;
import java.io.*;
import java.net.Socket;
import java.nio.CharBuffer;
import java.util.Arrays;
import java.util.Random;

import optimizer.Utils;

public class NetworkHandler {
    private InputStream rawIn; 
    private OutputStream rawOut;
    private boolean isInitialized; 

    public NetworkHandler(InputStream input, OutputStream output) {
        this.rawIn = input;
        this.rawOut = output;
        this.init(new BufferedReader(new InputStreamReader(input)),new PrintWriter(this.rawOut, true) );
    }

    /**
     * A private helper method that completes the handshake with the client attempting to connect to the server
     * @param input The input object that allows reading of a line of input that is incoming
     * @param output The output object the allows printing a string of output. 
     */
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

    /**
     * This method gets input from the client, unmasks it, and returns it as a string. Note: this method will take control of the program for a potentially indefinite amount of time until a message arrives
     * @return The unmasked message that has been received from the client, or null if the connection is invalid. 
     */
    public String getIncomingMessage() {
        if(!isInitialized) {
            return null;
        }
        try {
            byte[] input = new byte[2];
            rawIn.read(input);
            boolean isFin = (input[0] & 0x80) != 0;
            //System.out.println((input[0] & 0x80));
            int opcode = (input[0] & 0xf);
            boolean isMasked = (input[1] & 0x80) != 0;
            //int length = (input[1] & 0x7f); 
            int length;
            if((input[1] & 0x7f) < 126) {
                length = (int) (input[1] & 0x7f);
            } else if ((input[1] & 0x7f) == 126) {
                byte[] extraLen = new byte[2];
                rawIn.read(extraLen);
                char fin = (char) (extraLen[0] << 8);
                fin = (char) (fin | (char) extraLen[1]);
                length = (int) fin;
            } else {
                System.err.println("Warning: The data send exceeds the permissible length. Only the first: " + Integer.MAX_VALUE + " bits will be read.");
                byte[] extraLen = new byte[8];
                long fin = (long) extraLen[0] << 56;
                fin = (long) ( fin | (long) extraLen[1] << 48);
                fin = (long) ( fin | (long) extraLen[2] << 40);
                fin = (long) ( fin | (long) extraLen[3] << 32);
                fin = (long) ( fin | (long) extraLen[4] << 24);
                fin = (long) ( fin | (long) extraLen[5] << 16);
                fin = (long) ( fin | (long) extraLen[6] << 8);
                fin = (long) ( fin | (long) extraLen[7]);
                length = (int) fin;
            }

            /*System.out.println("isFin = " + isFin);
            System.out.println("opcode = " + opcode);
            System.out.println("isMaksed = " + isMasked);
            System.out.println("length = " + length);*/

            byte[] mask = null;
            if(isMasked) {
                mask = new byte[4];
                rawIn.read(mask);
            }

            if(!isFin) {
                System.err.println("Warning: This service does not support a multi-page incoming message");
            }

            if(opcode != 1) {
                System.err.println("Warning: This service does not support messages that aren't a string");
            }

            byte[] incomingMessage = new byte[length];
            rawIn.read(incomingMessage);

            if(!isMasked) {
                return new String(incomingMessage);
            } 
            return new String(masker(incomingMessage, mask));
        } catch (IOException e) {
            return null;
        }
    }

    /**
     * This method enables the sending of a method to the client following appropriate websocket conventions
     * @param message The message that is to be sent
     * @return True, if the message is sent. False, if the message cannot be sent for any reason. 
     */
    public boolean sendMessage(String message) {
        if(!isInitialized) {
            return false;
        }
        try {
            //Fixed opening message as we are always sending a final message as a string
            byte openingMessage = (byte) 129;
            byte[] lengthHeader;
            //int lengthHeader;
            int messageLength = message.length();
            if(messageLength < 126) {
                lengthHeader = new byte[1];
                lengthHeader[0] = (byte)messageLength;
            } else if(messageLength < 65535) {
                lengthHeader = new byte[3];
                lengthHeader[0] = (byte)126;
                lengthHeader[1] = (byte) ((messageLength >> 8) & 255);
                lengthHeader[2] = (byte) (messageLength & 255);
            } else {
                lengthHeader = new byte[9];
                lengthHeader[0] = 127;
                lengthHeader[1] = (byte) ((messageLength >> 56) & 255);
                lengthHeader[2] = (byte) ((messageLength >> 48) & 255);
                lengthHeader[3] = (byte) ((messageLength >> 40) & 255);
                lengthHeader[4] = (byte) ((messageLength >> 32) & 255);
                lengthHeader[5] = (byte) ((messageLength >> 24) & 255);
                lengthHeader[6] = (byte) ((messageLength >> 16) & 255);
                lengthHeader[7] = (byte) ((messageLength >> 8) & 255);
                lengthHeader[8] = (byte) ((messageLength) & 255);
            }
            //byte length = (byte) (message.length());

            //Allocate an array for the response
            byte[] response = new byte[1 + lengthHeader.length + message.length()]; //2 bytes for header and length, then the length of the message
            byte[] messageData = message.getBytes();
            response[0] = openingMessage;
            System.arraycopy(lengthHeader, 0, response, 1, lengthHeader.length);
            //response[1] = length;
            System.arraycopy(messageData, 0, response, 1+lengthHeader.length, messageData.length);
            rawOut.write(response);
            //output.print(y);
            //netSocket.getOutputStream().write(buffer);
            rawOut.flush();
            
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * A helper function that can add/remove a mask on a given message
     * @param message A byte array that represents the message that is to have the masking operation applied
     * @param mask A 4-byte array that represents the mask to apply
     * @return The message[] array that has had the mask operation applied. 
     */
    private byte[] masker(byte[] message, byte[] mask) {
        byte[] result = new byte[message.length];
        for(int i = 0; i < result.length; i++) {
            result[i] = (byte) (message[i] ^ mask[i & 0x3]);
        }
        return result;
    }    

    /**
     * A method that terminates an ongoing websocket connection. This should always be used before closing a thread to clean the connection up (avoid a dropped connection)
     * @return True, if the connection was closed, false otherwise. 
     */
    public boolean close() {
        if(!this.isInitialized) {
            return false;
        }
        //byte message = (byte) 132;
        try {
            byte[] close = { (byte) 136, 0};
            rawOut.write(close);
            rawOut.flush();
        } catch (IOException e) {
            return false;
        }
        this.isInitialized = false;
        return true; 
    }
}
