package optimizer;
import java.util.*;

public class Population {
    private Individual[] basicPopulation; 
    private int totalIndividuals; 
    private int initializedIndividuals; 

    public Population(int num) {
        this.totalIndividuals = num;
        basicPopulation = new Individual[num];
        this.initializedIndividuals = 0;
    }

    public void addIndividual(String className, int[] meetingsTimes, int[] durations) {
        //If we ca't add another individual, return a null ptr
        if(totalIndividuals >= initializedIndividuals) {
            return null;
        }

        basicPopulation[initializedIndividuals++] = new Individual(className, Arrays.toString(Utils.numToBin(totalIndividuals)), meetingsTimes, durations);
    }
}
