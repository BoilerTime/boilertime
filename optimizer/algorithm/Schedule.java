package optimizer.algorithm;
import java.util.HashMap;

import optimizer.Utils;
import optimizer.algorithm.Events.Event;
import optimizer.algorithm.Events.Section;

public class Schedule {
    private final Event[] events;
    private int invalidCount; 
    private int requiredFitnessScore;
    private int optionalFitnessScore;
    private boolean hasRequiredScore;
    private boolean hasOptionalScore;

    public Schedule(Event[] s) {
        this.events = s;
        this.invalidCount = 0;
        this.hasRequiredScore = false;
        this.hasOptionalScore = false;
    }

    public Schedule(HashMap<String, Event> idEvent, boolean[][] result) {
        this.events = this.configure(idEvent, result);
        this.hasRequiredScore = false; 
        this.hasOptionalScore = false;
    } 

    public Event[] getEvents() {
        return this.events;
    }

    public int getInvalidCount() {
        return this.invalidCount;
    }

    private Event[] configure(HashMap<String, Event> idEvent, boolean[][] result) {
        Event[] results = new Section[result.length];
        this.invalidCount = 0;
        for(int i = 0; i < result.length; i++) {
            String s = Utils.boolArrayToString(result[i]);
            if(idEvent.containsKey(s)) {
                results[i] = idEvent.get(s);
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
