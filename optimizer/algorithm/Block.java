package optimizer.algorithm;

public class Block extends Event {
    private final String humanName;

    public Block(BlockOverview overview, String binID) {
        super(binID, overview.getStartTime(), overview.getDuration(), overview.getWeekDays());
        this.humanName = overview.getName();
    }

    public String getHumanName() {
        return this.humanName;
    }
}
