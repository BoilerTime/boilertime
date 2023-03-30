package optimizer.algorithm;

public class OptimizerDecoder {
    public static String decodeOptimizedSchedule(Schedule best) {
        String result = "{\"status\": 200, \"message\":, \"schedule\", \"data\": [";
        String courseFormatString = "{\"courseID\": \"course_id\", \"courseStartTime\": \"course_start_time\", \"courseDuration\": \"course_duration\", \"sectionId\": \"section_id\"},";
        
        //Pull the string that represents the best individual 
        Section[] classes = best.getSections();
        //String schedule = optIndividual.getIndividual();
        //System.out.println("Schedule = " + schedule);
        int numCourses = classes.length;

        //courseTimes.forEach((key, value) -> System.out.printf("Key: %s Value: %s", key, value));
        for(int i = 0; i < numCourses; i++) {
            String finalCourseDetails = courseFormatString;
            finalCourseDetails = finalCourseDetails.replace("course_id", classes[i].getParent().getCourseName());
            finalCourseDetails = finalCourseDetails.replace("course_start_time", Integer.toString(classes[i].getTime()));
            finalCourseDetails = finalCourseDetails.replace("course_duration", Integer.toString(classes[i].getDuration()));
            finalCourseDetails = finalCourseDetails.replace("section_id", classes[i].getSectionId());
            result+=finalCourseDetails;
        }
        //Knock off the trailing comma and add a closing bracket
        result = result.substring(0, result.length()-1);
        result += "]}";
        return result;
    }
}
