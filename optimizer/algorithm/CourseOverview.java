package optimizer.algorithm;

public class CourseOverview {
    private String courseName; 
    private int[] courseTimes;
    private int[] courseDurations;
    private WeekDays[][] courseDaysOfWeek; 
    private final boolean required; 

    public CourseOverview(String name, int[] times, int[] courseDurations, WeekDays[][] daysOfWeek, boolean isRequired) {
        this.courseName = name; 
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
        this.courseDaysOfWeek = daysOfWeek;
        this.required = isRequired;
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
}
