package optimizer;

import java.util.*;

public class Population {
    private CourseStruct[] registeredCourses;
    private HashMap<String, Integer> binCourseTimes; 
    private HashMap<String, Integer> binCourseDurations;
    private ArrayList<Individual[]> genePool = new ArrayList<Individual[]>();
    private int individualSize; 
    private final int generationSize = 10; 
    Random pop;
    
    public Population(CourseOverview[] course) {
        this.registeredCourses = new CourseStruct[course.length];
        this.binCourseTimes = new HashMap<String, Integer>();
        this.binCourseDurations = new HashMap<String, Integer>();
        addCourses(course);
        pop = new Random();
        individualSize = calculateIndividualSize();

    }

    private void addCourses(CourseOverview[] course) {
        int totalTimes = 0;
        int totalDurations = 0;
        for(int i = 0; i<course.length; i++) {
            System.out.println(Arrays.toString(Utils.numToBin(i)));
            registeredCourses[i] = new CourseStruct(course[i], Arrays.toString(Utils.numToBin(i, (int) Math.ceil(Math.log(course.length)+1))));
            System.out.println(registeredCourses[i].getBinaryID());
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
            binCourseTimes.put(Arrays.toString(Utils.numToBin(i)), Integer.valueOf(courseTimes[i]));
        }

        /*
         * Get all the course durations, and then put them into a binary hashmap 
         */
        int[] courseDurations = new int[totalDurations];
        totalCount = 0;
        for(int i = 0; i < course.length; i++){
            for(int j = 0; j < course[i].getCourseDurations().length; j++) {
                courseDurations[totalCount++] = course[i].getCourseDurations()[j];
            }
        }
        Arrays.sort(courseDurations);
        for(int i = 0; i < courseDurations.length; i++) {
            binCourseDurations.put(Arrays.toString(Utils.numToBin(i)), Integer.valueOf(courseDurations[i]));
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
        genePool.add(startGenes);
    }



    public Individual getFittestIndividual() {
        seedPopulation();
        evolve();
        return this.genePool.get(0)[0];
    }

    private int calculateIndividualSize() {
        return registeredCourses.length + binCourseTimes.size() + binCourseDurations.size(); 
    }

    private void evolve() {

    }
}