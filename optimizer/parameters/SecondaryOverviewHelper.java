package optimizer.parameters;

import optimizer.Utils;
import optimizer.constants.WeekDays;

public class SecondaryOverviewHelper {
    private String secondaryName;
    private boolean required;
    //Course Time
    private int[] courseTimes;
    private int courseTimesPtr;
    //Course Duration
    private int[] courseDurations;
    private int courseDurationsPtr;
    //Days of week
    private WeekDays[][] weekDays;
    private int weekDaysPtr;
    //Section ids
    private String[] sectionIds;
    private int sectionIdsPtr;

    private String parentSection;


    /**
     * Constructor to create a wrapper class that assists in instantaiting a CourseOverview method.
     */
    public SecondaryOverviewHelper() {
        //Indicate that both of the course stacks cannot be used yet
        this.courseTimesPtr = -1;
        this.courseDurationsPtr = -1;
        this.weekDaysPtr = -1;
        this.sectionIdsPtr = -1;
        secondaryName = null;
        parentSection = null;
    }

    /**
     * Adds a name attribute to the helper class
     * @param name The name to be added
     */
    public void addName(String name) {
        this.secondaryName = name;
    }

    /**
     * A helper method to set the parent ID of the course that is in question
     * @param name A string that represents the ID. 
     */
    public void addParentSection(String name) {
        this.parentSection = name;
    }
    
    /**
     * Adds a flag of whether or not the course is required
     * @param r A boolean true if the course is required, otherwise false. 
     */
    public void setRequired(boolean r) {
        this.required = r;
    }


    /**
     * A method that pushes a new time to the list of times for a specific class
     * @param time The time that is to be added
     */
    public int addTime(int time) {
        if(this.courseTimesPtr < 0) {
            return -1;
        }
        this.courseTimes[this.courseTimesPtr++] = time;
        return 1; 
    }

    /**
     * A method that pushes a new time to the list of times for a specific class
     * @param duration The time that is to be added
     */
    public int addDuration(int duration) {
        if(this.courseDurationsPtr < 0) {
            return -1;
        }
        this.courseDurations[this.courseDurationsPtr++] = duration;
        return 1; 
    }

    public int addWeekDays(String days) {
        if(this.weekDaysPtr == -1) {
            return -1; 
        }
        weekDays[weekDaysPtr++] = Utils.strListToDayList(days, false);
        return 1;
    }


    /**
     * A helper method that is required in order to start adding sections so that it is knowable how many total sections there are
     * @param length The number of sections to be allocated. 
     */
    public void instantiateHelper(int length) {
        //Course times
        this.courseTimes = new int[length];
        this.courseTimesPtr = 0;
        //Course Durations
        this.courseDurations = new int[length];
        this.courseDurationsPtr = 0;
        //Week Days
        this.weekDays = new WeekDays[length][];
        this.weekDaysPtr = 0;

        //Ids
        this.sectionIds = new String[length];
        this.sectionIdsPtr = 0;
    }


    public String addSectionId(String id) {
        if(this.sectionIdsPtr < 0) {
            return null;
        }
        this.sectionIds[sectionIdsPtr++] = id;
        return id;
    }
    
    public int[] getTimes() {
        return this.courseTimes;
    }

    public int[] getDurations() {
        return this.courseDurations;
    }

    public WeekDays[][] getWeekDays() {
        return this.weekDays;
    }

    public String[] getSectionIDs() {
        return this.sectionIds;
    }

    public String getParentSections() {
        return this.parentSection;
    }
}
