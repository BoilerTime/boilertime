package optimizer.algorithm;

import optimizer.WeekDays;

public class BlockOverview {
    private final String name;
    private final int startTime;
    private final int duration;
    private final WeekDays[] weekDays;

    public BlockOverview(String name, int start, int dur, WeekDays[] days) {
        this.name = name;
        this.startTime = start;
        this.duration = dur;
        this.weekDays = days;
    }

    public String getName() {
        return this.name;
    }

    public int getStartTime() {
        return this.startTime;
    }

    public int getDuration() {
        return this.duration;
    }

    public WeekDays[] getWeekDays() {
        return this.weekDays;
    }
}
