package optimizer.algorithm;
import optimizer.Utils;
import optimizer.constants.Constants;
import java.util.Random;

public class Tournament {
    private final Schedule[] parentPool;    
    private final Random r; 
    private final int prob;
    private final boolean select;

    public Tournament(Schedule[] parentPool, Random r, int prob, boolean select) {
        this.parentPool = parentPool;
        this.r = r;
        this.prob = prob;
        this.select = select;
    }

    public Schedule tournament(Schedule[] target) {
        return this.tournamentHelper(target);
    }

    private Schedule tournamentHelper(Schedule[] target) {
        //Schedule[][] result = new Schedule[target.length - 1][target[0].length / 2];
        Schedule[] result = new Schedule[8];
        for(int i = 0; i < result.length; i++) {
            result[i] = target[Utils.randInRange(r, 0, target.length - 1)];
        }  
        Utils.sortScheduleArray(result, 0, result.length - 1);
        return result[0];  
    }
}
