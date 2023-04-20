package optimizer.algorithm.Events;

import optimizer.parameters.BlockOverview;
import optimizer.parameters.SecondaryOverview;

public class SecondaryMeeting extends Event {

    public SecondaryMeeting(SecondaryOverview s, int i, String binID) {
        super(binID, s.getTimes()[i], s.getDurations()[i], s.getWeekDays()[i]);
    }

    public String getAssignedName() {
        return "Secondary";
    }
}
