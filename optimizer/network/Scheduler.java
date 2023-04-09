package optimizer.network;
import java.net.Socket;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Scheduler implements ScheduleCallback {
    private Queue<Synchronizer> notifyList;
    private Queue<ScheduleClient> waitlist;

    public Scheduler() {
        notifyList = new LinkedList<Synchronizer>();
        waitlist = new LinkedList<ScheduleClient>();
    }

    public synchronized void runClient(Socket client) {
        System.out.println("Running a new client!");
        notifyList.add(new Object());
        ScheduleClient random = new ScheduleClient(client, this, notifyList.peek());
        random.start();
        Scanner s = new Scanner(System.in);
        s.nextLine();
        synchronized (notifyList.peek()) {
            notifyList.peek().notify();
        }
        s.nextLine();
        synchronized (random) {
            //optimizeWaitlist.peek().notify();
            random.runOptimizer();
        }
    }

    @Override
    public void gotData(String x) {

    }

    @Override
    public synchronized void completeOptimization() {
        //System.out.println("DONE!!!" + x);
    }

    public int random() {
        return 100;
    }
}
