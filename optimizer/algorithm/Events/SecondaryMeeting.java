package optimizer.algorithm.Events;

import optimizer.parameters.SecondaryOverview;

public class SecondaryMeeting extends Event {

    private final String secondaryType;

    public SecondaryMeeting(SecondaryOverview s, int i, String binID) {
        super(binID, s.getTimes()[i], s.getDurations()[i], s.getWeekDays()[i]);
        this.secondaryType = s.getSecondaryType();
    }

    public String getAssignedName() {
        return this.secondaryType;
    }
}
