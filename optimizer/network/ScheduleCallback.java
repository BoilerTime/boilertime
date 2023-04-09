package optimizer.network;

public interface ScheduleCallback {
    void gotData(String x);
    void completeOptimization();
}
