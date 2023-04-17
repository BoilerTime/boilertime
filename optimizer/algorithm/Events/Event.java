package optimizer.algorithm.Events;

import optimizer.constants.WeekDays;

public abstract class Event implements EventParams {
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

    @Override
    public String getID() {
        return this.ID;
    }

    @Override
    public int getStartTime() {
        return this.startTime;
    }

    @Override
    public int getDuration() {
        return this.duration;
    }

    @Override
    public WeekDays[] getDaysOfDays() {
        return this.daysOfWeek;
    }

}
