package optimizer.algorithm;
import java.util.*;

import optimizer.Utils;

public class OptimizerDecoder {
    public static String decodeOptimizedSchedule(Schedule best) {
        String result = "{\"data\": [";
        String courseFormatString = "{\"courseID\": \"course_id\", \"courseStartTime\": \"course_start_time\", \"courseDuration\": \"course_duration\"},";
        
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
            result+=finalCourseDetails;
        }
        //Knock off the trailing comma and add a closing bracket
        result = result.substring(0, result.length()-1);
        result += "]}";
        return result;
    }

    public static CourseOverview[] parseIncomingData(String[] args) {
        CourseOverview[] results = new CourseOverview[args.length];
        for(int i = 0; i < results.length; i++) {
            String courseName = "";
            boolean parsedName = false;
            boolean parsedCourseTimes = false;
            boolean parsedCourseDurations = false;
            ArrayList<Integer> times = new ArrayList<Integer>();
            ArrayList<Integer> durations = new ArrayList<Integer>();
            String temp = args[i];
            String tempTime = "";
            for(int j = 0; j <temp.length(); j++) {
                String currentChar = temp.substring(j, j+1);
                if(!parsedName) {
                    if(currentChar.equals(" ")) {
                        parsedName = true;
                    } else {
                        courseName += currentChar;
                    }
                } else if(!parsedCourseTimes) {
                    if(currentChar.equals("[")) {
                        //Nothing to see here
                    } else if(currentChar.equals(",")) {
                        times.add(Integer.parseInt(tempTime));
                        tempTime = "";
                    } else if(currentChar.equals("]")) {
                        times.add(Integer.parseInt(tempTime));
                        tempTime = "";
                        parsedCourseTimes = true;
                        j++;
                    } else {
                        tempTime += currentChar;
                    }
                } else if(!parsedCourseDurations) {

                    if(currentChar.equals("[")) {
                        //Nothing to see here
                    } else if(currentChar.equals(",")) {
                        durations.add(Integer.parseInt(tempTime));
                        tempTime = "";
                    } else if(currentChar.equals("]")) {
                        durations.add(Integer.parseInt(tempTime));
                        tempTime = "";
                        parsedCourseTimes = true;
                    } else {
                        tempTime += currentChar;
                    }
                }
            }
            WeekDays[][] rand = new WeekDays[1][1];
            results[i] = new CourseOverview(courseName, Utils.parseArrayList(times), Utils.parseArrayList(durations), rand);
        }
        return results;
    }
}
