package optimizer.algorithm;
import java.util.HashMap;

import optimizer.Utils;

public class Schedule {
    private final Section[] sections;
    private int invalidCount; 

    public Schedule(Section[] s) {
        this.sections = s;
        this.invalidCount = 0;
    }

    public Schedule(HashMap<String, Section> idSection, boolean[][] result) {
        this.sections = this.configure(idSection, result);
    } 

    public Section[] getSections() {
        return this.sections;
    }

    public int getInvalidCount() {
        return this.invalidCount;
    }

    private Section[] configure(HashMap<String, Section> idSection, boolean[][] result) {
        Section[] results = new Section[result.length];
        this.invalidCount = 0;
        for(int i = 0; i < result.length; i++) {
            String s = Utils.boolArrayToString(result[i]);
            if(idSection.containsKey(s)) {
                results[i] = idSection.get(s);
            } else {
                results[i] = null;
                this.invalidCount ++;
            }
        }
        return results;
    }

}
