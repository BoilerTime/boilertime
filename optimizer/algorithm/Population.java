package optimizer.algorithm;

import java.util.*;
import optimizer.Utils;

public class Population {

    private Course[] registerdCourses;
    private HashMap<String, Section> idSection;
    private final int scheduleSize;
    Random r;

    public Population(CourseOverview[] registeredC) {
        this.registerdCourses = new Course[registeredC.length];
        this.idSection = new HashMap<String, Section>();
        this.scheduleSize = registeredC.length;
        r = new Random();
        this.generatedCourseStruct(registeredC);
        Schedule s1 = this.generateSeed();
        Schedule s2 = this.generateSeed();
        Schedule res = this.crossOver(s1, s2);
        System.out.println(s1 + " " + s2 + " " + res);
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
        int sectionLength = s1.getSections()[0].getID().length();
        boolean[][] gene1 = new boolean[s1.getSections().length][sectionLength];
        boolean[][] gene2 = new boolean[gene1.length][sectionLength];
        boolean[][] gener = new boolean[gene1.length][sectionLength];

        //Decompose the schedules into boolean genes of each of their constituent sections
        for(int i = 0; i < gene1.length; i++) {
            gene1[i] = Utils.stringToBoolArray(s1.getSections()[i].getID());
            gene2[i] = Utils.stringToBoolArray(s1.getSections()[i].getID());
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

}
