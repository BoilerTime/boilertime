const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const iso = require('iso8601-duration');
const utils = require('../utils/utils')
const save = require('../schedule/saveschedule');
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
    
    const format = "name [times] [durations]"
    var output = [];

    let resultFormat = {"name": "", "startTimes": [], "durations": [], "isMWF": false, "sectionIDs": [], "collectionIDs": []};
    
    for(let i = 0; i < optimizecourses.length; i++) {
        //console.log(optimizecourses[i].split(" ")[0] + " + " + optimizecourses[i].split(" ")[1]);
        let results = [];
        let collectionResults = [];
        await courses.collection(optimizecourses[i].split(" ")[0]).doc(optimizecourses[i].split(" ")[1]).listCollections().then((querySnapshot) => {
            querySnapshot.forEach((collection) => {
                results.push(collection.where("type", "==", "Lecture").get());
                collectionResults.push(collection.id);
                //console.log(await collection.where("type", "==", "Lecture").get());
                });
            });
        output.push(JSON.parse(JSON.stringify(resultFormat)))
        output[i].name = optimizecourses[i].split(" ")[0] + "|" + optimizecourses[i].split(" ")[1];
        output[i].collectionIDs = collectionResults;
        for(let j = 0; j < results.length; j++) {
            results[j] = await results[j];
            
            results[j].forEach(async doc => {
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

    //Run the MWF routine
    var mwfResults;
    var tfResults;

    if(mwfOptions.length > 0) {
        const mwfR = await java.run(mwfOptions);
        if (mwfR.stdout) {
            //console.log('stdout of the java command is :\n' + stdout);
            mwfResults = JSON.parse(mwfR.stdout);
        } else {
            throw new Error(500);
        }

    }   

    if(tfOptions.length > 0) {
        //Run the TF routine
        const trF = await java.run(tfOptions);
        if (trF.stdout) {
            //console.log('stdout of the java command is :\n' + stdout);
            tfResults = JSON.parse(trF.stdout);
        } else {
            throw new Error(500);
        }
    }
    
    let dbFormat = {"subject": "", "number": "", "userSections": {"meetings": [], "sectionID": ""}};
    let dbOut = {"schedule": []};
    for(let i = 0; i < mwfResults?.data?.length||0; i++) {
        let entry = mwfResults.data[i];
        let tempOut = JSON.parse(JSON.stringify(dbFormat))
        let dept = entry.courseID.split("|")[0];
        let num = entry.courseID.split("|")[1];
        tempOut.subject = dept;
        tempOut.number = num;
        //Now find the right place in the course array
        var j = 0;
        for(j = 0; j < output.length; j++) {
            if(output[j].name == entry.courseID) {
                //console.log(output[j]);
                tempOut.userSections.meetings.push(output[j].sectionIDs[utils.findKeyForUnsorted(output[j].startTimes, entry.courseStartTime)]);
                tempOut.userSections.sectionID = output[j].collectionIDs[utils.findKeyForUnsorted(output[j].startTimes, entry.courseStartTime)]
            }
        }
        //console.log(dbOut.userSections);
        dbOut.schedule.push(tempOut);
    }

    for(let i = 0; i < tfResults?.data?.length||0; i++) {
        let entry = tfResults.data[i];
        let tempOut = JSON.parse(JSON.stringify(dbFormat))
        let dept = entry.courseID.split("|")[0];
        let num = entry.courseID.split("|")[1];
        tempOut.subject = dept;
        tempOut.number = num;
        //Now find the right place in the course array
        var j = 0;
        for(j = 0; j < output.length; j++) {
            if(output[j].name == entry.courseID) {

                tempOut.userSections.meetings.push(output[j].sectionIDs[utils.findKeyForUnsorted(output[j].startTimes, entry.courseStartTime)]);
                tempOut.userSections.sectionID = output[j].collectionIDs[utils.findKeyForUnsorted(output[j].startTimes, entry.courseStartTime)]
            }
        }
        //console.log(dbOut);
        dbOut.schedule.push(tempOut);
    }
    await save.saveSchedule(schedule.user_id, dbOut);
}

module.exports = {optimizeSchedule};