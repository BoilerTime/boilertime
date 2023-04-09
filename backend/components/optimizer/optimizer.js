const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const iso = require('iso8601-duration');
const utils = require('../utils/utils')
const save = require('../schedule/saveschedule');
const moment = require('moment')
const db = getFirestore()
const courses = db.collection('classes').doc("spring_2023");
const purdueio = require('../datasources/purdueios');


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
    let resultFormat = {
        "name": "", 
        "isRequired": false,
        "startTimes": [], 
        "durations": [], 
        "daysOfWeek": [], 
        "sectionIDs": [], 
        "collectionIDs": [], 
        "rmp": []
    };
    
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
        output[i].isRequired = i < requiredLength;//optimizecourses[i].isRequired//schedule[i].isRequired
        output[i].collectionIDs = collectionResults;
        for(let j = 0; j < results.length; j++) {
            results[j] = await results[j];
            
            results[j].forEach(async doc => {
                let rawDur = doc.data().durations
                let date = new Date(doc.data().starttime);
                output[i].startTimes.push(date.getUTCHours()+ "" + date.getUTCMinutes());
                output[i].durations.push(moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
                output[i].daysOfWeek.push(doc.data().daysOfWeek);
                output[i].sectionIDs.push(doc.id);
                
                let name = doc.data().instructor.Name
                ///console.log(await utils.getProfessorRating(name));
                output[i].rmp.push((utils.getProfRatingsNoError(name)))
              })
        }
    }

    //await Promise.all(output).then((data) => {console.log(data)})
    
    for(let i = 0; i < output.length; i++) {
        for(let j = 0; j < output[i].rmp.length; j++) {
            let prom = output[i].rmp[j];
            await prom.then((value) => {
                output[i].rmp[j] = value.avgRating;
            }).catch((error) => {
                console.log(error);
                output[i].rmp[j] = 0.0;
            })
        }
    }

  for (let i = 0; i < output.length; i++) {
    isFull = await purdueio.isFull(output[i].name.split(' ')[0], output[i].name.split(' ')[1], output[i].sectionIDs);
    console.log(isFull);
    output[i].isFull = isFull;
  }
    console.log(output)
    return output;
}

module.exports = {optimizeSchedule};

