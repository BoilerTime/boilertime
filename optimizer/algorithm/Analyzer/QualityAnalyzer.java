package optimizer.algorithm.Analyzer;
import java.util.ArrayList;

import optimizer.Utils;
import optimizer.algorithm.Schedule;
import optimizer.constants.PreferenceList;
import optimizer.constants.TimeOfDay;

public class QualityAnalyzer extends RequiredAnalyzer {
    private ArrayList<Integer> overallScores;
    private ArrayList<Double> fft; 
    private ArrayList<Schedule> bestSchedules; 
    private PreferenceAnalyzer pref;


    public final static int numSimilarForConvergence = 100; 

    /**
     * A construct to the quality analyzer
     * @param prefs A list of preferences, the higher the position in the array the less important the preference 
     * @param t The time of day that is prefered
     */

    public QualityAnalyzer(PreferenceList[] prefs, TimeOfDay t, int numBlocks, int numCourses, int numSecondaries) {
        super(numBlocks, numCourses, numSecondaries);
        this.overallScores = new ArrayList<Integer>();
        this.fft = new ArrayList<Double>();
        this.bestSchedules = new ArrayList<Schedule>();
        this.pref = new PreferenceAnalyzer(prefs, t);
        //this.req = new RequiredAnalyzer(numBlocks, numCourses);
    }

    public void calculateTotalFitnessScores(Schedule[] target, int requiredCount) {
        //System.out.println("Calculating fitness scores!");
        super.calculateFitnessScores(target, requiredCount);
        this.pref.calculateOptionalScore(target);
    }

    public void calculateTotalIndividualFitnessScores(Schedule target, int requiredCount) {
        //System.out.println("Calculating fitness scores!");
        super.calculateIndividualRequiredScore(target, requiredCount);
        this.pref.calculateIndividualOptionalScore(target);
    }

    public int addScore(Schedule target) {
        //System.out.println("Score = " + target.getRequiredScore());
        //Set the two functions to have their appropriate values 
        super.addScore(target);
        pref.addScore(target);
        bestSchedules.add(target);
        
        overallScores.add(target.getFitnessScore());

        double beta = (double) target.getOptionalScore();
        double omicron = (1.0f) / (1.0f + beta);
        double dOmicron = - ((1.0f) / Math.pow(((1.0f) + beta), 2.0f));
        fft.add(omicron);
        //System.out.println("Delta Omicron = " + dOmicron);
        
        return 0;
    }
    
    public ArrayList<Integer> getOverallScores() {
        return this.overallScores;
    }
    
    public int calculateTangent(int pt1, int pt2) {
        return overallScores.get(pt1) - overallScores.get(pt2);
    }


    public double getRMSConvergence() {
        int size = bestSchedules.size();
        if(size < numSimilarForConvergence) {
            return Double.MAX_VALUE; 
        }

        //If we have generated more than enough schedules for convergence to have potentially occured,
        //then we want to next check the scores for the last numSimilarForConvergence scores to determine
        //If convergence has indeed occured. 

        //double resScore = fft.get(fft.size() - 1).doubleValue();
        double[] referenceFrame = new double[numSimilarForConvergence];
        for(int i = 0; i < referenceFrame.length; i++) {
            referenceFrame[i] = fft.get(size - (numSimilarForConvergence - i)).doubleValue();
        }

        double windowMean = Utils.calculateMean(referenceFrame);
        double rootMeanSquared = 0; 
        for(int i = 0; i < referenceFrame.length; i++) {
            //Calculate the square of the quantity w/o using math.pow which is slow
            rootMeanSquared += (referenceFrame[i] - windowMean) * (referenceFrame[i] - windowMean);
        }
        //System.out.println("RMS = " + Math.sqrt(rootMeanSquared / (double) size));
        return Math.sqrt(rootMeanSquared / (double) size);
    }

    public Schedule getBestSchedule() {
        return this.bestSchedules.get(this.bestSchedules.size() - 1);
    }
}
