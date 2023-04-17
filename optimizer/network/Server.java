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
    private Scheduler scheduler; 

    public Server(int port) throws IOException {
        this.port = port;
        this.sSocket = new ServerSocket(this.port);
    }

    public void start() {

        this.run = true;
        this.scheduler = new Scheduler();
        Logger.getLogger(getClass().getName()).info("Server is listening on port: " + port);

        try {
            while (run) {
                Socket cs = sSocket.accept();
                Logger.getLogger(getClass().getName()).info("New Client Connected! " + cs.getPort());
                //this.scheduler.
                synchronized(scheduler) {
                    this.scheduler.runClient(cs);
                }
                //Thread x = new Thread(new ScheduleClient(cs)); // Put to a new thread.
                //x.start();
                //System.out.println("Started a new thread on " + cs.getPort());
                //x.interrupt();
               
                //System.out.println("IS interupted?" + x.isInterrupted());
            }
        } catch (IOException e) {
            Logger.getLogger(getClass().getName()).severe(e.getMessage());
        }
    }

    public void stop() {
        this.run = false;
    }
}
