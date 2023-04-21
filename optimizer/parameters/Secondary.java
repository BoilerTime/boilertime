package optimizer.parameters;
import java.util.HashMap;

import optimizer.Utils;
import optimizer.algorithm.Events.Lecture;
import optimizer.algorithm.Events.SecondaryMeeting;
import optimizer.constants.Constants;

public class Secondary {
    private final SecondaryOverview template;
    private boolean isRunnable;
    private SecondaryMeeting[] meetings;
    private HashMap<String, SecondaryMeeting> idSection; 
    private String[] sectionIds;
    private String parentSections;
    private String parentCourse;


    public Secondary(SecondaryOverview info) {
        this.template = info;
        this.meetings = new SecondaryMeeting[info.getTimes().length];
        this.idSection = new HashMap<String, SecondaryMeeting>();
        this.isRunnable = false;
        this.sectionIds = info.getSectionIds();
        this.parentSections = info.getParentSections();
        this.parentCourse = info.getParentCourse();
    }

    /**
     * This method ensures that all sections of the course are set-up properly. Must be called BEFORE trying to optimize where each section is required. 
     * @param minIndex The minimum index that may be used for sections in this block.
     * @param overallSize The total number of bits that are required to represent each section {ceil (log)_2} of total number of sections
     * @return An array of sections that were just created. 
     */
    public SecondaryMeeting[] instantiate(int minIndex, int length) {
        if(isRunnable) {
            return meetings;
        }
        
        //Get the length of the bistring that will identify each section
        //int length = (int) Utils.LogB(overallSize, 2);
        for(int i = 0; i < meetings.length; i++) {
            int[] id = Utils.numToBin(i + minIndex, length);
            String sid = Constants.SECONDARY + Utils.arrToString(id);
            this.meetings[i] = new SecondaryMeeting(this, parentCourse, template.getTimes()[i], template.getDurations()[i], template.getWeekDays()[i], sid);
            idSection.put(sid, this.meetings[i]);
        }
        return this.meetings;
    }

    /**
     * A helper method tells the number of secondaries for the section in question
     * @return The number of sections, if the times and durations arrays are the same, otherwise -1. 
     */
    public int getNumberOfSecondaries() {
        if(template.getTimes().length != template.getDurations().length) {
            return -1;
        } else {
            return template.getDurations().length;
        }
    }

    public String getType() {
        return this.template.getSecondaryType();
    }

    public String getParentSectionID() {
        return this.template.getParentSections();
    }

    public SecondaryMeeting[] getSecondaryMeetings() {
        return this.meetings;
    }

}
