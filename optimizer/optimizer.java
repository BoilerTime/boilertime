package optimizer;
import java.util.Random;

public class Optimizer {
    public static void main(String[] args) {
        Chromosome c1 = new Chromosome("100000011011010100101");
        Chromosome c2 = new Chromosome("011101101010011111110");
        Chromosome[] population = new Chromosome[5];
        population = c1.crossOver(c2);
        System.out.println(population[0].getChromosome());
        population[1] = c1.mutate();
        System.out.println(population[1].getChromosome());
    }
    
}