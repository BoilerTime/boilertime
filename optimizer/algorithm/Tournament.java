package optimizer.algorithm;
import optimizer.Utils;
import optimizer.constants.Constants;
import java.util.Random;

public class Tournament {
    private final Schedule[] parentPool;    
    private final Random r; 
    private final int tournamentSize; 
    private final int prob;

    public Tournament(Schedule[] parentPool, Random r, int size, int prob) {
        this.parentPool = parentPool;
        this.r = r;
        this.tournamentSize = size;
        this.prob = prob;
    }

    public Schedule tournament(Schedule[] target) {
        return this.tournamentHelper(target);
    }

    private Schedule tournamentHelper(Schedule[] target) {
        //Schedule[][] result = new Schedule[target.length - 1][target[0].length / 2];
        if(target.length == 1) {
            return target[0];
        } else {
            Schedule[] temp = new Schedule[target.length / 2];
            for(int i = 0; i < temp.length; i++) {
                Schedule x = target[i];
                Schedule y = target[target.length - i];
                if(Utils.randInRange(r, 1, 100) < prob) {
                    temp[i] = x;
                } else {
                    temp[i] = y;
                }
            }
            return tournamentHelper(temp);
        }       
    }
}
