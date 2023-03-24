package optimizer.algorithm;
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

    /**
     * This method ensures that all sections of the course are set-up properly. Must be called BEFORE trying to optimize where each section is required. 
     * @param minIndex The minimum index that may be used for sections in this block.
     * @param overallSize The total number of bits that are required to represent each section {ceil (log)_2} of total number of sections
     * @return An array of sections that were just created. 
     */
    public Section[] instantiate(int minIndex, int length) {
        if(isRunnable) {
            return sections;
        }
        
        //Get the length of the bistring that will identify each section
        //int length = (int) Utils.LogB(overallSize, 2);
        for(int i = 0; i < sections.length; i++) {
            int[] id = Utils.numToBin(i + minIndex, length);
            String sid = Utils.arrToString(id);
            sections[i] = new Section(this, template.getCourseTimes()[i], template.getCourseDurations()[i], sid, template.getWeekDays()[i]);
            idSection.put(sid, sections[i]);
        }
        return sections;
    }

    /**
     * A helper method tells the number of sections that exist for the course in question.
     * @return The number of sections, if the times and durations arrays are the same, otherwise -1. 
     */
    public int getNumberOfSections() {
        if(template.getCourseTimes().length != template.getCourseDurations().length) {
            return -1;
        } else {
            return template.getCourseDurations().length;
        }
    }

    /**
     * A helper that returns the name of the associated course.
     * @return The name of the course.
     */
    public String getCourseName() {
        return this.courseName;
    }
}
