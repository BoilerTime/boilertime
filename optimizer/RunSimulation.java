package optimizer;
import optimizer.algorithm.*;
import optimizer.network.*;
//Networking Import
import java.io.IOException;

import optimizer.algorithm.CourseOverview;
import optimizer.algorithm.OptimizerDecoder;

public class RunSimulation {
    public static void main(String[] args) {
        System.out.println(args.length);

        // the response:
        /*try {
            new Server(3002).start();
        } catch (IOException e) {
            e.printStackTrace();
        }*/
  
        CourseOverview[] courses = OptimizerDecoder.parseIncomingData(args);//new CourseOverview[4];
        if(courses.length == 1) {
            System.out.println("{\"data\": [{\"courseID\": \"" + courses[0].getCourseName() + "\", \"courseStartTime\": \"" + courses[0].getCourseTimes()[0] + "\", \"courseDuration\": \"" + courses[0].getCourseDurations()[0] + "\"}]}"); 
            return;
        }
        System.out.println(courses);
        /*System.out.println(courses.length);
        for(int i = 0; i < courses.length; i++) {
            System.out.println(courses[i].getCourseName() + " " + Arrays.toString(courses[i].getCourseTimes()) + " " + Arrays.toString(courses[i].getCourseDurations()));
            System.out.println(courses[i].getCourseTimes().length + " " + courses[i].getCourseDurations().length);
        }*/
        /*int[] times1 = {1200, 1400, 1600};
        int[] durations1 = {50, 50, 50};
        courses[0] = new CourseOverview("CS180", times1, durations1);
        int[] times2 = {1300, 1900, 2100};
        int[] durations2 = {70, 50, 30};
        int[] times3 = {1200, 1400, 1800};
        courses[1] = new CourseOverview("CS182", times3, durations2);

        courses[2] = new CourseOverview("MA261", times2, durations2);
        courses[3] = new CourseOverview("CS101", times3, durations2);*/

        Population testPopulation = new Population(courses);
        Schedule best = testPopulation.getBestSchedule();
        Schedule best2 = best;
        System.out.println("The best schedule is: " + best2);
        System.out.println("Leaving!");
        //System.out.println(testPopulation.getBestSchedule());
        /*Individual fittestIndividual = testPopulation.getFittestIndividual();
        if(fittestIndividual == null) {
            System.err.println("No solution exists");
            return;
        }
        System.out.println(OptimizerDecoder.decodeOptimizedSchedule(testPopulation, fittestIndividual));*/
        //System.out.println(OptimizerDecoder.decodeOptimizedSchedule(testPopulation, testPopulation.getFittestIndividual()));
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