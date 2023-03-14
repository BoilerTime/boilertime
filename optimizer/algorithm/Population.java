package optimizer.algorithm;

import java.io.FilterInputStream;
import java.util.*;

import optimizer.Utils;

public class Population {

    private Course[] registerdCourses;
    private HashMap<String, Section> idSection;
    public Population(CourseOverview[] registeredC) {
        this.registerdCourses = new Course[registeredC.length];
        this.idSection = new HashMap<String, Section>();
        generatedCourseStruct(registeredC);
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

}
