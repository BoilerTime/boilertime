package optimizer;
import optimizer.network.*;
//Networking Import
import java.io.IOException;

public class RunSimulation {
    public static void main(String[] args) {
        System.out.println(args.length);

        // the response:
        try {
            new Server(3002).start();
        } catch (IOException e) {
            e.printStackTrace();
        }
  
        /*CourseOverview[] courses = OptimizerDecoder.parseIncomingData(args);//new CourseOverview[4];
        if(courses.length == 1) {
            System.out.println("{\"data\": [{\"courseID\": \"" + courses[0].getCourseName() + "\", \"courseStartTime\": \"" + courses[0].getCourseTimes()[0] + "\", \"courseDuration\": \"" + courses[0].getCourseDurations()[0] + "\"}]}"); 
            return;
        }
        System.out.println(courses);
        Population testPopulation = new Population(courses);
        Schedule best = testPopulation.getBestSchedule();
        Schedule best2 = best;
        System.out.println("The best schedule is: " + OptimizerDecoder.decodeOptimizedSchedule(best2));
        System.out.println("Leaving!");*/
        System.out.println("Exiting Algorithm!");
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