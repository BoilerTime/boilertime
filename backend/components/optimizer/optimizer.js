const { JavaCaller } = require("java-caller");
const fs = require('fs');
const java = new JavaCaller({
    jar: "btime.jar"
});

const optimizeSchedule = async function() {
    console.log(__dirname);
    console.log(fs.readFileSync("btime.jar"));
    console.log('Welcome to Java Caller example\n');
    console.log(`Let's use java-caller as a module !`);

    const { status, stdout, stderr } = await java.run(['-a', 'list', '--of', 'arguments']);

    console.log(`The status code returned by java command is ${status}`);
    if (stdout) {
        console.log('stdout of the java command is :\n' + stdout);
    }
    if (stderr) {
        console.log('stderr of the java command is :\n' + stderr);
    }

    console.log("Now we can get back on the rest of our custom module code :)")
}

module.exports = {optimizeSchedule};