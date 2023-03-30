package optimizer.algorithm;
import java.util.HashMap;

import optimizer.Utils;

public class Schedule {
    private final Section[] sections;
    private int invalidCount; 
    private int requiredFitnessScore;
    private int optionalFitnessScore;
    private boolean hasRequiredScore;
    private boolean hasOptionalScore;

    public Schedule(Section[] s) {
        this.sections = s;
        this.invalidCount = 0;
        this.hasRequiredScore = false;
        this.hasOptionalScore = false;
    }

    public Schedule(HashMap<String, Section> idSection, boolean[][] result) {
        this.sections = this.configure(idSection, result);
        this.hasRequiredScore = false; 
        this.hasOptionalScore = false;
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


    public int getRequiredScore() {
        if(this.hasRequiredScore) {
            return this.requiredFitnessScore;
        }
        return -1;
    }

    public int setRequiredScore(int score) {
        this.requiredFitnessScore = score;
        this.hasRequiredScore = true;
        return this.requiredFitnessScore;
    }

    public int getOptionalScore() {
        if(this.hasOptionalScore) {
            return this.optionalFitnessScore;
        }
        return -1;
    }

    public int setOptionalScore(int score) {
        this.optionalFitnessScore = score;
        this.hasOptionalScore = true;
        return this.optionalFitnessScore;
    }

    public int getFitnessScore() {
        if(this.hasOptionalScore && this.hasRequiredScore) {
            return this.requiredFitnessScore + this.optionalFitnessScore;
        }
        return -1;
    }
}
