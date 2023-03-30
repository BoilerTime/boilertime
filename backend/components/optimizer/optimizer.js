const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const iso = require('iso8601-duration');
const utils = require('../utils/utils')
const save = require('../schedule/saveschedule');
const moment = require('moment')
const db = getFirestore()
const courses = db.collection('classes').doc("spring_2023");


//client.send("request open");
const optimizeSchedule = async function(schedule) {
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
        output[i].name = optimizecourses[i];
        output[i].collectionIDs = collectionResults;
        for(let j = 0; j < results.length; j++) {
            results[j] = await results[j];
            
            results[j].forEach(async doc => {
                let rawDur = doc.data().durations
                let date = new Date(doc.data().starttime);
                output[i].startTimes.push(date.getUTCHours()+ "" + date.getUTCMinutes());
                output[i].durations.push(moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
                output[i].sectionIDs.push(doc.id);
              })
        }
    }
    console.log(output)
    return output;
}

module.exports = {optimizeSchedule};

