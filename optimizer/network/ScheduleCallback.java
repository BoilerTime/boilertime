package optimizer.network;

public interface ScheduleCallback {
    void gotData(int x);
    void completeOptimization();
    void failedToGet(int x);
}
