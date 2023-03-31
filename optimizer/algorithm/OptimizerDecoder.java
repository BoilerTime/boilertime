package optimizer.algorithm;

public class OptimizerDecoder {
    public static String decodeOptimizedSchedule(Schedule[] best) {
        String result = "{\"status\": 200, \"message\": \"schedule\", \"data\": [";
        String courseFormatString = "{\"courseID\": \"course_id\", \"courseStartTime\": \"course_start_time\", \"courseDuration\": \"course_duration\", \"sectionId\": \"section_id\"},";
        String[] courseResults = new String[best.length];

        for(int j = 0; j < best.length; j++) {
            if(best[j] == null) {
                return "{\"status\": 404, \"message\": \"No Schedule\", \"data\": \"null\"}";
            } 
            //Pull the string that represents the best individual 
            Section[] classes = best[j].getSections();
            //String schedule = optIndividual.getIndividual();
            //System.out.println("Schedule = " + schedule);
            int numCourses = classes.length;
            String thisResult = "[";
            //courseTimes.forEach((key, value) -> System.out.printf("Key: %s Value: %s", key, value));
            for(int i = 0; i < numCourses; i++) {
                String finalCourseDetails = courseFormatString;
                finalCourseDetails = finalCourseDetails.replace("course_id", classes[i].getParent().getCourseName());
                finalCourseDetails = finalCourseDetails.replace("course_start_time", Integer.toString(classes[i].getTime()));
                finalCourseDetails = finalCourseDetails.replace("course_duration", Integer.toString(classes[i].getDuration()));
                finalCourseDetails = finalCourseDetails.replace("section_id", classes[i].getSectionId());
                thisResult+=finalCourseDetails;
            }
            courseResults[j] = thisResult.substring(0, thisResult.length()-1) + "]";
        }

        //Now, we can put everything into the big one 
        for(int i = 0; i < courseResults.length; i++) {
            if(i != courseResults.length -1) {
                result += courseResults[i] + ", ";
            }  else {
                result += courseResults[i] + "]}";
            }
        }
        return result;
    }
}
