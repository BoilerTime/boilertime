const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const iso = require('iso8601-duration');
const moment = require('moment')
const db = getFirestore()
const courses = db.collection('classes').doc("spring_2023");


const optimizeSchedule = async function(java, schedule) {
    let optimizecourses = [];

    let requiredLength = schedule.required_classes.length;
    let optionalLength = schedule.optional_classes.length;

    for(let i = 0; i < Math.min(requiredLength+optionalLength, 5); i++) {
        if(i >= requiredLength) {
            optimizecourses.push(schedule.optional_classes[i % optionalLength]);
        } else {
            optimizecourses.push(schedule.required_classes[i]);
        }
    }
    console.log(optimizecourses);
    const format = "name [times] [durations]"
    var output = [];

    let resultFormat = {"name": "", "startTimes": [], "durations": []};
    
    for(let i = 0; i < optimizecourses.length; i++) {
        console.log(optimizecourses[i].split(" ")[0] + " + " + optimizecourses[i].split(" ")[1]);
        let results = [];
        await courses.collection(optimizecourses[i].split(" ")[0]).doc(optimizecourses[i].split(" ")[1]).listCollections().then((querySnapshot) => {
            querySnapshot.forEach((collection) => {
                results.push(collection.where("type", "==", "Lecture").get());
                //console.log(await collection.where("type", "==", "Lecture").get());
                });
            });
        output.push(JSON.parse(JSON.stringify(resultFormat)))
        output[i].name = optimizecourses[i].split(" ")[0] + "" + optimizecourses[i].split(" ")[1];
        for(let j = 0; j < results.length; j++) {
            results[j] = await results[j];
            
            results[j].forEach(async doc => {
                //console.log("Called!")
                var data = doc.data();
                let rawDur = doc.data().durations
                console.log(doc.data().starttime)
                console.log(moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
                let date = new Date(doc.data().starttime);
                console.log(date.getUTCHours()+ "" + date.getUTCMinutes())
                //console.log(moment.duration(doc.data().durations).minutes())
                //await doc.ref.delete()
                output[i].startTimes.push(date.getUTCHours()+ "" + date.getUTCMinutes());
                output[i].durations.push(moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
              })
        }
        console.log(output)

    }
    var options = [];
    for(let i = 0; i < output.length; i++) {
        //Get the time in the proper order
        let timeString = "["
        for(let j  = 0; j < output[i].startTimes.length; j++){
            timeString+=output[i].startTimes[j] + ",";
        }
        timeString = timeString.substring(0, timeString.length-1);//knock the trailing , off
        timeString+="]"
        //Get the durations in the proper order 
        let durationString = "["
        for(let j  = 0; j < output[i].durations.length; j++){
            durationString+=output[i].durations[j] + ",";
        }
        durationString = durationString.substring(0, durationString.length-1);//knock the trailing , off
        durationString+="]"

        let result = format;
        result = result.replace("name", output[i].name);
        result = result.replace("[times]", timeString);
        result = result.replace("[durations]", durationString);
        options.push(result);
        
    }
    console.log(options);
    //const { status, stdout, stderr } = await java.run(['CS180 [1500] [50,50,50]', 'CS182 [1500,1600] [50,50,50]']);
    const { status, stdout, stderr } = await java.run(options);

    console.log(`The status code returned by java command is ${status}`);
    if (stdout) {
        console.log('stdout of the java command is :\n' + stdout);
    }
    if (stderr) {
        throw new Error(500);
    }

    console.log("Now we can get back on the rest of our custom module code :)")
}

module.exports = {optimizeSchedule};