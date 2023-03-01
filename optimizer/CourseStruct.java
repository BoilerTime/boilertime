package optimizer;

public class CourseStruct {
    private String courseName; 
    private String binaryID; 
    private int[] courseTimes;
    private int[] courseDurations; 

    public CourseStruct(String name, String binID, int[] times, int[] courseDurations) {
        this.courseName = name; 
        this.binaryID = binID;
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
    }

    public CourseStruct(CourseOverview info, String binID) {
        this.courseName = info.getCourseName(); 
        this.binaryID = binID;
        this.courseTimes = info.getCourseTimes(); 
        this.courseDurations = info.getCourseDurations(); 
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
