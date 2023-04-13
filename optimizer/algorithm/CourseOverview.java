package optimizer.algorithm;

import optimizer.WeekDays;

public class CourseOverview {
    private String courseName; 
    private int[] courseTimes;
    private int[] courseDurations;
    private WeekDays[][] courseDaysOfWeek; 
    private String[] sectionIds;
    private final boolean required; 
    private double ratings[]; 

    public CourseOverview(String name, int[] times, int[] courseDurations, WeekDays[][] daysOfWeek, boolean isRequired, double[] ratings, String[] sectionIds) {
        this.courseName = name; 
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
        this.courseDaysOfWeek = daysOfWeek;
        this.required = isRequired;
        this.ratings = ratings;
        this.sectionIds = sectionIds;
    }

    public String getCourseName() {
        return this.courseName;
    }

    public int[] getCourseTimes() {
        return this.courseTimes;
    }

    public int[] getCourseDurations() {
        return this.courseDurations;
    }

    public int getNumberOfSections() {
        if(courseTimes.length != courseDurations.length) {
            return -1;
        } else {
            return courseTimes.length;
        }
    }

    public WeekDays[][] getWeekDays() {
        return this.courseDaysOfWeek;
    }

    public boolean isRequired() {
        return this.required;
    }

    public double[] getRatings() {
        return this.ratings;
    }
    
    public String[] getSectionIds() {
        return this.sectionIds;
    }
}
