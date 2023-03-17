package optimizer.network;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;

public class HandshakeHelper {
    public static String generateHandshake(String incomingHandShake) {
        String handshakeTemplate = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n\r\n";;
        HashMap<String, String> inputArgs = parseIncomingRequestKey(incomingHandShake);
        String responseSHA = generateSHA1(inputArgs.get("Sec-WebSocket-Key") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
        return String.format(handshakeTemplate, responseSHA);
    }

    public static HashMap<String, String> parseIncomingRequestKey(String s) {
        HashMap<String, String> input = new HashMap<String, String>();
        String[] arguments = s.split("\n");
        for(int i = 0; i < arguments.length; i++) {
            String[] linArg = arguments[i].split(": ");
            //If no : separate arg, then just skip over it. 
            if(linArg.length == 1) {
                continue;
            }
            input.put(linArg[0], linArg[1]);
        }
        return input;
    }

    public static String generateSHA1(String input) {
        try {
            MessageDigest mDigest = MessageDigest.getInstance("SHA1");
            byte[] result = mDigest.digest(input.getBytes());
            return Base64.getEncoder().encodeToString(result);
        } catch(NoSuchAlgorithmException e) {
            return null;
        }
    }

}
