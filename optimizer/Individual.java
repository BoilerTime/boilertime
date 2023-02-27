package optimizer;
import java.util.*;

public class Individual extends Chromosome {

    private HashMap<String, String> classTimes;
    private String courseName;
    private HashMap<String, String> classDurations;

    public Individual(String courseName, String courseBinID, int[] times, int[] durations) {
        super(courseBinID);
        //Commit the course hame to the object
        this.courseName = courseName;
        //Push all the class times to the hasmap 
        classTimes = new HashMap<>();
        classDurations = new HashMap<>();
        for(int i: times) {
            classTimes.put(Arrays.toString(timeToBin(i)), new String().valueOf(i)); 
        }

        for(int i: durations) {
            classDurations.put(Arrays.toString(numToBin(i)), new String().valueOf(i));
        }
    }

    /**
     * An overloaded utility that creates a binary string to match a specifically request length 
     * @param number The number to be converted 
     * @param len The length of thee desired array 
     * @return An int[] array taht represents the results of the conversion
     */
    private int[] numToBin(int number, int len) {
        //System.out.println("Hi" + number + " " + Math.log((double) number));
        int[] result = new int[len];//new int[(int) Math.ceil(Math.log((double) number))]; //Make an integer array that takes on the required length
        for(int i = 0; i < result.length; i++) {
            result[i] = number%2;
            number /= 2; 
        }
        return result;
    }

    /**
     * A utility to convert a number to an int array of binary characters representing the minimum acceptable length of tghe array 
     * @param number The number to be converted 
     * @return An int[] array taht represents the results of the conversion
     */
    private int[] numToBin(int number) {
        if(number <= 0) {
            return numToBin(number, 1);
        }
        return numToBin(number, (int) Math.ceil(Math.log(number)));
    }

    /**
     * A utility to convert a given timestamp to a binary format 
     * @param time The time that is to be converted 
     * @return An array that represents the timestamp, the 5 most significant entries being the hours, the 8 least significant digits being the minutes 
     */
    private int[] timeToBin(int time) {
        int[] hours = new int[5]; //ceil(log24)
        int[] minutes = new int[8]; //ceil(log60)\
        int[] results = new int[13];
        int iHours = time/100; // We can get the hour number by dividing (and truncating)
        int iMinutes = time%100; //The remainder is the number of minutes
        hours = numToBin(iHours, 5);
        minutes = numToBin(iMinutes, 8);
        //We now need to populate a single array that represents the time 
        int pos = 0;
        for(int i = 0; i < minutes.length; i++) {
            results[pos++] = minutes[i];
        }

        for(int i = 0; i < hours.length; i++) {
            results[pos++] = hours[i];
        }

        return results; 
        //return [hours, minutes];
    }

    public String getPrettyTime(String bTime) {
        return classTimes.get(bTime);
    }

    public String getPrettyDuration(String bTime) {
        return classDurations.get(bTime);
    }

    public String[] getBinaryTimes() {
        String[] times = classTimes.keySet().toArray(new String[classTimes.size()]);
        return times; 

    }
}
