package optimizer.algorithm;
import java.util.Random;

import optimizer.Utils;

public class Individual {

    private String IndividualMakeUp;
    private Random r;


    public Individual(String chroms) {
        this.IndividualMakeUp = chroms;
        r = new Random();
    }

    /**
     * This function generates a new binary Individual based on the contents of the Individual in question and another one passed to it 
     * @param c2 The second Individual that is to be crossed over
     * @return A new Individual that represents the results of the cross 
     */
    public Individual crossOver(Individual c2) {
        String cr2 = c2.getIndividual();
        int crossLength = Math.min(IndividualMakeUp.length(), cr2.length()); //We can only crossover based on the length of the shortest Individual. Any extraneous portion will go un-evolved
        int startPosition = Utils.randInRange(r, 0, crossLength-1); //Only start from the position one before the end of the Individual
        int endPosition = Utils.randInRange(r, startPosition, crossLength); //We need a positive range to cut that starts and start position and ends at or prior to the length of the Individual
        //String c1Segment = IndividualMakeUp.substring(startPosition, endPosition);
        char crh1[] = getCharIndividual(IndividualMakeUp);
        char crh2[] = getCharIndividual(cr2);
        char[] results = new char[cr2.length()];
        for(int i = 0; i < results.length; i++) {
            if(i < startPosition) {
                results[i] = crh1[i];
            } else {
                if((Utils.randInRange(r, 0, i) + endPosition) % 2 == 0) {
                    results[i] = crh2[i];
                } else {
                    results[i] = crh1[i];
                }
            }
        }
        return new Individual(new String(results));
    }

    /**
     * This method mutates the Individual in question by applying a random amount of mutations to randomly selected array indicies. Note -- a double mutation is possible to mutate then mutate a second time back to the origin
     * @return {Individual} A new Individual that has had the mutation applied to it 
     */
    public Individual mutate() {
        char cr[] = getCharIndividual(IndividualMakeUp);
        int totalMutations = Utils.randInRange(r, 0, (cr.length-1)/2);
        for(int i = 0; i <totalMutations; i++) {
            if(cr[Utils.randInRange(r, 0, cr.length-1)] == '0') {
                cr[Utils.randInRange(r, 0, cr.length-1)] = '1';
            }
            else {
                cr[Utils.randInRange(r, 0, cr.length-1)] = '0';
            }
        }
        return new Individual(new String(cr));
    }



    /**
     * A method to get the String contents of the current Individual 
     * @return {String} The String contents of the Individual 
     */
    public String getIndividual() {
        return this.IndividualMakeUp;
    }

    /**
     * A method to get the entire char aray the represents the Individual
     * @return The char array
     */
    private char[] getCharIndividual(String c) {
        char[] Individual = new char[c.length()];
        for(int i = 0; i < Individual.length; i++) {
            Individual[i] = c.charAt(i);
        }
        return Individual;
    }


}
