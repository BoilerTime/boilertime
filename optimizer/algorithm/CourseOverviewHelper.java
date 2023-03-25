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

    /**
     * Constructor to create a wrapper class that assists in instantaiting a CourseOverview method.
     */
    public CourseOverviewHelper() {
        //Indicate that both of the course stacks cannot be used yet
        this.courseTimesPtr = -1;
        this.courseDurationsPtr = -1;
        this.weekDaysPtr = -1;
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
     * Helper method that creates a new array to hold 
     * @param length The number of courses that will be added
     */
    public void instantiateTimes(int length) {
        this.courseTimes = new int[length];
        this.courseTimesPtr = 0;
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
     * Helper method that creates a new array to hold 
     * @param length The number of courses that will be added
     */
    public void instantiateDurations(int length) {
        this.courseDurations = new int[length];
        this.courseDurationsPtr = 0;
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

        return new CourseOverview(courseName, courseTimes, courseDurations, weekDays, required);
    }

    /**
     * A helper method that allows the 
     * @param length
     */
    public void instantiateWeekDays(int length) {
        this.weekDays = new WeekDays[length][];
        this.weekDaysPtr = 0;
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


}
