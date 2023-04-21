package optimizer.algorithm.Analyzer;
import optimizer.Utils;
import optimizer.algorithm.Schedule;
import optimizer.algorithm.Events.Block;
import optimizer.algorithm.Events.Event;
import optimizer.algorithm.Events.Lecture;
import optimizer.constants.Constants;
import optimizer.constants.EventType;
import optimizer.constants.WeekDays;

import java.util.ArrayList;
import java.util.HashMap;

public class RequiredAnalyzer {

    private ArrayList<Integer> requiredScores;
    private int numBlocks;
    private int numLectures;
    private int numSecondaries;
    
    public RequiredAnalyzer(int numBlocks, int numLectures, int numSecondaries) {
        this.requiredScores = new ArrayList<Integer>();
        this.numBlocks = numBlocks;
        this.numLectures = numLectures;
    }


    public int calculateTimeConflicts(Schedule x) {
        Event[] sections = x.getEvents();
        int[][][] dayTimeDuration = new int[7][][];
        int conflictCount = 0;
        for(int i = 0; i < dayTimeDuration.length; i++) {
            int dayCount = 0; 
            for(int j = 0; j < sections.length; j++) {
                if(sections[j] == null) {
                    continue;
                }
                if(hasWeekDay(sections[j].getDaysOfDays(), i)) {
                    dayCount++;
                }
            }
            dayTimeDuration[i] = new int[2][dayCount];

            int index = 0;
            for(int j = 0; j < sections.length; j++) {
                if(sections[j] == null) {
                    continue;
                }
                if(hasWeekDay(sections[j].getDaysOfDays(), i)) {
                    //dayCount++;
                    dayTimeDuration[i][0][index] = (60 * (sections[j].getStartTime()/100) + (sections[j].getStartTime() % 100));;
                    dayTimeDuration[i][1][index] = dayTimeDuration[i][0][index] + sections[j].getDuration();
                    index++;
                }
            }
            conflictCount += calculateStartConflicts(dayTimeDuration[i][0]);
            //System.out.println(conflictCount);
            conflictCount += calculateDurationConflicts(dayTimeDuration[i]);
        }
        return conflictCount;
    }

    private int calculateNameConflicts(Schedule x) {
        HashMap<String, Integer> c = new HashMap<String, Integer>();
        Event[] s = x.getEvents();
        for(int i = 0; i < s.length; i++) {
            if(s[i] == null) {
                continue;
            }
            String temp = s[i].getAssignedName();
            if(c.containsKey(temp)) {
                Integer count = c.get(temp);
                c.put(temp, Integer.valueOf(count.intValue() + 1));
            } else {
                c.put(temp, Integer.valueOf(1));
            }
        }
        return Utils.findNumSConflicts(c);
    }

    private boolean hasWeekDay(WeekDays[] days, int i) {
        WeekDays target = WeekDays.values()[i];
        for(int j = 0; j < days.length; j++) {
            if(days[j] == target) {
                return true;
            }
        }
        return false; 
    }


    private int calculateStartConflicts(int[] times) {
        HashMap<Integer, Integer> count = new HashMap<Integer, Integer>();
        for(int i = 0; i < times.length; i++) {
            //If the section contained is a null ptr, then just ignore it. 
            Integer time = Integer.valueOf(times[i]);
            if(count.containsKey(time)) {
                Integer temp = count.get(time);
                temp = Integer.valueOf(temp.intValue() + 1);
                count.put(time, temp);
            } else {
                count.put(time, Integer.valueOf(1));
            }
        }
        return (Utils.findNumConflicts(count));
    }

    private int calculateDurationConflicts(int[][] timeDuration) {
        int total = 0; 
        for(int i = 0; i < timeDuration[0].length; i++) {
            for(int j = 0; j < timeDuration[0].length; j++) {
                if(i != j) {
                    //If minStartEnd[j] ⊂ minStartEnd[i]
                    if(timeDuration[0][i] < timeDuration[0][i] && timeDuration[1][i] > timeDuration[1][j]) {
                        total++;
                    }
                    
                    //If there exists an intersection, but not a proper subset relationship between i and j
                    if(timeDuration[1][i] > timeDuration[0][j] && timeDuration[1][i] < timeDuration[1][j]) {
                        total++;
                    }
                }
            }
        }
        return total;
    }

    public int[] calculateFitnessScores(Schedule[] x, int requiredCount) {
        int[] results = new int[x.length];
        for(int i = 0; i < x.length; i++) {
            calculateIndividualRequiredScore(x[i], requiredCount);
        }
        return results;
    }

    public int calculateIndividualRequiredScore(Schedule x, int requiredCount) {
        int fitnessScore = 0;
        fitnessScore += x.getInvalidCount() * Constants.nullPenalty;
        fitnessScore += calculateTimeConflicts(x) * Constants.timeConflictPenalty;
        fitnessScore += calculateNameConflicts(x) * Constants.nameConflictPenalty;
        fitnessScore += calculateRequiredSatisifability(x, requiredCount) * Constants.unfulfilledRequirementPenalty;
        fitnessScore += calculateBlockSufficiency(x) * Constants.insufficientBlockPenalty;
        //System.out.println("Insufficient block penalty =" + calculateBlockSufficiency(x) * Constants.insufficientBlockPenalty);
        //results[i] = fitnessScore;
        //System.out.println("Fitness Score = " + fitnessScore);
        x.setRequiredScore(fitnessScore);
        return fitnessScore;
    }

    private int calculateRequiredSatisifability(Schedule target, int num) {
        Event[] sections = target.getEvents();
        int total = 0;
        for(int i = 0; i < sections.length; i++) {
            if(sections[i] == null) {
                continue;
            } else if((Utils.getEventType(sections[i].getID())) == EventType.LECTURE && ((Lecture) sections[i]).isRequired()) {
                total++;
            }
        }
        return Math.abs(num - total);
    }

    public int calculateBlockSufficiency(Schedule target) {
        Block[] blocks = target.getBlocks();
        return Math.abs(blocks.length - this.numBlocks);
    }

    public int addScore(Schedule x) {
        int score = x.getRequiredScore();
        this.requiredScores.add(Integer.valueOf(score));
        int delta = score;
        if(this.requiredScores.size() > 2 ) {
            //Calculate Δ fitness
            int backTwo = this.requiredScores.get(this.requiredScores.size() - 2);
            delta -= backTwo;
        }
        return delta;
    }

    public int calculateTangent(int pt1, int pt2) {
        return requiredScores.get(pt1) - requiredScores.get(pt2);
    }

    public ArrayList<Integer> getRequiredScores() {
        return this.requiredScores;
    }
}
