package optimizer.algorithm;
import java.util.*;

import optimizer.algorithm.Events.Lecture;
import optimizer.constants.WeekDays;
public class OptimizerDecoder {
    public static String decodeOptimizedSchedule(Schedule[] best) {
        String result = "{\"status\": 200, \"message\": \"schedule\", \"data\": []";
        String courseFormatString = "{\"courseID\": \"course_id\", \"courseStartTime\": \"course_start_time\", \"courseDuration\": \"course_duration\", \"sectionId\": \"section_id\", \"daysOfWeek\": \"days_of_week\"},";
        String[] courseResults = new String[best.length];

        /*for(int j = 0; j < best.length; j++) {
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
                finalCourseDetails = finalCourseDetails.replace("course_start_time", Integer.toString(classes[i].getStartTime()));
                finalCourseDetails = finalCourseDetails.replace("course_duration", Integer.toString(classes[i].getDuration()));
                finalCourseDetails = finalCourseDetails.replace("section_id", classes[i].getSectionId());
                finalCourseDetails = finalCourseDetails.replace("days_of_week", convertDaysToString(classes[i].getDaysOfDays()));
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
        }*/
        return result;
    }

    private static String convertDaysToString(WeekDays[] days) {
        String result = "";
        System.out.println(Arrays.toString(days));
        for(int i = 0; i < days.length; i++) {
            if(i == days.length - 1 && days.length > 1) {
                result += "and ";
            } 
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
