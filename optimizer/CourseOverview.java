package optimizer;

public class CourseOverview {
    private String courseName; 
    private int[] courseTimes;
    private int[] courseDurations; 

    public CourseOverview(String name, int[] times, int[] courseDurations) {
        this.courseName = name; 
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
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
}