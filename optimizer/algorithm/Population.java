package optimizer.algorithm;

import java.util.*;
import optimizer.Utils;

public class Population {

    private Course[] registerdCourses;
    private HashMap<String, Section> idSection;
    private final int scheduleSize;
    private final int generationSize = 50;
    private int sectionLen;
    Random r;

    public Population(CourseOverview[] registeredC) {
        this.registerdCourses = new Course[registeredC.length];
        this.idSection = new HashMap<String, Section>();
        this.scheduleSize = registeredC.length;
        r = new Random();
        this.generatedCourseStruct(registeredC);
    }


    /**
     * A helper method that populates the sections hashamp by instanating sections for each course
     * @param c An array of course overviews that should ulimately be converted to Courses and their respective Sections. 
     */
    private void generatedCourseStruct(CourseOverview[] c) {
        //How long is each course ID suppossed to be?
        int totalSections = 0;
        for(int i = 0; i < c.length; i++) {
            totalSections += c[i].getNumberOfSections();
            registerdCourses[i] = new Course(c[i]);
        }
        //Find the total number of bits required to represent based on the log of the total number of sections
        int repBits = (int) Math.ceil(Utils.LogB(totalSections, 2));
        this.sectionLen = repBits;
        int minCount = 0;
        for(int i = 0; i < c.length; i++) {
            Section[] instSections = this.registerdCourses[i].instantiate(minCount, repBits);
            for(int j = 0; j < instSections.length; j++) {
                idSection.put(instSections[j].getID(), instSections[j]);
            }
            minCount+=c[i].getNumberOfSections();
        }
    }

    /**
     * A protected seed generator that generates a seed with only courses that exist
     * @return A schedule that contains sections that exist, but could contain duplicates or other issues. 
     */
    private Schedule generateSeed() {
        Section[] x = new Section[this.scheduleSize];
        Section[] mapValues = idSection.values().toArray(new Section[idSection.size()]);
        for(int i = 0; i < x.length; i++) {
            //Get a bunch of valid -- but random sections. 
            x[i] = mapValues[Utils.randInRange(r, 0, mapValues.length-1)];
        }
        return new Schedule(x);
    }

    private Schedule crossOver(Schedule s1, Schedule s2) {
        //Determine how many characters there are in a section
        //int sectionLength = s1.getSections()[0].getID().length();
        boolean[][] gene1 = new boolean[s1.getSections().length][this.sectionLen];
        boolean[][] gene2 = new boolean[gene1.length][this.sectionLen];
        boolean[][] gener = new boolean[gene1.length][this.sectionLen];

        //Decompose the schedules into boolean genes of each of their constituent sections
        for(int i = 0; i < gene1.length; i++) {

            if(s1.getSections()[i] == null) {
                gene1[i] = Utils.stringToBoolArray(generateSeed().getSections()[0].getID());
            } else {
                gene1[i] = Utils.stringToBoolArray(s1.getSections()[i].getID());
            } 

            if(s2.getSections()[i] == null) {
                gene2[i] = Utils.stringToBoolArray(generateSeed().getSections()[0].getID());
            } else {
                gene2[i] = Utils.stringToBoolArray(s2.getSections()[i].getID());
            } 

            for(int j = 0; j < gene1[i].length; j++) {
                //Under certain conditions, flip some bits before crossing over
                if(Utils.randInRange(r, 0, i*j) % 2 == 0) {
                    gene1[i][j] = !gene1[i][j];
                    gene2[i][j] = !gene2[i][j];
                } 
            }
        }

        //Make the child be randomly selecting genes from each of the two parents
        for(int i = 0; i < gener.length; i++) {
            int crossGene = Utils.randInRange(r, 0, 1);
            if(crossGene == 0) {
                gener[i] = gene1[i];
            } else {
                gener[i] = gene2[i];
            }
        }

        //Now, we must make a new Section
        return new Schedule(idSection, gener);
    }

    public Schedule getBestSchedule() {
        //The best fitness score is infinite because we don't know where to begin yet. 
        int bestFitnessScore = Integer.MAX_VALUE;
        //Seed the fitness pool with a bunch of random values
        Schedule[] fitPool = new Schedule[this.generationSize * 2];
        for(int i = 0; i < fitPool.length; i++) {
            fitPool[i] = generateSeed();
        }
        //Calculate the fitness score of said starting population. 
        calculateFitnessScores(fitPool);
        //Sort the array based on the fitness scores
        Utils.sortScheduleArray(fitPool, 0, fitPool.length - 1);

        while(bestFitnessScore > 0) {
            System.out.println("UwU");
            //Create a new array
            Schedule[] thisGen = new Schedule[this.generationSize];
            
            //First, let's populate the array with crosses of the best individual
            for(int i = 0; i < thisGen.length / 2; i++) {
                int secondPtr = Utils.randInRange(r, 0, fitPool.length - 1);
                while(secondPtr == i) {
                    secondPtr = Utils.randInRange(r, 0, fitPool.length - 1);
                }
                thisGen[i] = crossOver(fitPool[i], fitPool[secondPtr]);
            }

            //Now, let's do some random crosses to fill up to the rest of the array
            for(int i = thisGen.length / 2; i < thisGen.length; i++) {
                //thisGen[i-1] = this.crossOver(fitPool[0], fitPool[i]); 
                int rand1 = Utils.randInRange(r, 0, this.generationSize - 1);
                int rand2 = Utils.randInRange(r, 0, this.generationSize - 1);
                //We can't cross an individual with itself, keep generating a new pairing until we find a pair to cross
                while(rand1 == rand2) {
                    rand1 = Utils.randInRange(r, 0, this.generationSize - 1);
                }
                thisGen[i] = this.crossOver(fitPool[rand1], fitPool[rand2]);
            }
            
            //Now that we're done forming the generation, it's time to determine its fitness scores
            this.calculateFitnessScores(thisGen);

            //Now, sort the array to make it easier to select the fittest and second fittest individual 
            Utils.sortScheduleArray(thisGen, 0, thisGen.length-1);

            //Now, perform a roulette-wheel integration into the overall fitness pool
            Utils.mergeInto(thisGen, fitPool, r);

            bestFitnessScore = fitPool[0].getFitnessScore();
        }

        return fitPool[0];
    }

    private void calculateFitnessScores(Schedule[] x) {
        for(int i = 0; i < x.length; i++) {
            //x[i].setFitnessScore(x[i].getInvalidCount());
            int fitnessScore = 0;
            fitnessScore += x[i].getInvalidCount()*1000;
            fitnessScore += calculateStartConflicts(x[i])*100;
        }
    }

    private int calculateStartConflicts(Schedule x) {
        HashMap<Integer, Integer> count = new HashMap<Integer, Integer>();
        Section[] sections = x.getSections();
        for(int i = 0; i < sections.length; i++) {
            //If the section contained is a null ptr, then just ignore it. 
            if(sections[i] == null) {
                continue;
            }

            Integer time = Integer.valueOf(sections[i].getTime());
            if(count.containsKey(time)) {
                Integer temp = count.get(time);
                temp = Integer.valueOf(temp.intValue() + 1);
                count.put(time, temp);
            } else {
                count.put(time, Integer.valueOf(1));
            }
        }
        return Utils.findNumConflicts(count);
    }

}
