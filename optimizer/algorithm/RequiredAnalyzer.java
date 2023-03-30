package optimizer.algorithm;
import optimizer.Utils;

import java.util.ArrayList;
import java.util.HashMap;

public class RequiredAnalyzer {

    private ArrayList<Integer> requiredScores;
    private final boolean optimizationMode;

    //Implements the penalty scores found in the documentation for the algorithm. 
    private static final int nullPenalty = 10000;
    private static final int timeConflictPenalty = 1000;
    private static final int nameConflictPenalty = 100;
    private static final int unfulfilledRequirementPenalty = 10;

    public RequiredAnalyzer(boolean m) {
        this.requiredScores = new ArrayList<Integer>();
        this.optimizationMode = m;
    }


    public static int calculateTimeConflicts(Schedule x) {
        Section[] sections = x.getSections();
        int[][][] dayTimeDuration = new int[7][][];
        int conflictCount = 0;
        for(int i = 0; i < dayTimeDuration.length; i++) {
            int dayCount = 0; 
            for(int j = 0; j < sections.length; j++) {
                if(sections[j] == null) {
                    continue;
                }
                if(hasWeekDay(sections[j].getWeekDays(), i)) {
                    dayCount++;
                }
            }
            dayTimeDuration[i] = new int[2][dayCount];

            int index = 0;
            for(int j = 0; j < sections.length; j++) {
                if(sections[j] == null) {
                    continue;
                }
                if(hasWeekDay(sections[j].getWeekDays(), i)) {
                    //dayCount++;
                    dayTimeDuration[i][0][index] = (60 * (sections[j].getTime()/100) + (sections[j].getTime() % 100));;
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

    private static int calculateNameConflicts(Schedule x) {
        HashMap<String, Integer> c = new HashMap<String, Integer>();
        Section[] s = x.getSections();
        for(int i = 0; i < s.length; i++) {
            if(s[i] == null) {
                continue;
            }
            String temp = s[i].getParent().getCourseName();
            if(c.containsKey(temp)) {
                Integer count = c.get(temp);
                c.put(temp, Integer.valueOf(count.intValue() + 1));
            } else {
                c.put(temp, Integer.valueOf(1));
            }
        }
        return Utils.findNumSConflicts(c);
    }

    private static boolean hasWeekDay(WeekDays[] days, int i) {
        WeekDays target = WeekDays.values()[i];
        for(int j = 0; j < days.length; j++) {
            if(days[j] == target) {
                return true;
            }
        }
        return false; 
    }


    private static int calculateStartConflicts(int[] times) {
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

    private static int calculateDurationConflicts(int[][] timeDuration) {
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

    public static int[] calculateFitnessScores(Schedule[] x, boolean mode, int requiredCount) {
        int[] results = new int[x.length];
        for(int i = 0; i < x.length; i++) {
            //x[i].setFitnessScore(x[i].getInvalidCount());
            int fitnessScore = 0;
            fitnessScore += x[i].getInvalidCount() * nullPenalty;
            fitnessScore += calculateTimeConflicts(x[i]) * timeConflictPenalty;
            fitnessScore += calculateNameConflicts(x[i]) * nameConflictPenalty;
            fitnessScore += calculateRequiredSatisifability(x[i], requiredCount) * unfulfilledRequirementPenalty;
            //results[i] = fitnessScore;
            //System.out.println("Fitness Score = " + fitnessScore);
            x[i].setRequiredScore(fitnessScore);
            x[i].setOptionalScore(0);
        }
        return results;
    }

    public static int calculateIndividualRequiredScore(Schedule x, boolean mode, int requiredCount) {
        int fitnessScore = 0;
        fitnessScore += x.getInvalidCount() * nullPenalty;
        fitnessScore += calculateTimeConflicts(x) * timeConflictPenalty;
        fitnessScore += calculateNameConflicts(x) * nameConflictPenalty;
        fitnessScore += calculateRequiredSatisifability(x, requiredCount) * unfulfilledRequirementPenalty;
        //results[i] = fitnessScore;
        //System.out.println("Fitness Score = " + fitnessScore);
        x.setRequiredScore(fitnessScore);
        x.setOptionalScore(0);
        return fitnessScore;
    }

    private static int calculateRequiredSatisifability(Schedule target, int num) {
        Section[] sections = target.getSections();
        int total = 0;
        for(int i = 0; i < sections.length; i++) {
            if(sections[i] == null) {
                continue;
            } else if(sections[i].isRequired()) {
                total++;
            }
        }
        return Math.abs(num - total);
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
