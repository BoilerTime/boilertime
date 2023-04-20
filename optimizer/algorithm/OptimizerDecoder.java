package optimizer.algorithm;
import java.util.*;

import optimizer.algorithm.Events.Block;
import optimizer.algorithm.Events.Lecture;
import optimizer.constants.WeekDays;
public class OptimizerDecoder {
    public static String decodeOptimizedSchedule(Schedule[] best) {
        String result = "{\"status\": 200, \"message\": \"schedule\", \"data\": {\"lectures\": [";
        String courseFormatString = "{\"courseID\": \"course_id\", \"courseStartTime\": \"course_start_time\", \"courseDuration\": \"course_duration\", \"sectionId\": \"section_id\", \"daysOfWeek\": \"days_of_week\"},";
        String blockFormatString = "{\"blockName\": \"block_name\", \"blockStartTime\": \"block_start_time\", \"blockDuration\": \"block_duration\", \"daysOfWeek\": \"days_of_week\"},";
        

        int validLength = 0;
        while(validLength < best.length && best[validLength] != null) {
            validLength++;
        }

        if(validLength == 0) {
            return "{\"status\": 404, \"message\": \"No Schedule\", \"data\": \"null\"}";
        }

        String[] courseResults = new String[validLength];
        for(int j = 0; j < validLength; j++) {
            if(best[j] == null && j > 0) {
                continue;//return "{\"status\": 404, \"message\": \"No Schedule\", \"data\": \"null\"}";
            } else if (best[j] == null) {
                return "{\"status\": 404, \"message\": \"No Schedule\", \"data\": \"null\"}";
            }
            //Pull the string that represents the best individual 
            Lecture[] classes = best[j].getLectures();
            //String schedule = optIndividual.getIndividual();
            //System.out.println("Schedule = " + schedule);
            int numCourses = classes.length;
            String thisResult = "[";
            //courseTimes.forEach((key, value) -> System.out.printf("Key: %s Value: %s", key, value));
            for(int i = 0; i < numCourses; i++) {
                String finalCourseDetails = courseFormatString;
                finalCourseDetails = finalCourseDetails.replace("course_id", classes[i].getAssignedName());
                finalCourseDetails = finalCourseDetails.replace("course_start_time", Integer.toString(classes[i].getStartTime()));
                finalCourseDetails = finalCourseDetails.replace("course_duration", Integer.toString(classes[i].getDuration()));
                finalCourseDetails = finalCourseDetails.replace("section_id", classes[i].getSectionId());
                finalCourseDetails = finalCourseDetails.replace("days_of_week", convertDaysToString(classes[i].getDaysOfDays()));
                thisResult+=finalCourseDetails;
            }
            courseResults[j] = thisResult.substring(0, thisResult.length()-1) + "]";
        }

        //Now, we can put everything into the big one 
        for(int i = 0; i < courseResults.length - 1; i++) {
            result += courseResults[i] + ", ";
        }
        result += courseResults[courseResults.length - 1] + "], \"blocks\": [";
        if(best[0].getBlocks().length == 0 ) {
            result += "]}}";
            return result;
            //return (result + "]}}");
        }

        //Blocks
        String[] blockResults = new String[validLength];
        for(int j = 0; j < validLength; j++) {
            if(best[j] == null && j > 0) {
                continue;//return "{\"status\": 404, \"message\": \"No Schedule\", \"data\": \"null\"}";
            } else if (best[j] == null) {
                return "{\"status\": 404, \"message\": \"No Schedule\", \"data\": \"null\"}";
            }
            //Pull the string that represents the best individual 
            Block[] blocks = best[j].getBlocks();
            //String schedule = optIndividual.getIndividual();
            //System.out.println("Schedule = " + schedule);
            int numBlocks = blocks.length;
            String thisResult = "[";
            //courseTimes.forEach((key, value) -> System.out.printf("Key: %s Value: %s", key, value));
            for(int i = 0; i < numBlocks; i++) {
                String finalBlockDetails = blockFormatString;
                finalBlockDetails = finalBlockDetails.replace("block_name", blocks[i].getAssignedName());
                finalBlockDetails = finalBlockDetails.replace("block_start_time", Integer.toString(blocks[i].getStartTime()));
                finalBlockDetails = finalBlockDetails.replace("block_duration", Integer.toString(blocks[i].getDuration()));
                finalBlockDetails = finalBlockDetails.replace("days_of_week", convertDaysToString(blocks[i].getDaysOfDays()));
                thisResult+=finalBlockDetails;
            }
            blockResults[j] = thisResult.substring(0, thisResult.length()-1) + "]";
        }
        for(int i = 0; i < blockResults.length - 1; i++) {
            result += blockResults[i] + ", ";
        }
        result += blockResults[blockResults.length - 1] + "]}}";
        System.out.println("Result = " + result);
        return result;
    }

    private static String convertDaysToString(WeekDays[] days) {
        String result = "";
        System.out.println(Arrays.toString(days));
        for(int i = 0; i < days.length; i++) {
            if(days[i] == WeekDays.monday) {
                result += "Monday";
            } else if(days[i] == WeekDays.tuesday) {
                result += "Tuesday";
            } else if(days[i] == WeekDays.wednesday) {
                result += "Wednesday";
            } 
            else if(days[i] == WeekDays.thursday) {
                result += "Thursday";
            } 
            else if(days[i] == WeekDays.friday) {
                result += "Friday";
            } 
            else if(days[i] == WeekDays.saturday) {
                result += "Saturday";
            } else  {
                result += "Sunday";
            }
            if(i != days.length - 1 && days.length > 1) {
                result += ", ";
            } 
        }
        return result;
    }
}
