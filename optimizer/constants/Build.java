package optimizer.constants;

import java.io.File;
import java.util.Scanner;

public final class Build {
    public static String getBuildTime() {
        try {
            File f = new File("build_info.txt");
            Scanner s = new Scanner(f);
            return s.nextLine();
        } catch (Exception e) {
            return "Not Found";
        }
    }
}
