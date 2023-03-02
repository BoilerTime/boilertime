package optimizer;

import java.util.*;

public class Population {
    private CourseStruct[] registeredCourses;
    private HashMap<String, Integer> binCourseTimes; 
    //private HashMap<String, Integer> binCourseDurations;
    private ArrayList<Generation> genePool = new ArrayList<Generation>();
    private int individualSize; 
    private final int generationSize = 10; 
    Random pop;
    
    public Population(CourseOverview[] course) {
        this.registeredCourses = new CourseStruct[course.length];
        this.binCourseTimes = new HashMap<String, Integer>();
        //this.binCourseDurations = new HashMap<String, Integer>();
        addCourses(course);
        pop = new Random();
        individualSize = calculateIndividualSize();
        System.out.println("Size " + individualSize);
        //System.out.println(binCourseTimes.get());
        System.out.println("Done COnfiguring");
    }

    private void addCourses(CourseOverview[] course) {
        int totalTimes = 0;
        int totalDurations = 0;
        for(int i = 0; i<course.length; i++) {
            //System.out.println(Arrays.toString(Utils.numToBin(i)));
            registeredCourses[i] = new CourseStruct(course[i], Utils.arrToString(Utils.numToBin(i, (int) Math.ceil(Utils.LogB(course.length, 2)))));
            //System.out.println(registeredCourses[i].getBinaryID());
            totalTimes += course[i].getCourseTimes().length;
            totalDurations += course[i].getCourseDurations().length;
        }

        /*
         * Get all of the course times, sort them, and put them into a binary hashmap to match the bitstring with the numerical value
         */
        int[] courseTimes = new int[totalTimes];
        int totalCount = 0;
        for(int i = 0; i < course.length; i++){
            for(int j = 0; j < course[i].getCourseTimes().length; j++) {
                courseTimes[totalCount++] = course[i].getCourseTimes()[j];
            }
        }
        Arrays.sort(courseTimes);
        for(int i = 0; i < courseTimes.length; i++) {
            binCourseTimes.put(Utils.arrToString(Utils.numToBin(i, (int)Math.ceil(Utils.LogB(courseTimes.length, 2)))), Integer.valueOf(courseTimes[i]));
            //System.out.println("Y " + i + " " + binCourseTimes.size());
        }
    }

    private void seedPopulation() {
        Individual[] startGenes = new Individual[this.generationSize];
        //We're just going to seed this randomly. Not well informed but it's how evolution works
        for(int i = 0; i < this.generationSize; i++) {
            String temp = "";
            for(int j = 0; j < this.individualSize; j++){
                temp += Utils.randInRange(pop, 0, 1);
            }
            startGenes[i] = new Individual(temp);
        }        
        genePool.add(new Generation(startGenes, calculateFitnessScores(startGenes)));
    }



    public Individual getFittestIndividual() {
        //We need two initial generations to breed together in the future
        seedPopulation();
        seedPopulation();
        evolve();
        return this.genePool.get(0).getFittestIndividual();
    }

    private int calculateIndividualSize() {
        return registeredCourses.length * ((int) Math.ceil(Utils.LogB(registeredCourses.length, 2)) + ((int) Math.ceil(Utils.LogB(binCourseTimes.size(), 2))));// + (int) Math.ceil(Math.log(binCourseDurations.size())) ; 
    }

    private void evolve() {
        int count = 2;
        int bestFitScore = Integer.MAX_VALUE;
         
        while(bestFitScore == 0 || count == (int)Math.pow((double)2, (double)individualSize)) {
            Generation b1 = genePool.get(count - 1);
            Generation b2 = genePool.get(count - 2);
            //Make a larger than necessary gene pool that can then be quelled 
            Individual[] results = new Individual[2 * generationSize];
            //First, do a high-high crossing
            results[0] = b2.getFittestIndividual().crossOver(b1.getFittestIndividual());
            for(int i = 1; i < results.length; i++) {

            }
            //Next, randomly mix together the two gene pools 
        }
    }

    private int[] calculateFitnessScores(Individual[] indivs) {
        //Trying to find the schedule with the fewest schedule conflicts 
        int[] compositeScores = new int[indivs.length];
        for(int i = 0; i < indivs.length; i++) {
            int indivScore = 0;
            //Get each chromosome (course) out of each individual to check for matches
            String[] chromosomes = Utils.splitString(indivs[i].getIndividual(), individualSize/registeredCourses.length);
            //System.out.println(individualSize);
            indivScore += 10*calculateCourseNameConflicts(chromosomes);
            compositeScores[i] = indivScore;
            indivScore += 100*calculateCourseTimeConflicts(chromosomes);
        }
        return compositeScores;
    }

    private int calculateCourseNameConflicts(String[] chromosomes) {
        HashMap<String, Integer> cCount = new HashMap<String, Integer>();
        //Push each of the IDs and its count into a hashamp 
        for(int i = 0; i < chromosomes.length; i++) {
            String temp = chromosomes[i].substring(0, ((int) Math.ceil(Utils.LogB(registeredCourses.length, 2)))-1);
            if(cCount.get(temp) == null) {
                cCount.put(temp, Integer.valueOf(1));
            } else {
                cCount.put(temp, Integer.valueOf(cCount.get(temp).intValue() +1));   
            }
        }

        return Utils.findMaxConflicts(cCount);
    }

    private int calculateCourseTimeConflicts(String[] chromosomes) {
        //There exist two types of conflicts -- start time conflicts and time overlap conflicts (one course goes longer than another)
        HashMap<String, Integer> sTimeCounts = new HashMap<String, Integer>();
        int[][] courseTimes = new int[chromosomes.length][2];
        int[] courseIDs = new int[chromosomes.length];
        for(int i = 0; i < chromosomes.length; i++) {
            //System.out.println(chromosomes[i]);

            String temp = chromosomes[i].substring(((int) Math.ceil(Utils.LogB(registeredCourses.length, 2))));

            if(!binCourseTimes.containsKey(temp)) {
                return Integer.MAX_VALUE;
            }
            courseTimes[i][0] = binCourseTimes.get(temp);//Utils.binStringToNum(temp);
            //Commit the course names to an array 
            courseIDs[i] = Utils.binStringToNum(chromosomes[i].substring(0, ((int) Math.ceil(Utils.LogB(registeredCourses.length, 2)))-1));
            if(sTimeCounts.get(temp) == null) {
                sTimeCounts.put(temp, Integer.valueOf(1));
            } else {
                sTimeCounts.put(temp, Integer.valueOf(sTimeCounts.get(temp).intValue() +1));
            }
        }

        int numStartConflicts = Utils.findMaxConflicts(sTimeCounts);
        
        //Next, find the number of overlap conflicts.
        //If the end time of one class is after the start time of another class, then there is a conflict
        int[][] courseDurations = new int[chromosomes.length][2];
        int numDurationConflicts = 0;

        for(int i = 0; i < courseDurations.length; i++) {
            courseDurations[i][1] = courseDurations[i][0] + registeredCourses[courseIDs[i]].getCourseDuration(courseTimes[i][0]);
            //courseDurations[i] = registeredCourses[courseIDs[i]].getCourseDuration(courseTimes[i]);
        }

        //If the start time of a course is less than the end time of another class, but is greater than the start time of said class, then there exists a conflict 
        for(int i = 0; i<courseDurations.length; i++) {
            for(int j = 0; j < courseDurations.length; j++) {
                if(i != j) {
                    //i starts at 10 and ends at 50
                    //j starts at 90 and ends at 110
                    if((courseDurations[j][0] > courseDurations[i][0]) && (courseDurations[i][1] > courseDurations[j][0])) {
                        numDurationConflicts++;
                    }
                }
            }
        }
        return numStartConflicts+numDurationConflicts;
    }
}
