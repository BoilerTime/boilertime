const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const iso = require('iso8601-duration');
const utils = require('../utils/utils')
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

    let resultFormat = {"name": "", "startTimes": [], "durations": [], "isMWF": false, "sectionIDs": [], "collectionIDs": []};
    
    for(let i = 0; i < optimizecourses.length; i++) {
        console.log(optimizecourses[i].split(" ")[0] + " + " + optimizecourses[i].split(" ")[1]);
        let results = [];
        let collectionResults = [];
        await courses.collection(optimizecourses[i].split(" ")[0]).doc(optimizecourses[i].split(" ")[1]).listCollections().then((querySnapshot) => {
            querySnapshot.forEach((collection) => {
                console.log("CD" + collection.id)
                results.push(collection.where("type", "==", "Lecture").get());
                collectionResults.push(collection.id);
                //console.log(await collection.where("type", "==", "Lecture").get());
                });
            });
        output.push(JSON.parse(JSON.stringify(resultFormat)))
        output[i].name = optimizecourses[i].split(" ")[0] + "" + optimizecourses[i].split(" ")[1];
        output[i].collectionIDs = collectionResults;
        for(let j = 0; j < results.length; j++) {
            results[j] = await results[j];
            
            results[j].forEach(async doc => {
                console.log(doc.id);
                let rawDur = doc.data().durations
                let date = new Date(doc.data().starttime);
                output[i].startTimes.push(date.getUTCHours()+ "" + date.getUTCMinutes());
                output[i].durations.push(moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
                output[i].sectionIDs.push(doc.id);
                //output[i].collectionIDs.push(collectionResults[i]);
                if(doc.data().daysOfWeek.split(",")[0] == "Monday") {
                    output[i].isMWF = true;
                }
              })
        }
        console.log(output)

    }
    var mwfOptions = [];
    var tfOptions = [];
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
        if(output[i].isMWF) {
            mwfOptions.push(result);
        } else {
            tfOptions.push(result);
        }
        
    }

    console.log(mwfOptions)
    console.log(tfOptions);
    //Run the MWF routine
    var mwfResults;
    var tfResults;

    if(mwfOptions.length > 0) {
        const mwfR = await java.run(mwfOptions);
        if (mwfR.stdout) {
            //console.log('stdout of the java command is :\n' + stdout);
            mwfResults = mwfR.stdout;
        } else {
            throw new Error(500);
        }
        console.log(mwfResults)
    }   

    if(tfOptions.length > 0) {
        //Run the TF routine
        const trF = await java.run(tfOptions);

        
        if (trF.stdout) {
            //console.log('stdout of the java command is :\n' + stdout);
            tfResults = trF.stdout;
        } else {
            throw new Error(500);
        }
    }
    console.log(JSON.parse(mwfResults).data[0]);
    console.log(JSON.parse(tfResults).data);


}

module.exports = {optimizeSchedule};