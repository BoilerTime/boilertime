package optimizer.algorithm;

import java.util.*;
import java.io.*;
import optimizer.Utils;

public class Population {

    private Course[] registerdCourses;
    private HashMap<String, Section> idSection;
    private final int scheduleSize;
    private final int generationSize = 50;
    private final int maxIterations = 10000;
    private final int maxScheduleSize = 5;
    private int numRequired;
    private boolean isSatisfiable = true; 
    private int sectionLen;
    private RequiredAnalyzer required;
    Random r;

    public Population(CourseOverview[] registeredC) {
        this.registerdCourses = new Course[registeredC.length];
        this.idSection = new HashMap<String, Section>();
        this.scheduleSize = this.calculateScheduleSize(registeredC.length);// = registeredC.length;
        r = new Random();
        this.generateCourseStruct(registeredC);
        this.required = new RequiredAnalyzer(true);
    }


    /**
     * A helper method that populates the sections hashamp by instanating sections for each course
     * @param c An array of course overviews that should ulimately be converted to Courses and their respective Sections. 
     */
    private void generateCourseStruct(CourseOverview[] c) {
        //How long is each course ID suppossed to be?
        int totalSections = 0;
        this.numRequired= 0;
        //int singleCount = 0;
        //HashMap<Integer, Integer> singleCount = new HashMap<Integer, Integer>();
        ArrayList<Section> singleCount = new ArrayList<Section>();
        for(int i = 0; i < c.length; i++) {
            totalSections += c[i].getNumberOfSections();
            if(c[i].isRequired()) {
                numRequired ++;
            }
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
            //Determine if we have courses that only have a single section, as this warrants pre-entry analysis. 
            if(instSections.length == 1) {
                singleCount.add(instSections[0]);
            }
            minCount+=c[i].getNumberOfSections();
        }

        if(singleCount.size() > 0) {
            this.isSatisfiable = RequiredAnalyzer.calculateTimeConflicts(new Schedule(singleCount.toArray(new Section[singleCount.size()]))) == 0;
            System.out.println(this.isSatisfiable);
        } else {
            this.isSatisfiable = true;
        }
    }

    private int calculateScheduleSize(int size) {
        if(size < this.maxScheduleSize) {
            return size;
        }
        return this.maxScheduleSize;
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
                if(Utils.randInRange(r, 0, s1.getFitnessScore() + s2.getFitnessScore()) > 100) {
                    if(s1.getFitnessScore() > s2.getFitnessScore()) {
                        gene2[i][j] = !gene2[i][j];
                    } else {
                        gene1[i][j] = !gene1[i][j];
                    }
                } 
            }
        }

        //Generate cross-over intervals inspired by the fitness scores of the two 
        int betterSectionPtr;
        int upperBound;
        RequiredAnalyzer.calculateIndividualRequiredScore(s1, true, this.scheduleSize);
        RequiredAnalyzer.calculateIndividualRequiredScore(s2, true, this.scheduleSize);
        if(s1.getFitnessScore() > s2.getFitnessScore()) {
            betterSectionPtr = 1;//s2.getFitnessScore();
            upperBound = s2.getFitnessScore();
        } else if(s1.getFitnessScore() < s2.getFitnessScore()) {
            betterSectionPtr = 0;//s1.getFitnessScore();
            upperBound = s2.getFitnessScore();
        } else {
            betterSectionPtr = Utils.randInRange(r, 0, 1);
            upperBound = s1.getFitnessScore();
        }
        //int upperBound = Math.max(s1.getFitnessScore(), s2.getFitnessScore());
        int swapClass = Math.max(1, upperBound % (gene1.length-1));

        //Perform the swaps that favor the better individual but still allow the worse individual to have some influence
        for(int i = 0; i < gener.length; i++) {
            if(i == swapClass) {
                if(betterSectionPtr == 0) {
                    gener[i] = gene1[i];
                } else {
                    gener[i] = gene2[i];
                }
            } else {
                if(betterSectionPtr == 0) {
                    gener[i] = gene2[i];
                } else {
                    gener[i] = gene1[i];
                }
            }
        }

        //Now, we must make a new Section
        return new Schedule(idSection, gener);
    }

    private Schedule mutateSchedule(Schedule target) {
        boolean[][] parent = new boolean[target.getSections().length][this.sectionLen];
        boolean[][] mutated = new boolean[parent.length][this.sectionLen];
        RequiredAnalyzer.calculateIndividualRequiredScore(target, true, scheduleSize);
        //Decompose the schedules into boolean genes of each of their constituent sections
        for(int i = 0; i < parent.length; i++) {
            
            if(target.getSections()[i] == null) {
                parent[i] = Utils.stringToBoolArray(generateSeed().getSections()[0].getID());
            } else {
                parent[i] = Utils.stringToBoolArray(target.getSections()[i].getID());
            } 

            for(int j = 0; j < parent[i].length; j++) {
                //Under certain conditions, flip some bits before crossing over
                if(Utils.randInRange(r, 0, i*j+(target.getFitnessScore())) % 2 == 0) {
                    //System.out.println("Mutating!");
                    mutated[i][j] = !parent[i][j];
                } else {
                    mutated[i][j] = parent[i][j];
                }
            }
        }
        return new Schedule(idSection, mutated);
    }


    public Schedule getBestSchedule() {
        if(!this.isSatisfiable) {
            return null;
        }
        //The best fitness score is infinite because we don't know where to begin yet. 
        int bestFitnessScore = Integer.MAX_VALUE;
        //Seed the fitness pool with a bunch of random values
        Schedule[] fitPool = new Schedule[this.generationSize * 2];
        for(int i = 0; i < fitPool.length; i++) {
            fitPool[i] = generateSeed();
        }
        //Calculate the fitness score of said starting population. 
        RequiredAnalyzer.calculateFitnessScores(fitPool, true, numRequired);
        //Sort the array based on the fitness scores
        Utils.sortScheduleArray(fitPool, 0, fitPool.length - 1);
        int iterationCount = 0;
        while(bestFitnessScore > 0 && iterationCount < this.maxIterations) {
            System.out.println("\nNew Generation = " + iterationCount );
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

            if(iterationCount >2) {
                int tangent = required.calculateTangent(iterationCount -2, iterationCount - 1);
                System.out.println("Tangent from previous two = " + tangent);
                if(Math.abs(tangent) == 0 || Math.abs(tangent) > 1000) {
                    for(int i = 0; i < thisGen.length; i++) {
                        thisGen[i] = this.mutateSchedule(thisGen[i]);
                    }
                }
            }
            
            //Now that we're done forming the generation, it's time to determine its fitness scores
            RequiredAnalyzer.calculateFitnessScores(thisGen, true, numRequired);

            //Now, sort the array to make it easier to select the fittest and second fittest individual 
            Utils.sortScheduleArray(thisGen, 0, thisGen.length-1);
            System.out.println("Tangent Score: " + required.addScore(thisGen[0]));
            //Now, perform a roulette-wheel integration into the overall fitness pool
            Utils.mergeInto(thisGen, fitPool, r);
            bestFitnessScore = fitPool[0].getRequiredScore();
            System.out.println("Best = " + bestFitnessScore);
            System.out.println("Recorded best = " + fitPool[0].getRequiredScore() + " " + fitPool[0].getFitnessScore());
            for(int k = 0; k < fitPool[0].getSections().length; k++) {
                if(fitPool[0].getSections()[k] != null) {
                    System.out.println(fitPool[0].getSections()[k].getParent().getCourseName() + " " + fitPool[0].getSections()[k].getTime() + " " + fitPool[0].getSections()[k].getDuration() + " " + fitPool[0].getInvalidCount() + " " + fitPool[0].getFitnessScore());
                } else {
                    System.out.println("NULL!");
                }
            }
            //System.out.println("Record best is = " + Arrays.toString(fitPool[0].getSections()));
            iterationCount++;
        }
        System.out.println("\n\n===================");
        System.out.println("Found Optimal Solution After " + iterationCount + " Generations");
        System.out.println("Courses:");
        for(int k = 0; k < fitPool[0].getSections().length; k++) {
            if(fitPool[0].getSections()[k] != null) {
                System.out.println(fitPool[0].getSections()[k].getParent().getCourseName() + " " + fitPool[0].getSections()[k].getTime() + " " + fitPool[0].getSections()[k].getDuration() + Arrays.toString(fitPool[0].getSections()[k].getWeekDays()));
            } else {
                System.out.println("NULL!");
            }
        }

        System.out.println(required.getRequiredScores().toString());
        System.out.println("===================\n\n");



        FileWriter out;
        //Print the scores out to a file
        try {
            out = new FileWriter("/Users/henrymayer-school/btime/output.txt");
            Integer[] res = required.getRequiredScores().toArray(new Integer[required.getRequiredScores().size()]);
            for(int i = 0; i < res.length; i++) {
                out.write(res[i].intValue() + "\n");
            }
            out.close();

        } catch (IOException e) {

        }
        return fitPool[0];
    }
}