package optimizer.algorithm;

import java.util.ArrayList;

import optimizer.algorithm.Events.Section;
import optimizer.constants.PreferenceList;
import optimizer.constants.TimeOfDay;

public class PreferenceAnalyzer {

    /**
     * A parameter that specifies the direction that optimization should be occuring in. 
     * True = Maximization (higher values better)
     * False = Minimizatio (lower values better)
     */
    private PreferenceList[] optimizationParameterRanking;
    private TimeOfDay timePreference; 

    //Convergence Parameter
    private ArrayList<Integer> optionalScore;
    private ArrayList<Integer> timeScore;
    private ArrayList<Integer> rmpScore; 

    private static final int parameterDiscriminat = 10; 

    /**
     * Constructor that creates a new object that measures the optimization status.
     * @param m The direction that is to be optimized in favor of. True = Maximization (higher values better). False = Minimizatio (lower values better)
     * @param prefernceList The order in which preferences are to be considered, with [0] being the highest priority and [max-1] being the lowest priority.
     */
    public PreferenceAnalyzer(PreferenceList[] preferenceList, TimeOfDay time) {
        this.optimizationParameterRanking = preferenceList;
        this.timePreference = time;
        this.optionalScore = new ArrayList<Integer>();
        this.timeScore = new ArrayList<Integer>();
        this.rmpScore = new ArrayList<Integer>();
    }

    public void calculateOptionalScore(Schedule[] target) {
        int[] rmpPenalty = new int[target.length];
        int[] timePenalty = new int[target.length];
        int[] weightedPenalty = new int[target.length];
        for(int i = 0; i < target.length; i++) {
            Schedule temp = target[i];
            rmpPenalty[i] = this.calculateRMPPenalty(temp);
            timePenalty[i] = calculateTimePenalty(temp);
            weightedPenalty[i] = this.calculateWeightedPenalty(rmpPenalty[i], timePenalty[i]);
            temp.setOptionalScore(weightedPenalty[i]);
        }
        //System.out.println(Arrays.toString(weightedPenalty));
    }

    private int calculateRMPPenalty(Schedule target) {
        Section[] courses = target.getSections();
        int cummulativePenalty = 0;
        //int[] penaltyArray = new int[courses.length];
        for(int i = 0; i < courses.length; i++) {
            if(courses[i] == null) {
                cummulativePenalty += target.getSections().length;
                continue;
            }
            double rating = courses[i].getRating();
            int betterThan = courses[i].getParent().getNumBetterThan(rating);
            cummulativePenalty += betterThan;
        }
        return cummulativePenalty;
    }

    private int calculateTimePenalty(Schedule target) {
        Section[] courses = target.getSections();
        int cummulativePenalty = 0;
        for(int i = 0; i < courses.length; i++) {
            if(courses[i] == null) {
                cummulativePenalty++;
                continue;
            }
            if(this.timePreference == TimeOfDay.MORNGING) {
                if(courses[i].getStartTime() >= 1300) {
                    cummulativePenalty++;
                }
            } else {
                if(courses[i].getStartTime() < 1300) {
                    cummulativePenalty++;
                }
            }
        }
        return cummulativePenalty;
    }

    private int calculateWeightedPenalty(int rmp, int time) {
        int weightedPenalty = 0; 
        for(int i = 0; i < this.optimizationParameterRanking.length; i++) {
            if(optimizationParameterRanking[i] == PreferenceList.RMP) {
                weightedPenalty += ((i+1) * parameterDiscriminat) * rmp;
                //System.out.println("Parameter Discriminat = " + (((i+1) * parameterDiscriminat) * rmp));
            } else {
                weightedPenalty += ((i+1) * parameterDiscriminat) * time;
            }
        }
        return weightedPenalty;
    }

    public ArrayList<Integer> getPreferenceScores() {
        return this.optionalScore;
    }

    public int addScore(Schedule target) {
        int score = target.getOptionalScore();
        this.optionalScore.add(Integer.valueOf(score));
        int delta = score;
        if(this.optionalScore.size() > 2 ) {
            //Calculate Δ fitness
            int backTwo = this.optionalScore.get(this.optionalScore.size() - 2);
            delta -= backTwo;
        }
        return delta;
    }
}
