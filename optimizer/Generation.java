package optimizer;

public class Generation {
    
    private Individual[] individuals;
    //Needs to correspond in position with individuals
    private int[] fitnessScores;
    
    public Generation(Individual[] population) {
        this.individuals = population;
        this.fitnessScores = new int[population.length];
    }

    public Generation(Individual[] population, int[] fScores) {
        this.individuals = population;
        this.fitnessScores = new int[population.length];
        saveFitnessScores(fScores);
    }
    
    public Individual getFittestIndividual() {
        return individuals[Utils.getIndexForMax(fitnessScores)];
    }

    public void saveFitnessScores(int[] scores) {
        if(scores.length != individuals.length) {
            System.out.println("Error saving scores");
        }
        this.fitnessScores = scores; 
    }

    public int[] getFittnessScores() {
        return this.fitnessScores; 
    }
}
