package optimizer.algorithm;

public class CourseOverviewHelper {
    private String courseName;
    private boolean required;
    //Course Time
    private int[] courseTimes;
    private int courseTimesPtr;
    //Course Duration
    private int[] courseDurations;
    private int courseDurationsPtr;
    //Days of week
    private WeekDays[][] weekDays;
    private int weekDaysPtr;
    //Ratings
    private double[] ratings;
    private int ratingsPtr;

    /**
     * Constructor to create a wrapper class that assists in instantaiting a CourseOverview method.
     */
    public CourseOverviewHelper() {
        //Indicate that both of the course stacks cannot be used yet
        this.courseTimesPtr = -1;
        this.courseDurationsPtr = -1;
        this.weekDaysPtr = -1;
        this.ratingsPtr = -1;
        courseName = null;
    }

    /**
     * Adds a name attribute to the helper class
     * @param name The name to be added
     */
    public void addCourseName(String name) {
        this.courseName = name;
    }

    /**
     * Adds a flag of whether or not the course is required
     * @param r A boolean true if the course is required, otherwise false. 
     */
    public void setRequired(boolean r) {
        this.required = r;
    }


    /**
     * A method that pushes a new time to the list of times for a specific class
     * @param time The time that is to be added
     */
    public int addCourseTime(int time) {
        if(this.courseTimesPtr < 0) {
            return -1;
        }
        this.courseTimes[this.courseTimesPtr++] = time;
        return 1; 
    }

    /**
     * A method that pushes a new time to the list of times for a specific class
     * @param duration The time that is to be added
     */
    public int addDuration(int duration) {
        if(this.courseDurationsPtr < 0) {
            return -1;
        }
        this.courseDurations[this.courseDurationsPtr++] = duration;
        return 1; 
    }

    public CourseOverview toCourseOverview() {
        if(courseTimesPtr < 0 || courseDurationsPtr < 0) {
            return null;
        }

        if(courseTimesPtr != courseTimes.length || courseDurationsPtr != courseDurations.length) {
            return null;
        }

        if(courseName == null) {
            return null;
        }

        if(weekDaysPtr < 0) {
            return null;
        }

        if(this.ratingsPtr < 0 || this.ratings.length != this.ratingsPtr) {
            return null; 
        }
        return new CourseOverview(courseName, courseTimes, courseDurations, weekDays, required, ratings);
    }

    public int addWeekDays(String days) {
        if(this.weekDaysPtr == -1) {
            return -1; 
        }
        String[] aDays = days.split(",");
        weekDays[weekDaysPtr] = new WeekDays[aDays.length];
        for(int i = 0; i < aDays.length; i++) {
            WeekDays temp;
            switch(aDays[i]) {
                case "Monday":
                    temp = (WeekDays.monday);
                    break;
                case "Tuesday":
                    temp = WeekDays.tuesday;
                    break;
                case "Wednesday":
                    temp = WeekDays.wednesday;
                    break;
                case "Thursday":
                    temp = WeekDays.thursday;
                    break;
                case "Friday":
                    temp = WeekDays.friday;
                    break;
                case "Saturday":
                    temp = WeekDays.saturday;
                    break;
                case "Sunday":
                    temp = WeekDays.sunday;
                    break;
                default: 
                    temp = WeekDays.monday;
                    break;
            }
            weekDays[weekDaysPtr][i] = temp;
        }
        this.weekDaysPtr++;
        return 1;
    }


    /**
     * A helper method that is required in order to start adding sections so that it is knowable how many total sections there are
     * @param length The number of sections to be allocated. 
     */
    public void instantiateHelper(int length) {
        //Course times
        this.courseTimes = new int[length];
        this.courseTimesPtr = 0;
        //Course Durations
        this.courseDurations = new int[length];
        this.courseDurationsPtr = 0;
        //Week Days
        this.weekDays = new WeekDays[length][];
        this.weekDaysPtr = 0;
        //Ratings
        this.ratings = new double[length];
        this.ratingsPtr = 0;
    }

    public double addRating(double r) {
        if(this.ratingsPtr < 0) {
            return -1.0f;
        }
        this.ratings[ratingsPtr++] = r;
        return r;  
    }

}
