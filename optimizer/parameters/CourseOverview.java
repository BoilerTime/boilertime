package optimizer.parameters;

import optimizer.constants.WeekDays;

public class CourseOverview {
    private String courseName; 
    private int[] courseTimes;
    private int[] courseDurations;
    private WeekDays[][] courseDaysOfWeek; 
    private String[] sectionIds;
    private final boolean required; 
    private double ratings[]; 
    private final String[] parentSections;
    private final SecondaryOverviewHelper[] secondaries;

    public CourseOverview(String name, int[] times, int[] courseDurations, WeekDays[][] daysOfWeek, boolean isRequired, double[] ratings, String[] sectionIds, String[] parentSections, SecondaryOverviewHelper[] secondaries) {
        this.courseName = name; 
        this.courseTimes = times; 
        this.courseDurations = courseDurations; 
        this.courseDaysOfWeek = daysOfWeek;
        this.required = isRequired;
        this.ratings = ratings;
        this.sectionIds = sectionIds;
        this.parentSections = parentSections;
        this.secondaries = secondaries;
        System.out.println(name + " is required? " + isRequired);
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

    public double[] getRatings() {
        return this.ratings;
    }
    
    public String[] getSectionIds() {
        return this.sectionIds;
    }

    public String[] getParentSections() {
        return this.parentSections;
    }

    public SecondaryOverview[] getRelatedSecondaries() {
        SecondaryOverview[] results = new SecondaryOverview[this.secondaries.length];
        for(int i = 0; i < results.length; i++) {
            results[i] = new SecondaryOverview(this.secondaries[i]);
        }
        return results;
    }

    public boolean hasSecondaries() {
        for(int i = 0; i < this.secondaries.length; i++) {
            if(secondaries[i].getNumberOfSecondaries() > 0) {
                return true;
            }
        }
        return false;
    } 
}
