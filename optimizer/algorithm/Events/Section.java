package optimizer.algorithm.Events;

import optimizer.algorithm.Course;
import optimizer.constants.WeekDays;

public class Section extends Event {
    private final Course parentCourse;
    private final boolean required; 
    private final double rating;
    private final String sectionId; 

    public Section(Course p, int t, int d, String id, WeekDays[] days, boolean require, double rating, String sectionId) {
        super(id, t, d, days);
        this.parentCourse = p;
        this.required = require; 
        this.rating = rating;
        this.sectionId = sectionId;  
    } 

    public Course getParent() {
        return this.parentCourse;
    }

    public boolean isRequired() {
        return this.required;
    }

    public double getRating() {
        return this.rating;
    }

    public String getSectionId() {
        return this.sectionId;
    }

    public String getAssignedName () {
        return this.parentCourse.getCourseName();
    }

}
