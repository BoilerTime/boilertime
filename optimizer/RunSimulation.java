package optimizer;
import java.util.Arrays;

public class RunSimulation {
    public static void main(String[] args) {
        //System.out.println(args[0]);
        Individual c1 = new Individual("100000011011010100101");
        Individual c2 = new Individual("011101101010011111110");
        Individual[] population = new Individual[5];
        population = c1.crossOver(c2);
        System.out.println(Arrays.toString(population));
        System.out.println(population[0].getIndividual());
        population[1] = c1.mutate();
        System.out.println(population[1].getIndividual());
        int[] times = {1200, 1400, 1600};
        int[] durations = {50, 50, 50};
        CourseStruct i1 = new CourseStruct("CS180", "100000011011010100101", times, durations);
        System.out.println(i1);
        /*CourseOverview[] courses = new CourseOverview[3];
        int[] times1 = {1200, 1400, 1600};
        int[] durations1 = {50, 50, 50};
        courses[0] = new CourseOverview("CS180", times1, durations1);
        int[] times2 = {1300, 1900, 2100};
        int[] durations2 = {70, 50, 30};
        courses[1] = new CourseOverview("CS182", times2, durations2);

        courses[2] = new CourseOverview("MA261", times1, durations2);

        Population testPopulation = new Population(courses);
        testPopulation.getFittestIndividual();
        System.out.println(testPopulation);
        System.out.println(testPopulation.getFittestIndividual().getIndividual());
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