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
            classTimes.put(Arrays.toString(Utils.timeToBin(i)), new String().valueOf(i)); 
        }

        for(int i: durations) {
            classDurations.put(Arrays.toString(Utils.numToBin(i)), new String().valueOf(i));
        }
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
