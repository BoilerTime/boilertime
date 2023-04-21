package optimizer.algorithm.Events;

import optimizer.constants.WeekDays;
import optimizer.parameters.Secondary;
import optimizer.parameters.SecondaryOverview;

public class SecondaryMeeting extends Event {

    private final String secondaryType;
    private final String parentSection;
    private final Secondary parent;

    public SecondaryMeeting(Secondary s, int startTime, int duration, WeekDays[] days, String SID) {
        super(SID, startTime, duration, days);
        this.secondaryType = s.getType();
        this.parent = s;
        this.parentSection = s.getParentSectionID();
    }

    public String getAssignedName() {
        return this.secondaryType;
    }

    public String getParentSection() {
        return this.parentSection;
    }

    public Secondary getParent() {
        return this.parent;
    }


}
