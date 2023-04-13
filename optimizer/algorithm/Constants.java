package optimizer.algorithm;

public class Constants {
    /*
     * Identifiers
     */
    
     /**
     * The ID code that indicates a certain schedule element is a lecture
     */
    public final static String LECTURE = "00";
    /**
     * The ID code that indicates a certain schedule element is a time block
     */
    public final static String BLOCK = "01";
    /**
     * The ID code that indicates a certain schedule element is a recitation
     */
    public final static String RECITATION = "10";

    /**
     * The number of bits required to represent all of the prefixes that are possible
     */
    public final static int NUM_BLOCK_BITS = 2;

    /**
     * The penalty associated with a null element
     */
    public static final int nullPenalty = 10000;

    /**
     * The penalty associated with a time conflict between schedule elements
     */
    public static final int timeConflictPenalty = 1000;

    /**
     * The penalty associated with a name conflict between schedule elements
     */
    public static final int nameConflictPenalty = 100;


    /**
     * The penalty associated with a not fulfilling a schedule requirement
     */
    public static final int unfulfilledRequirementPenalty = 10;

}
