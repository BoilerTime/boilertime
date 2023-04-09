package optimizer.network;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Scheduler implements ScheduleCallback {
    private Queue<Synchronizer> notifyList;
    private Queue<ScheduleClient> waitlist;
    private HashMap<Integer, ScheduleClient> doublewaitlist;
    private HashMap<Integer, Synchronizer> doublenotifylist;
    private int globalCount;

    public Scheduler() {
        this.notifyList = new LinkedList<Synchronizer>();
        this.waitlist = new LinkedList<ScheduleClient>();
        this.doublewaitlist = new HashMap<Integer, ScheduleClient>();
        this.doublenotifylist = new HashMap<Integer, Synchronizer>();
        this.globalCount = 0;
    }

    public synchronized void runClient(Socket client) {
        System.out.println("Running a new client!");
        //Create the new client objects required to run
        Synchronizer tempSync = new Synchronizer(waitlist.size(), waitlist.size());
        ScheduleClient temp = new ScheduleClient(client, this, tempSync, globalCount);
        temp.run(); //Run the client
        //Push the new stuff into hashmap to await data
        doublewaitlist.put(Integer.valueOf(globalCount), temp);
        doublenotifylist.put(Integer.valueOf(globalCount), tempSync);
    }

    @Override
    public synchronized void gotData(int x) {
        notifyList.add(doublenotifylist.get(Integer.valueOf(x)));
        waitlist.add(doublewaitlist.get(Integer.valueOf(x)));
    }

    @Override
    public synchronized void completeOptimization() {
        //System.out.println("DONE!!!" + x);
    }

    public int random() {
        return 100;
    }
}
