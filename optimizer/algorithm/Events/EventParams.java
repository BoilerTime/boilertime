package optimizer.algorithm.Events;

import optimizer.constants.WeekDays;

public interface EventParams {
    public String getID();
    public int getStartTime();
    public int getDuration();
    public WeekDays[] getDaysOfDays();
    public String getAssignedName();
}
