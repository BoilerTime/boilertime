package optimizer;
import java.util.*;
import optimizer.algorithm.*;
import optimizer.algorithm.Events.Moment;
import optimizer.constants.Constants;
import optimizer.constants.EventType;
import optimizer.constants.WeekDays;

public class Utils {

    /**
     * An overloaded utility that creates a binary string to match a specifically request length 
     * @param number The number to be converted 
     * @param len The length of thee desired array 
     * @return An int[] array that represents the results of the conversion
     */
    public static int[] numToBin(int number, int len) {
        //System.out.println("Hi" + number + " " + Math.log((double) number));
        int[] result = new int[len];//new int[(int) Math.ceil(Math.log((double) number))]; //Make an integer array that takes on the required length
        for(int i = (len-1); i >= 0; i--) {
            //result[i] = number >> len & 1;
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
    public static int[] numToBin(int number) {
        if(number <= 0) {
            return numToBin(number, 1);
        }
        return numToBin(number, (int) Math.ceil(Math.log(number)+1));
    }

    /**
     * A utility to convert a given timestamp to a binary format 
     * @param time The time that is to be converted 
     * @return An array that represents the timestamp, the 5 most significant entries being the hours, the 8 least significant digits being the minutes 
     */
    public static int[] timeToBin(int time) {
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
    
    /**
     * A method to get a random number that lies within a range [max, min]
     * @param min {int} The min value to find a random value for 
     * @param max {int} The max value to find a random value for 
     * @return {int} A psuedo-random value that lies within the range [min, max]
     */
    public static int randInRange(Random r, int min, int max) {
        if((max - min) + 1 < 0) {
            return r.nextInt(100);
        }
		return r.nextInt((max - min) + 1) + min;
	}

    /**
     * A utility to find the index in an integer array associated with the maximum value of said array. O(n)
     * @param data The array to be searched
     * @return The array index that corresponds with the max entry in the array 
     */
    public static int getIndexForMax(int[] data) {
        int maxIndex = -1;
        int maxValue = Integer.MIN_VALUE;
        for(int i = 0; i < data.length; i++) {
            if(data[i] > maxValue) {
                maxIndex = i;
                maxValue = data[i];
            }
        }
        return maxIndex;
    }

    /**
     * A utility to find the index in an integer array associated with the minimum value of said array. O(n)
     * @param data The array to be searched
     * @return The array index that corresponds with the max entry in the array 
     */
    public static int getIndexForMin(int[] data) {
        int minIndex = -1;
        int minValue = Integer.MAX_VALUE;
        for(int i = 0; i < data.length; i++) {
            if(data[i] < minValue) {
                minIndex = i;
                minValue = data[i];
            }
        }
        return minIndex;
    }

    /**
     * A utility to split a string into serveral substrings each of a specified length
     * @param s The string to be split
     * @param splitLen The size of each substring. Must be <= the size of the string to avoid undefined behavior. 
     * @return An array of the substrings, each of length splitlen unless s.length() % splitLen != 0, in which case the last element will be shortened 
     */
    public static String[] splitString(String s, int splitLen) {
        String[] results;

        if(s.length() % splitLen != 0) {
            results = new String[(s.length()/splitLen) + 1];
        } else {
            results = new String[s.length()/splitLen];
        }

        for(int i = 0; i <results.length; i++) {
            if(s.length() % splitLen == 0 || (s.length() % splitLen != 0 && i != results.length-1)) {
                results[i] = s.substring(i*splitLen, (i*splitLen) + splitLen);
            } else {
                //System.out.println((i*splitLen));
                results[i] = s.substring(i*splitLen, s.length());
            }
        }
        return results;
    }

    /**
     * Parses a hash map whose keys are unique IDs, and whose vallues are the number of entries that for each unique ID. 
     * @param data The hashmap to be parsed
     * @return How many total conflicts exist within the hashmap. 
     */
    public static int findMaxConflicts(HashMap<String, Integer> data) {
        //Go back through the hashmap and find the number of keys whose value > 1
        int conflicts = 0; 
        //System.out.println("Called");
        for (Map.Entry<String, Integer> entry : data.entrySet()) {
            conflicts += entry.getValue().intValue()-1; //If the count is more than one, then there is a conflict
            //System.out.println(entry.getKey() + " " + entry.getValue().intValue());
            //System.out.println("Conflicts = " + conflicts);
        }
        return conflicts;
    }

    /**
     * A helper method to convert a binary string to an integer value using unsigned integer notation
     * @param s The string to be examined. Must only have binary digits. 
     * @return An integer that represents the reslts of the conversion, encoded as an integer. 
     * @post The string that is returned will be represnted as a 2's complement integer, even if the one passed was in another integer representation scheme. 
     */
    public static int binStringToNum(String s) {
        int result = 0; 
        for(int i = 0; i < s.length(); i++) {
            int temp = Integer.valueOf(s.substring(i, i+1)).intValue();
            result += (temp << (s.length() - i - 1));
        }
        return result;
    }

    /**
     * Returns the log_n of a given number 
     * @param num The number for the logarithm
     * @param b The base of the logarithm
     * @return The result of the logarithm 
     */
    public static double LogB(int num, int b) {
        return Math.log(num) / Math.log(2);
    }

    /**
     * Utility to convert an array of integers to a string that represents each of the entries with no gaps between them (concatenated together)
     * @param arr The array to be converted
     * @return The concatenated string. 
     */
    public static String arrToString(int[] arr) {
        String result = "";
        for(int i = 0; i < arr.length; i++) {
            result += arr[i];
        }
        return result; 
    }

    /**
     * Gets the minimum value in an array of integers provided
     * @param array The array of values to check
     * @return The minimum value in the array 
     */
    public static int getMinValue(int[] array) {
        int minValue = Integer.MAX_VALUE;
        for(int i = 0; i < array.length; i++) {
            if(array[i] < minValue) {
                minValue = array[i];
            }
        }
        return minValue;
    }

    /**
     * Method to determine if a potentially unsorted array contains a certain value. O(n). More than one user does not matter
     * @param array The array to be checked
     * @param key The key that is to be searched for 
     * @return True if the array does contain the value, false if not. 
     */
    public static boolean unsortedContains(int[] array, int key) {
        for(int i = 0; i < array.length; i++) {
            if(array[i] == key) {
                return true; 
            }
        }
        return false;
    }

    /**
     * Helper method to convert arraylist to int array of fixed length
     * @param target The array to be converted
     * @return The results of the conversion
     */
    public static int[] parseArrayList(ArrayList<Integer> target) {
        int[] results = new int[target.size()];
        for(int i = 0; i < results.length; i++) {
            results[i] = target.get(i).intValue();
        }
        return results;
    }

    /**
     * A helper method to convert a string to an array of booleans that represents each digit, a 0 being false and any other value being true 
     * @param s The string that is to be converted
     * @return The boolean array resulting from the conversion
     */
    public static boolean[] stringToBoolArray(String s) {
        boolean[] result = new boolean[s.length()];
        for(int i = 0; i < result.length; i++) {
            if(s.charAt(i) == '0') {
                result[i] = false;
            } else {
                result[i] = true;
            }
        }
        return result;
    }

    /**
     * A utility that converts a booelan array to a binary string, where a false is a 0 and a true is a 1
     * @param x The boolean array to be converted
     * @return The string that has been formed. 
     */
    public static String boolArrayToString(boolean[] x) {
        String r = "";
        for(int i = 0; i < x.length; i++) {
            if(!x[i]) {
                r+= "0";
            } else {
                r+="1";
            }
        }
        return r;
    }

    /**
     * A helper method that merge sorts two schedules by their fitness scores
     * @param x The array of schedules that is to be sorted
     * @param l The left point of the sort
     * @param m The mid point of the sort
     * @param r The right point of the sort. 
     */
    private static void merge(Schedule x[], int l, int m, int r) {
        // Find sizes of two subarrays to be merged
        int n1 = m - l + 1;
        int n2 = r - m;
  
        /* Create temp arrays */
        Schedule L[] = new Schedule[n1];
        Schedule R[] = new Schedule[n2];
  
        /*Copy data to temp arrays*/
        for (int i = 0; i < n1; ++i)
            L[i] = x[l + i];
        for (int j = 0; j < n2; ++j)
            R[j] = x[m + 1 + j];
  
        /* Merge the temp arrays */
  
        // Initial indexes of first and second subarrays
        int i = 0, j = 0;
  
        // Initial index of merged subarray array
        int k = l;
        while (i < n1 && j < n2) {
            if (L[i].getFitnessScore() <= R[j].getFitnessScore()) {
                x[k] = L[i];
                i++;
            }
            else {
                x[k] = R[j];
                j++;
            }
            k++;
        }
  
        /* Copy remaining elements of L[] if any */
        while (i < n1) {
            x[k] = L[i];
            i++;
            k++;
        }
  
        /* Copy remaining elements of R[] if any */
        while (j < n2) {
            x[k] = R[j];
            j++;
            k++;
        }
    }
  

    /**
     * A method that initalizes merge sort on an array of schedules
     * @param x The array that is to be sorted
     * @param l The lower bound of interest of the sort
     * @param r The upper bound of interest of the sort
     */
    public static void sortScheduleArray(Schedule x[], int l, int r) {
        if (l < r) {
            // Find the middle point
            int m = l + (r - l) / 2;
  
            // Sort first and second halves
            sortScheduleArray(x, l, m);
            sortScheduleArray(x, m + 1, r);
  
            // Merge the sorted halves
            merge(x, l, m, r);
        }
    }

    /**
     * A helper method that combines arrays in a random way
     * @param merge The smaller array that is supposed to be combined into a larger one 
     * @param target A larger array that is to be re-formed with the new merge target
     * @param r A random number generator to specifcy the way that the randm valeus are to be merged. 
     */
    public static void mergeInto(Schedule[] merge, Schedule[] target, Random r) {
        Schedule[] temp = new Schedule[merge.length];

        for(int i = merge.length; i < target.length - (merge.length / 4); i++) {
            temp[i - merge.length] = target[i];
            target[i] = merge[i - merge.length];
        }

        int tempCtr = 0;
        for(int i = merge.length + (merge.length / 2); i < target.length; i++) {
            if(Utils.randInRange(r, 0, 1+target[i].getFitnessScore()) > 5) {
                target[i] = temp[tempCtr++];
            }
        }
    }

    /**
     * A helper method that determines the number of conflicts that exist in some hashamp
     * @param x A hashmap, where the Integer represents the number of conflicts for some key (Object)
     * @return The total number of conflicts 
     */
    public static int findNumConflicts(HashMap<Integer, Integer> x) {
        int numConflicts = 0;
        Integer[] vals = x.values().toArray(new Integer[x.size()]);
        for(int i = 0; i < vals.length; i++) {
            if(vals[i].intValue() > 1) {
                numConflicts++;
            }
        }
        return numConflicts;
    }


    /**
     * A helper method that determines the number of conflicts that exist in some hashamp
     * @param x A hashmap, where the Integer represents the number of conflicts for some key (Object)
     * @return The total number of conflicts 
     */
    public static int findNumSConflicts(HashMap<String, Integer> x) {
        int numConflicts = 0;
        Integer[] vals = x.values().toArray(new Integer[x.size()]);
        for(int i = 0; i < vals.length; i++) {
            //System.out.println(vals[i].intValue());
            if(vals[i].intValue() > 1) {
                numConflicts++;
            }
        }
        return numConflicts;
    }


    public static int findNumMConflicts(HashMap<Moment, Integer> m) {
        int numConflicts = 0;
        Integer[] vals = m.values().toArray(new Integer[m.size()]);
        for(int i = 0; i < vals.length; i++) {
            if(vals[i].intValue()> 1) {
                numConflicts++;
            }
        }
        return numConflicts;
    }

    public static int findNonOverlappingDayTime(ArrayList<Moment> moments) {
        Moment[] m = moments.toArray(new Moment[moments.size()]);
        int count = 0;
        for(int i = 0; i < m.length; i++) {
            for(int j = 0; j < m.length; j++) {
                if(j != i) {
                    WeekDays[] w1 = m[i].getWeekDays();
                    WeekDays[] w2 = m[j].getWeekDays();
                    Arrays.sort(w1);
                    Arrays.sort(w2);
                    boolean foundOverlap = false;
                    int min = Math.min(w1.length, w2.length);
                    for(int k = 0; k < min; k++) {
                        if(Arrays.binarySearch(w2, w1[k]) != -1) {
                            foundOverlap = true;
                        }
                    }
                    if(foundOverlap) {
                        count++;
                    }
                }
            }
        }
        return (count);
    }

    /**
     * A helper method that calculates the median of a set of doubles
     * @param dataSet The set of values that are of interest
     * @return The mean of the set of values. 
     */
    public static double calculateMean(double[] dataSet) {
        double mean = 0;
        for(int i = 0; i < dataSet.length; i++) {
            mean += dataSet[i];
        }
        return mean / (double) dataSet.length;
    }

    /**
     * A helper method that converts a string that contains a week day to a WeekDay enum
     * @param target The string to be converted
     * @return The corresponding enum, or WeekDays.none if the day was not valid
     */
    public static WeekDays strToDay(String target) {
        WeekDays res;
        switch(target) {
            case "Monday":
                res = (WeekDays.monday);
                break;
            case "Tuesday":
                res = WeekDays.tuesday;
                break;
            case "Wednesday":
                res = WeekDays.wednesday;
                break;
            case "Thursday":
                res = WeekDays.thursday;
                break;
            case "Friday":
                res = WeekDays.friday;
                break;
            case "Saturday":
                res = WeekDays.saturday;
                break;
            case "Sunday":
            res = WeekDays.sunday;
                break;
            default: 
                res = WeekDays.none;
                break;
        }
        return res;
    } 

    /**
     * A helper method that converts a list of days into an array of enum representations
     * @param target The string in question, with days separate by a coma followed by a space
     * @return The array result, with none where no day of week was found to be
     */
    public static WeekDays[] strListToDayList(String target) {
        String[] aDays = target.split(", ");
        WeekDays[] res = new WeekDays[aDays.length];
        for(int i = 0; i < aDays.length; i++) {
            res[i] = strToDay(aDays[i]);
        }
        return res;
    }

    /**
     * A helper method that gets the type of event associated with some binary string
     * @param target The target string to be examined for some event type
     * @return The EventType corresponding with the value in question, or EventType.GENERIC if none such exists. 
     */
    public static EventType getEventType(String target) {
        String strV = target.substring(0, Constants.NUM_BLOCK_BITS);
        if (strV.equals(Constants.LECTURE)) {
            return EventType.LECTURE;
        } else if (strV.equals(Constants.BLOCK)) {
            return EventType.BLOCK;
        } else if (strV.equals(Constants.SECONDARY)) {
            return EventType.SECONDARY;
        }
        return EventType.GENERIC;
    }

    public static Schedule[] insertInto(Schedule[] overall, Schedule target) {
        if(target.getFitnessScore() < overall[0].getFitnessScore()) {
            overall[]
        }
        int index = 1;
        while(index < overall.length) {

        }
    }
}
