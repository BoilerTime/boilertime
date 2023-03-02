package optimizer;
import java.util.*;

public class OptimizerDecoder {
    public static String decodeOptimizedSchedule(Population p, Individual optIndividual) {
        String result = "{[";
        String courseFormatString = "{\"courseID\": \"course_id\", \"courseStartTime\": \"course_start_time\", \"courseDuration:\": \"course_duration\"},";
        
        //Pull the string that represents the best individual 
        String schedule = optIndividual.getIndividual();
        //System.out.println("Schedule = " + schedule);
        int numCourses = p.getRegisteredCourses().length;
        int courseSize = schedule.length()/numCourses;
        int courseIDUpperBound = (int) Math.ceil(Utils.LogB(numCourses, 2));
        
        //Pull the time map from the population 
        HashMap<String, Integer> courseTimes = p.getBinCourseTimes();
        CourseStruct[] registeredCourses = p.getRegisteredCourses();
        
        //courseTimes.forEach((key, value) -> System.out.printf("Key: %s Value: %s", key, value));
        for(int i = 0; i < numCourses; i++) {
            //System.out.println("Working on: " + i);
            String courseDetails = schedule.substring(i*courseSize, i*courseSize+courseSize);
            //System.out.println("Working with " + courseDetails.substring(0, courseIDUpperBound));
            CourseStruct course = registeredCourses[Utils.binStringToNum(courseDetails.substring(0, courseIDUpperBound))];
            String courseName = course.getCourseName();
            String courseBinTime = courseDetails.substring(courseIDUpperBound);
            //System.out.println(courseBinTime);
            Integer courseTime = courseTimes.get(courseBinTime);
            String courseTimeS = courseTime.toString();
            //System.out.println(courseTime.intValue() + "  " + course.getCourseDuration(courseTime.intValue()));
            String courseDuration = Integer.toString(course.getCourseDuration(courseTime.intValue()));
            String finalCourseDetails = courseFormatString;
            finalCourseDetails = finalCourseDetails.replace("course_id", courseName);
            finalCourseDetails = finalCourseDetails.replace("course_start_time", courseTimeS);
            finalCourseDetails = finalCourseDetails.replace("course_duration", courseDuration);
            result+=finalCourseDetails;
        }

        //Knock off the trailing comma and add a closing bracket
        result = result.substring(0, result.length()-1);
        result += "]}";
        return result;
    }
}
