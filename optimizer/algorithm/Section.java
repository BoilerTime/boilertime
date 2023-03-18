package optimizer.algorithm;

public class Section {
    private final Course parentCourse;
    private final int time;
    private final int duration;
    private final String ID;

    public Section(Course p, int t, int d, String id) {
        this.parentCourse = p;
        this.time = t;
        this.duration = d;
        this.ID = id;
    }

    public Course getParent() {
        return this.parentCourse;
    }

    public int getTime() {
        return this.time;
    }

    public int getDuration() {
        return this.duration;
    }

    public String getID() {
        return this.ID;
    }
}
