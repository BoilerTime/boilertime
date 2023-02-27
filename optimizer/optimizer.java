package optimizer;
import java.util.Arrays;
import java.util.Random;

public class Optimizer {
    public static void main(String[] args) {
        System.out.println(args[0]);
        Chromosome c1 = new Chromosome("100000011011010100101");
        Chromosome c2 = new Chromosome("011101101010011111110");
        Chromosome[] population = new Chromosome[5];
        population = c1.crossOver(c2);
        System.out.println(Arrays.toString(population));
        System.out.println(population[0].getChromosome());
        population[1] = c1.mutate();
        System.out.println(population[1].getChromosome());
    }

    /**
     * Class ID = log_2n where n is the number of classes whose schedule is to be optimized
     * Class time = log_2(24) + log_2(60), representing all possible times that exist on a 24-hour clock
     * Supplemental time (to-do) = log_2(24) + log_2(60), representing all possible times that exist on a 24-hour clock
     */
    /*
     * courses 
     * {
     *  [
     *      {
     *          courseName: CS180
     *          courseTimes: [1300, 1500, 1800],
     *          duration: [50, 50, 50]
     *      }, 
     *      {
     *          courseName: MA26100
     *          courseTimes: [0900, 1100, 1300]
     *          duration: [50, 50, 50]
     *      },
     *      {
     *          courseName: CS182
     *          courseTimes: [1100, 1200, 1700]
     *          duration: [110, 110, 110]
     *      }
     *  ]
     * }
     */
    
}