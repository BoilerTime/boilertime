package optimizer.algorithm;
import java.util.ArrayList;

public class QualityAnalyzer {
    private ArrayList<Integer> optionalScores;
    private ArrayList<Integer> deltaOptionalScores;
    private boolean optimizationMode;

    public QualityAnalyzer(boolean mode) {
        this.optimizationMode = mode; 
        this.optionalScores = new ArrayList<Integer>();
        this.deltaOptionalScores = new ArrayList<Integer>();
    }


    public static int calculateIndividualScore(Schedule target, boolean mode, int totalClasses) {
        int overallScore = 0;
        overallScore += RequiredAnalyzer.calculateIndividualRequiredScore(target, mode, totalClasses);
        return overallScore;
    }
    
}
