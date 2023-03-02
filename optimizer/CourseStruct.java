package optimizer;
import java.util.HashMap;

public class CourseStruct {
    private String courseName; 
    private String binaryID; 
    private int[] courseTimes;
    private int[] courseDurations; 
    private HashMap<Integer, Integer> timeDuration; 

    public CourseStruct(String name, String binID, int[] times, int[] courseDurations) {
        this.courseName = name; 
        this.binaryID = binID;
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
        this.timeDuration = new HashMap<Integer, Integer>();
        pushToHashMap();
    }

    public CourseStruct(CourseOverview info, String binID) {
        this.courseName = info.getCourseName(); 
        this.binaryID = binID;
        this.courseTimes = info.getCourseTimes(); 
        this.courseDurations = info.getCourseDurations(); 
        this.timeDuration = new HashMap<Integer, Integer>();
        pushToHashMap();
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

    private void pushToHashMap() {
        for(int i = 0; i < courseTimes.length; i++) {
            timeDuration.put(Integer.valueOf(courseTimes[i]), Integer.valueOf(courseDurations[i]));
        }
    }

    public int getCourseDuration(int time) {
        Integer temp = timeDuration.get(time);
        if(temp == null) {
            return -1;
        }
        return temp.intValue();
    }
}
