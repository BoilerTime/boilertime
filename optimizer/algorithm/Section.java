package optimizer.algorithm;


public class Section {
    private final Course parentCourse;
    private final int time;
    private final int duration;
    private final String ID;
    private final WeekDays daysOfWeekDays[];
    private final boolean required; 
    private final double rating;

    public Section(Course p, int t, int d, String id, WeekDays[] days, boolean require, double rating) {
        this.parentCourse = p;
        this.time = t;
        this.duration = d;
        this.ID = id;
        this.daysOfWeekDays = days; 
        this.required = require; 
        this.rating = rating;
    } 

    public Course getParent() {
        return this.parentCourse;
    }

    public int getTime() {
        return this.time;
    }

    public int getDuration() {
        return this.duration;
    }

    public String getID() {
        return this.ID;
    }

    public WeekDays[] getWeekDays() {
        return this.daysOfWeekDays;
    }

    public boolean isRequired() {
        return this.required;
    }

    public double getRating() {
        return this.rating;
    }

}
