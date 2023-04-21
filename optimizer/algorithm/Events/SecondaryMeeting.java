package optimizer.algorithm.Events;

import optimizer.constants.WeekDays;
import optimizer.parameters.Secondary;

public class SecondaryMeeting extends Event {

    private final String secondaryType;
    private final String parentSection;
    private final Secondary parent;
    private final String parentCourse;
    private final String currentID;

    public SecondaryMeeting(Secondary s, String parentCourse, int startTime, int duration, WeekDays[] days, String SID, String currentID) {
        super(SID, startTime, duration, days);
        this.secondaryType = s.getType();
        this.parent = s;
        this.parentSection = s.getParentSectionID();
        this.parentCourse = parentCourse;
        this.currentID = currentID;
    }

    public String getAssignedName() {
        return this.secondaryType+""+parentCourse;
    }

    public String getParentSection() {
        return this.parentSection;
    }

    public Secondary getParent() {
        return this.parent;
    }

    public String getParentCourse() {
        return this.parentCourse;
    }

    public String getCurrentID() {
        return this.currentID;
    }

}
