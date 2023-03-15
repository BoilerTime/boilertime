package optimizer;
import java.util.*;

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
}
