package optimizer.network;

public class Synchronizer {
    private int waitlistSize;
    private int posInQueue;

    public Synchronizer(int initsize, int initpos) {
        this.waitlistSize = initsize;
        this.posInQueue = initpos;
    }
    
    public void setWaitList(int size) {
        this.waitlistSize = size;
    }

    public void setPosInQueue(int size) {
        this.posInQueue = size;
    } 

    public int getWaitlistSize() {
        return this.waitlistSize;
    }

    public int getPosInQueue() {
        return this.posInQueue;
    }
}
