package optimizer.algorithm;
import java.util.HashMap;

import optimizer.Utils;

public class Schedule {
    private final Section[] sections;
    private int invalidCount; 
    private int fitnessScore;
    private boolean hasFitnessScore;

    public Schedule(Section[] s) {
        this.sections = s;
        this.invalidCount = 0;
        this.hasFitnessScore = false;
    }

    public Schedule(HashMap<String, Section> idSection, boolean[][] result) {
        this.sections = this.configure(idSection, result);
        this.hasFitnessScore = false; 
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


    public int getFitnessScore() {
        if(this.hasFitnessScore) {
            return this.fitnessScore;
        }
        return -1;
    }

    public int setFitnessScore(int score) {
        this.fitnessScore = score;
        this.hasFitnessScore = true;
        return this.fitnessScore;
    }
}
