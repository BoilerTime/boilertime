package optimizer.network;
import java.net.Socket;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Scheduler implements ScheduleCallback {
    private Queue<Object> optimizeWaitlist;

    public Scheduler() {
        optimizeWaitlist = new LinkedList<Object>();
    }

    public synchronized void runClient(Socket client) {
        System.out.println("Running a new client!");
        optimizeWaitlist.add(new Object());
        Thread random = new Thread(new ScheduleClient(client, this, optimizeWaitlist.peek()));
        random.start();
        Scanner s = new Scanner(System.in);
        s.nextLine();
        s.close();
        synchronized (optimizeWaitlist.peek()) {
            optimizeWaitlist.peek().notify();
        }
    }

    @Override
    public void gotData(String x) {

    }

    @Override
    public void completeOptimization(String x) {

    }

    public int random() {
        return 100;
    }
}
