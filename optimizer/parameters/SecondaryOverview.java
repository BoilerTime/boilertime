package optimizer.parameters;

import optimizer.constants.WeekDays;

public class SecondaryOverview {
    private int[] courseTimes;
    private int[] courseDurations;
    private WeekDays[][] courseDaysOfWeek; 
    private String[] sectionIds;
    private final String parentSections;
    private final String secondaryType;

    public SecondaryOverview(SecondaryOverviewHelper sec) {
        this.courseTimes = sec.getTimes(); 
        this.courseDurations = sec.getDurations(); 
        this.courseDaysOfWeek = sec.getWeekDays();
        this.sectionIds = sec.getSectionIDs();
        this.parentSections = sec.getParentSections();
        this.secondaryType = sec.getType();
    }

    public int[] getTimes() {
        return this.courseTimes;
    }

    public int[] getDurations() {
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
    
    public String[] getSectionIds() {
        return this.sectionIds;
    }

    public String getParentSections() {
        return this.parentSections;
    }

    public String getSecondaryType() {
        return this.secondaryType;
    }
}
