const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const iso = require('iso8601-duration');
const utils = require('../utils/utils')
const save = require('../schedule/saveschedule');
//const schedule = require('../schedule/schedule');
const scheduleSections = require('../schedule/schedule');
const moment = require('moment')
const db = getFirestore()
const courses = db.collection('classes').doc("spring_2023");
const purdueio = require('../datasources/purdueios');


//client.send("request open");
async function optimizeSchedule(schedule) {
    console.log(schedule + ' this is the schedule');
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
    const courseFormat = {
        "name": "", 
        "isRequired": false,
        "sections": [],
        "collections": []
    };


    
    for(let i = 0; i < optimizecourses.length; i++) {
      output.push(JSON.parse(JSON.stringify(courseFormat)));
      //Make it easier to read stuff for now.
      let currentCourse = output[i];
      currentCourse.name = optimizecourses[i];
      currentCourse.isRequired = i < requiredLength;
      
      await courses.collection(optimizecourses[i].split(" ")[0]).doc(optimizecourses[i].split(" ")[1]).listCollections().then((querySnapshot) => {
          querySnapshot.forEach(async (collection) => {
            let primaryInfoDB = await collection.where("type", "in", ["Lecture", "Distance Learning"]).get();
            currentCourse.collections.push(collection.id);
            primaryInfoDB.forEach(async doc => {
              let data = doc.data();
              let sectionFormat = {
                "primary": {
                  "startTime": "",
                  "duration": "",
                  "daysOfWeek": "",
                  "rating": 0,
                  "ID": "",
                  "isFull": false,
                  "type": ""
                },
                "secondary": []
              }
              let rawDur = data.durations
              let date = new Date(data.starttime);
              sectionFormat.primary.startTime = (date.getUTCHours()+ "" + date.getUTCMinutes());
              sectionFormat.primary.duration = (moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
              sectionFormat.primary.daysOfWeek = data.daysOfWeek;
              sectionFormat.primary.ID = (doc.id);
              sectionFormat.primary.type = data.type
              currentCourse.sections.push(sectionFormat);
              
            })
            
            let secondaryInfoDB = await collection.where("type", "not-in", ["Lecture", "Distance Learning"]).get();
            secondaryInfoDB.forEach(async doc => {
              let data = doc.data();
              const secondaryFormat = {
                "startTime": "",
                "duration": "",
                "daysOfWeek": "",
                "rating": 0,
                "ID": "",
                "isFull": false,
                "type": ""
              }
              let rawDur = data.durations
              let date = new Date(data.starttime);
              sectionFormat.primary.startTime = (date.getUTCHours()+ "" + date.getUTCMinutes());
              sectionFormat.primary.duration = (moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
              sectionFormat.primary.daysOfWeek = data.daysOfWeek;
              sectionFormat.primary.ID = (doc.id);
              sectionFormat.primary.type = data.type
              currentCourse.sections.push(sectionFormat);
              
            })

          });
      })
    }
    console.log(output)
    return output;
}

module.exports = {
  optimizeSchedule
};

