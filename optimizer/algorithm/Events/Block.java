package optimizer.algorithm.Events;

import optimizer.parameters.BlockOverview;

public class Block extends Event {
    private final String assignedName;

    public Block(BlockOverview overview, String binID) {
        super(binID, overview.getStartTime(), overview.getDuration(), overview.getWeekDays());
        this.assignedName = overview.getName();
    }

    public String getAssignedName() {
        return this.assignedName;
    }
}
