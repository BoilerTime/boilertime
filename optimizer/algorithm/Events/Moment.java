package optimizer.algorithm.Events;

import optimizer.constants.WeekDays;

public class Moment {
    private final int time;
    private final WeekDays[] days;

    public Moment(int t, WeekDays[] d) {
        this.time = t;
        this.days = d;
    }

    public int getTime() {
        return this.time;
    }

    public WeekDays[] getWeekDays() {
        return this.days;
    }
}
