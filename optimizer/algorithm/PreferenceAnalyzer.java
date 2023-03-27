package optimizer.algorithm;

public class PreferenceAnalyzer {

    /**
     * A parameter that specifies the direction that optimization should be occuring in. 
     * True = Maximization (higher values better)
     * False = Minimizatio (lower values better)
     */
    private boolean optimizationMode;
    private PreferenceList[] optimizationParameterRanking;
    

    /**
     * Constructor that creates a new object that measures the optimization status.
     * @param m The direction that is to be optimized in favor of. True = Maximization (higher values better). False = Minimizatio (lower values better)
     * @param prefernceList The order in which preferences are to be considered, with [0] being the highest priority and [max-1] being the lowest priority.
     */
    public PreferenceAnalyzer(boolean m, PreferenceList[] preferenceList) {
        this.optimizationMode = m;
        this.optimizationParameterRanking = preferenceList;
    }
}
