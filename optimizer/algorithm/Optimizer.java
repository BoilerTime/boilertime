package optimizer.algorithm;

import java.util.*;

import optimizer.Utils;
import optimizer.algorithm.Analyzer.QualityAnalyzer;
import optimizer.algorithm.Events.Block;
import optimizer.algorithm.Events.Event;
import optimizer.algorithm.Events.Lecture;
import optimizer.constants.Constants;
import optimizer.constants.PreferenceList;
import optimizer.constants.TimeOfDay;
import optimizer.network.NetworkHandler;
import optimizer.parameters.BlockOverview;
import optimizer.parameters.Course;
import optimizer.parameters.CourseOverview;

public class Optimizer {

    private Course[] registerdCourses;
    private Block[] blocks;
    private HashMap<String, Event> idEvent;
    private final int scheduleSize;
    private final int courseSize;
    private final int generationSize = 32;
    private final int maxIterations = 100000;
    private final int maxScheduleSize = 5;
    private final int numBlocks;
    private int mutationRate = 10; 
    private int waitGens; 
    private final int crossOverRate = 90;
    private final NetworkHandler net;
    private int numRequired;
    private boolean isSatisfiable = true; 
    private int sectionLen;
    private Schedule[] options;
    private final int numOptions = 5;
    private int numSatisfied; 
    private QualityAnalyzer analyzer; 
    Random r;

    public Optimizer(CourseOverview[] registeredC, BlockOverview[] blocks, NetworkHandler network, TimeOfDay timePreference, PreferenceList[] preferences, int totalClasses) {
        this.analyzer = new QualityAnalyzer(preferences, timePreference, blocks.length, registeredC.length);

        this.idEvent = new HashMap<String, Event>();
        this.parseEventOverviews(registeredC, blocks);
        this.numBlocks = blocks.length;

        this.courseSize = this.calculateScheduleSize(registeredC.length, totalClasses);// = registeredC.length;
        this.scheduleSize = this.courseSize + this.blocks.length;
        System.out.println("Schedule size = " + this.scheduleSize);
        r = new Random(100);
        
        this.net = network;
        
        this.options = new Schedule[numOptions];
        this.numSatisfied = 0;
        this.waitGens = 0;
        for ( String key : idEvent.keySet() ) {
            System.out.println( key );
        }
        System.out.println(blocks.length);
        System.out.println("NUM REQUIRED = " + this.numRequired);
    }


    /**
     * A helper method that populates the sections hashamp by instanating sections for each course
     * @param c An array of course overviews that should ulimately be converted to Courses and their respective Sections. 
     */
    private void parseEventOverviews(CourseOverview[] c, BlockOverview[] b) {
        int totalSections = 0;
        int totalBlocks = b.length;
        this.registerdCourses = new Course[c.length];
        this.blocks = new Block[b.length];

        ArrayList<Lecture> singleCount = new ArrayList<Lecture>();
        for(int i = 0; i < c.length; i++) {
            //System.out.println(c[i]);
            totalSections += c[i].getNumberOfSections();
            if(c[i].isRequired()) {
                numRequired ++;
            }
            registerdCourses[i] = new Course(c[i]);
        }

        System.out.println("Num required = " + numRequired);

        int repBits = calculateNameBits(totalSections, totalBlocks);

        this.sectionLen = repBits + 2;
        int minCount = 0;

        /*
         * Loop through all the sections and generate an appropriate section structure to represent them
         */
        for(int i = 0; i < c.length; i++) {
            Lecture[] instSections = this.registerdCourses[i].instantiate(minCount, repBits);
            for(int j = 0; j < instSections.length; j++) {
                idEvent.put(instSections[j].getID(), (Event) instSections[j]);
            }
            //Determine if we have courses that only have a single section, as this warrants pre-entry analysis. 
            if(instSections.length == 1) {
                singleCount.add(instSections[0]);
            }
            minCount+=c[i].getNumberOfSections();
        }

        /*
         * Loop through all the blocks and generate an appropriate block structure to represent them 
         */
        for(int i = 0; i < totalBlocks; i++) {
            int[] id = Utils.numToBin(minCount++, repBits);
            String sID = Constants.BLOCK + Utils.arrToString(id);
            System.out.println("SID = " + sID);
            this.blocks[i] = new Block(b[i], sID);
            idEvent.put(sID, (Event) this.blocks[i]);
        }

        if(singleCount.size() > 0) {
            this.isSatisfiable = analyzer.calculateTimeConflicts(new Schedule(singleCount.toArray(new Lecture[singleCount.size()]))) == 0;
            System.out.println(this.isSatisfiable);
        } else {
            this.isSatisfiable = true;
        }
    }

    private int calculateNameBits(int courseLen, int blockLen) {
        return (int) Math.ceil(Utils.LogB(courseLen + blockLen, 2));
    }

    private int calculateScheduleSize(int size, int prefered) {
        if(prefered <= size && prefered < this.maxScheduleSize) {
            return prefered;
        } else if (prefered > size && size < this.maxScheduleSize) {
            return size;
        }
        return this.maxScheduleSize;
    }

    /**
     * A protected seed generator that generates a seed with only courses that exist
     * @return A schedule that contains sections that exist, but could contain duplicates or other issues. 
     */
    private Schedule generateSeed() {
        Event[] x = new Event[this.scheduleSize];
        Event[] mapValues = idEvent.values().toArray(new Event[idEvent.size()]);
        for(int i = 0; i < x.length; i++) {
            //Get a bunch of valid -- but random sections. 
            x[i] = mapValues[Utils.randInRange(r, 0, mapValues.length-1)];
        }
        return new Schedule(x);
    }

    private Schedule crossOver(Schedule s1, Schedule s2) {
        //Determine how many characters there are in a section
        //int sectionLength = s1.getSections()[0].getID().length();
        if(Utils.randInRange(r, 0, 100) > crossOverRate) {
            if(s1.getFitnessScore() > s2.getFitnessScore()) {
                return s1;
            }
            return s2;
        }
        boolean[][] gene1 = new boolean[s1.getEvents().length][this.sectionLen];
        boolean[][] gene2 = new boolean[gene1.length][this.sectionLen];
        boolean[][] gener = new boolean[gene1.length][this.sectionLen];

        //Decompose the schedules into boolean genes of each of their constituent sections
        for(int i = 0; i < gene1.length; i++) {

            if(s1.getEvents()[i] == null) {
                gene1[i] = Utils.stringToBoolArray(generate1s());//Utils.stringToBoolArray(generateSeed().getEvents()[0].getID());
            } else {
                gene1[i] = Utils.stringToBoolArray(s1.getEvents()[i].getID());
            } 

            if(s2.getEvents()[i] == null) {
                gene2[i] = Utils.stringToBoolArray(generate1s());
            } else {
                gene2[i] = Utils.stringToBoolArray(s2.getEvents()[i].getID());
            } 

            for(int j = 0; j < gene1[i].length; j++) {
                //Under certain conditions, flip some bits before crossing over
                if(Utils.randInRange(r, 1, 100) > this.crossOverRate) {
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
        swapClass = Math.max(swapClass, Utils.randInRange(r, 0, gene1.length-1));

        //Perform the swaps that favor the better individual but still allow the worse individual to have some influence
        for(int i = 0; i < gener.length; i++) {
            if(i == swapClass && (upperBound != 0 || Utils.randInRange(r, 0, swapClass) % 2 == 0)) {
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
        return new Schedule(idEvent, gener);
    }

    private String generate1s() {
        String result = "";
        for(int i = 0; i < this.sectionLen; i++) {
            result += "1";
        }
        return result;
    }

    private Schedule mutateSchedule(Schedule target) {
        //System.out.println("MUTATING!");
        boolean[][] parent = new boolean[target.getEvents().length][this.sectionLen];
        boolean[][] mutated = new boolean[parent.length][this.sectionLen];
        analyzer.calculateIndividualRequiredScore(target, this.numRequired);
        //Decompose the schedules into boolean genes of each of their constituent sections
        for(int i = 0; i < parent.length; i++) {
            
            if(target.getEvents()[i] == null) {
                parent[i] = Utils.stringToBoolArray(generateSeed().getEvents()[0].getID());
            } else {
                parent[i] = Utils.stringToBoolArray(target.getEvents()[i].getID());
            } 

            for(int j = 0; j < parent[i].length; j++) {
                //Under certain conditions, flip some bits before crossing over
                if(Utils.randInRange(r, 0, 100) < this.mutationRate) {
                    //System.out.println("Actually mutating!");
                    //System.out.println("Mutating!");
                    mutated[i][j] = !parent[i][j];
                } else {
                    mutated[i][j] = parent[i][j];
                }
            }
        }
        return new Schedule(idEvent, mutated);
    }


    public Schedule[] getBestSchedule() {
        if(!this.isSatisfiable) {
            return null;
        }
        
        if(this.registerdCourses.length == 1) {
            Schedule[] res = new Schedule[1];
            Event[] resD = new Event[registerdCourses.length + blocks.length];
            resD[0] = idEvent.get(Utils.arrToString(Utils.numToBin(0, sectionLen)));//this.registerdCourses[0];
            for(int i = 0; i < blocks.length; i++) {
                resD[i+1] = blocks[i]; 
            }
            res[0] = new Schedule(resD);
            return res;
        }

        //Seed the fitness pool with a bunch of random values
        Schedule[] fitPool = new Schedule[this.generationSize * 2];
        for(int i = 0; i < fitPool.length; i++) {
            fitPool[i] = generateSeed();
        }
        //Calculate the fitness score of said starting population. 
        analyzer.calculateTotalFitnessScores(fitPool, numRequired);
        //System.out.println("First score  = " + fitPool[0].getFitnessScore());

        //Sort the array based on the fitness scores
        Utils.sortScheduleArray(fitPool, 0, fitPool.length - 1);
        int iterationCount = 0;
        while(this.shouldContinue(iterationCount)) {
            //System.out.println(iterationCount);
            iterationCount++;
                        //System.out.println("\nNew Generation = " + iterationCount );
            //Create a new array
            Schedule[] thisGen = new Schedule[this.generationSize];
            
            //First, let's populate the array with crosses of the best individual
            for(int i = 0; i < thisGen.length / 2; i++) {
                int secondPtr = Utils.randInRange(r, 0, fitPool.length - 1);
                while(secondPtr == i) {
                    secondPtr = Utils.randInRange(r, 0, fitPool.length - 1);
                }
                thisGen[i] = crossOver(fitPool[0], fitPool[secondPtr]);
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

            analyzer.calculateTotalFitnessScores(thisGen, numRequired);
            //System.out.println(thisGen[0].getRequiredScore());
            //System.out.println("Composite Score = " + thisGen[0].getFitnessScore());
            //Now, sort the array to make it easier to select the fittest and second fittest individual 
            Utils.sortScheduleArray(thisGen, 0, thisGen.length-1);
            analyzer.addScore(thisGen[0]);
            //Now, perform a roulette-wheel integration into the overall fitness pool
            Utils.mergeInto(thisGen, fitPool, r);
            Utils.sortScheduleArray(fitPool, 0, fitPool.length - 1);
        }
        System.out.println("\n\n===================");
        System.out.println("Found Optimal Solution After " + iterationCount + " Generations");
        System.out.println("===================\n\n");
        //System.out.println("Convergence: " + q.mayHaveConverged());
        return options;
    }

    private boolean shouldContinue(int currentIndex) {
        if(this.mutationRate == 90) {
            if(this.waitGens < 3) {
                waitGens++;
            } else {
                waitGens = 0;
                mutationRate = 3;
            }
        }
        if(currentIndex > 0 && currentIndex % QualityAnalyzer.numSimilarForConvergence == 0) {
            //this.sendStatusUpdate(currentIndex);
            double convergneceScore = analyzer.getRMSConvergence();
            //System.out.println("IN IF!");
            if(convergneceScore > .5) {
                net.sendMessage("{\"status\":200,\"message\":\"Status Update\",\"data\":1}");
            } else if (convergneceScore > .1) {
                net.sendMessage("{\"status\":200,\"message\":\"Status Update\",\"data\":1}");
            } else if (convergneceScore > 5E-3f) {
                net.sendMessage("{\"status\":200,\"message\":\"Status Update\",\"data\":1}");
            } else {
                net.sendMessage("{\"status\":200,\"message\":\"Status Update\",\"data\":1}");
            }
            //System.out.println("Score = " + ((convergneceScore < 9.0E-4f) && this.numSatisfied < this.numOptions) + " " + convergneceScore + " " + this.numSatisfied);
            if((convergneceScore < 9.0E-4f) && this.numSatisfied < this.numOptions && analyzer.getBestSchedule().getRequiredScore() == 0) {
                //System.out.println("Adding an option!!");
                if(this.numSatisfied > 0) {
                    /*if(q.getBestSchedule().equals(this.options[this.options.length - 1])) {
                        this.mutationRate = 50;
                        return true; 
                    }*/

                    Schedule best = analyzer.getBestSchedule();
                    if(best.getRequiredScore() > 0) {
                        this.mutationRate = 90;
                        this.waitGens = 0;
                        return true;
                    }
                    for(int j = 0; j < this.numSatisfied; j++) {
                        //System.out.println("LOOPING!");
                        //System.out.println(this.options[0].getEvents()[0].getID());
                        Event[] optionsJ = Utils.sortSchedule(this.options[j]);
                        Event[] bestJ = Utils.sortSchedule(best);
                        boolean found = false;
                        int index = 0;
                        while(!found && index < bestJ.length) {
                            if(!optionsJ[index].getID().equals(bestJ[index].getID())) {
                                found = true;
                            }
                            index++;
                        }
                        if(!found) {
                            this.mutationRate = 90;
                            this.waitGens = 0;
                            return true;
                        }
                    }
                }
                options[this.numSatisfied] = analyzer.getBestSchedule();
                //System.out.println(Arrays.toString(this.options));
                this.numSatisfied++;
                return true; 
            } else if (this.numSatisfied == this.numOptions){
                //System.out.println("STOPPING!");
                //System.out.println(this.numRequired);
                //System.out.println(this.numSatisfied);
                return false; 
            } else {
                //System.out.println("UWU");
                return true; 
            }
        }
        return currentIndex < this.maxIterations; 
    }
}