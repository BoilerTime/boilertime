package optimizer.network;
//Networking import required to run the server 
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.logging.Logger;

public class Server {
    private ServerSocket sSocket;
    private boolean run;
    private int port;

    public Server(int port) throws IOException {
        this.port = port;
        this.sSocket = new ServerSocket(this.port);
    }

    public void start() {

        this.run = true;
        Logger.getLogger(getClass().getName()).info("Server is listening on port: " + port);

        try {
            while (run) {
                Socket cs = sSocket.accept();
                Logger.getLogger(getClass().getName())
                        .info("New Client Connected! " + cs.getPort());
                new Thread(new ScheduleClient(cs)).start(); // Put to a new thread.
            }
        } catch (IOException e) {
            Logger.getLogger(getClass().getName()).severe(e.getMessage());
        }
    }

    public void stop() {
        this.run = false;
    }
}
