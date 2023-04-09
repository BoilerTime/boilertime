package optimizer.network;

import java.net.Socket;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;

public class Scheduler implements ScheduleCallback {
    private Queue<Synchronizer> notifyList;
    private Queue<ScheduleClient> waitlist;
    private HashMap<Integer, ScheduleClient> doublewaitlist;
    private HashMap<Integer, Synchronizer> doublenotifylist;
    private int globalCount;
    private int inProgress;

    public Scheduler() {
        this.notifyList = new LinkedList<Synchronizer>();
        this.waitlist = new LinkedList<ScheduleClient>();
        this.doublewaitlist = new HashMap<Integer, ScheduleClient>();
        this.doublenotifylist = new HashMap<Integer, Synchronizer>();
        this.globalCount = 0;
        this.inProgress = 0;
    }

    public synchronized void runClient(Socket client) {
        System.out.println("Running a new client!");
        //Create the new client objects required to run
        Synchronizer tempSync = new Synchronizer(waitlist.size(), waitlist.size());
        ScheduleClient temp = new ScheduleClient(client, this, tempSync, globalCount);
        temp.start();
        doublewaitlist.put(Integer.valueOf(globalCount), temp);
        doublenotifylist.put(Integer.valueOf(globalCount), tempSync);
        globalCount++;
    }

    @Override
    public synchronized void gotData(int x) {
        System.out.println("Task " + x + " is ready to be placed into the queue.");
        notifyList.add(doublenotifylist.get(Integer.valueOf(x)));
        System.out.println("Go the notifyList: " + doublenotifylist.get(Integer.valueOf(x)));
        waitlist.add(doublewaitlist.get(Integer.valueOf(x)));
        this.runOptimizer();
        this.broadcastQueue();
    }

    @Override
    public synchronized void completeOptimization() {
        this.inProgress--;
        runOptimizer();
        broadcastQueue();
    }

    public synchronized void runOptimizer() {
        if(this.inProgress != 0 ) {
            return;
        }

        Synchronizer lock = notifyList.remove();
        ScheduleClient target = waitlist.remove();

        synchronized(target) {
            target.runOptimizer();
        }

        synchronized(lock) {
            lock.setPosInQueue(0);
            lock.setWaitList(waitlist.size());
            lock.notify();
        }
        this.inProgress++;

    }

    private synchronized void broadcastQueue() {
        int size = notifyList.size();
        //notifyList.forEach(null);
        int count = 0;
        for(Synchronizer i: notifyList) {
            //Input the new data
            i.setPosInQueue(count);
            i.setWaitList(size);
            //Tell the thread to let the client know that there's been a status update
            synchronized(i) {
                i.notify();
            }
        }
    }
}
