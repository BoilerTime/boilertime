package optimizer.algorithm;
import java.time.chrono.MinguoDate;
import java.util.HashMap;

import optimizer.Utils;

public class Course {
    private final String courseName; 
    private final CourseOverview template;
    private boolean isRunnable;
    private Section[] sections;
    private HashMap<String, Section> idSection; 


    public Course(CourseOverview info) {
        this.courseName = info.getCourseName();
        this.template = info;
        this.sections = new Section[info.getCourseTimes().length];
        this.idSection = new HashMap<String, Section>();
        this.isRunnable = false;
    }

    public Section[] instantiate(int minIndex, int overallSize) {
        if(isRunnable) {
            return sections;
        }
        
        //Get the length of the bistring that will identify each section
        int length = (int) Utils.LogB(overallSize, 2);
        for(int i = 0; i < sections.length; i++) {
            int[] id = Utils.numToBin(i + minIndex, length);
            String sid = Utils.arrToString(id);
            sections[i] = new Section(this, template.getCourseTimes()[i], template.getCourseDurations()[i], sid);
            idSection.put(sid, sections[i]);
        }
        return sections;
    }

    /**
     * A helper method tells the number of sections that exist for the course in question.
     * @return
     */
    public int getNumberOfSections() {
        if(template.getCourseTimes().length != template.getCourseDurations().length) {
            return -1;
        } else {
            return template.getCourseDurations().length;
        }
    }

/*     public Course(String name, String binID, int[] times, int[] courseDurations) {
        this.courseName = name; 
        this.binaryID = binID;
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
        this.timeDuration = new HashMap<Integer, Integer>();
        pushToHashMap();
    }

    public Course(CourseOverview info, String binID) {
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
    } */
}
