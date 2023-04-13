package optimizer.algorithm;

import optimizer.WeekDays;

public abstract class Event {
    private final int startTime;
    private final int duration;
    private final String ID;
    private final WeekDays[] daysOfWeek;

    public Event(String id, int start, int duration, WeekDays[] days) {
        this.ID = id;
        this.startTime = start;
        this.duration = duration;
        this.daysOfWeek = days;
    }

    public String getID() {
        return this.ID;
    }

    public int getStartTime() {
        return this.startTime;
    }

    public int getDuration() {
        return this.duration;
    }

    public WeekDays[] getDaysOfDays() {
        return this.daysOfWeek;
    }
}
