package optimizer;
import java.util.Random;

public class Chromosome {

    private String data;
    private Random r;


    public Chromosome(String chromosome) {
        this.data = chromosome;
        r = new Random();
    }

    /**
     * This function generates a new binary chromosome based on the contents of the chromsome in question and another one passed to it 
     * @param c2 The second chromosome that is to be crossed over
     * @return A new chromosome that represents the results of the cross 
     */
    public Chromosome[] crossOver(Chromosome c2) {
        String cr2 = c2.getChromosome();
        int crossLength = Math.min(data.length(), cr2.length()); //We can only crossover based on the length of the shortest chromsome. Any extraneous portion will go un-evolved
        int startPosition = randInRange(0, crossLength-1); //Only start from the position one before the end of the chromosome
        int endPosition = randInRange(startPosition, crossLength); //We need a positive range to cut that starts and start position and ends at or prior to the length of the chromsome
        //String c1Segment = data.substring(startPosition, endPosition);
        Chromosome[] results = new Chromosome[2];
        char crh1[] = getCharChromsome(data);
        char crh2[] = getCharChromsome(cr2);
        for(int i = startPosition; i < endPosition; i++) {
            
            char temp = crh1[i];
            crh1[i] = crh2[i];
            crh2[i] = temp;
        }
        results[0] = new Chromosome(new String(crh1));
        results[1] = new Chromosome(new String(crh2));
        return results;
    }

    /**
     * This method mutates the chromsome in question by applying a random amount of mutations to randomly selected array indicies. Note -- a double mutation is possible to mutate then mutate a second time back to the origin
     * @return {Chromosome} A new chromosome that has had the mutation applied to it 
     */
    public Chromosome mutate() {
        char cr[] = getCharChromsome(data);
        int totalMutations = randInRange(0, (cr.length-1)/2);
        for(int i = 0; i <totalMutations; i++) {
            if(cr[randInRange(0, cr.length-1)] == '0') {
                cr[randInRange(0, cr.length-1)] = '1';
            }
            else {
                cr[randInRange(0, cr.length-1)] = '0';
            }
        }
        return new Chromosome(new String(cr));
    }

    /**
     * A method to get a random number that lies within a range [max, min]
     * @param min {int} The min value to find a random value for 
     * @param max {int} The max value to find a random value for 
     * @return {int} A psuedo-random value that lies within the range [min, max]
     */
    private int randInRange(int min, int max) {
		return r.nextInt((max - min) + 1) + min;
	}

    /**
     * A method to get the String contents of the current chromosome 
     * @return {String} The String contents of the chromosome 
     */
    public String getChromosome() {
        return this.data;
    }

    /**
     * A method to get the entire char aray the represents the chromsome
     * @return The char array
     */
    private char[] getCharChromsome(String c) {
        char[] chromsome = new char[c.length()];
        for(int i = 0; i < chromsome.length; i++) {
            chromsome[i] = c.charAt(i);
        }
        return chromsome;
    }


}
