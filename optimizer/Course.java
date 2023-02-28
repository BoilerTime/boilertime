package optimizer;

public class Course {
    private String courseName; 
    private String binaryID; 
    private int[] courseTimes;
    private int[] courseDurations; 

    public Course(String name, String binID, int[] times, int[] courseDurations) {
        this.courseName = name; 
        this.binaryID = binID;
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
    }

    public String getCourseName() {
        return this.courseName;
    }

    public String getBinaryID() {
        return this.binaryID;
    }

    public int[] getCourseTimes() {
        return this.courseTimes;
    }

    public int[] getCourseDurations() {
        return this.courseDurations;
    }
}
