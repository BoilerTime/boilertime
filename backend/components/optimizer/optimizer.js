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
let badList = new Map();
let hitTable = new Map();

//client.send("request open");
async function optimizeSchedule(schedule) {
    console.log(schedule + ' this is the schedule');
    let optimizecourses = [];
    
    let requiredLength = schedule.required_classes.length;
    let optionalLength = schedule.optional_classes.length;

    for(let i = 0; i < requiredLength+optionalLength; i++) {
        if(i >= requiredLength) {
            optimizecourses.push(schedule.optional_classes[i % optionalLength]);
        } else {
            optimizecourses.push(schedule.required_classes[i]);
        }
    }

    console.log(optimizecourses)
    var output = await getCollections(optimizecourses, requiredLength);
    console.log(output)
    //console.log(output[0].collections.length)
    for(let i = 0; i < output.length; i++) {
      console.log("UWU")
      let length = output[i].collections.length;
      for(let j = 0; j < length; j++) {
        let primaryInfoDB = await courses.collection(optimizecourses[i].split(" ")[0]).doc(optimizecourses[i].split(" ")[1]).collection(output[i].collections[j]).where("type", "in", ["Lecture", "Distance Learning"]).get();
            let sectionFormat = {
              "primary": {
                "startTime": "",
                "duration": "",
                "daysOfWeek": "",
                "rating": 0,
                "ID": "",
                "isFull": false,
                "type": "",
                "professor": ""
              },
              "secondary": []
            }
            primaryInfoDB.forEach(async doc => {
              
              let data = doc.data();
              let rawDur = data.durations
              let date = new Date(data.starttime);
              sectionFormat.primary.startTime = (date.getUTCHours()+ "" + date.getUTCMinutes());
              sectionFormat.primary.duration = (moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
              sectionFormat.primary.daysOfWeek = data.daysOfWeek;
              sectionFormat.primary.ID = (doc.id);
              sectionFormat.primary.type = data.type
              sectionFormat.primary.professor = data.instructor.Name
              
            })
            let secondaryInfoInDB = await courses.collection(optimizecourses[i].split(" ")[0]).doc(optimizecourses[i].split(" ")[1]).collection(output[i].collections[j]).where("type", "not-in", ["Lecture", "Distance Learning"]).get();
            secondaryInfoInDB.forEach(async doc => {
              let secondaryFormat = {
                "startTime": "",
                "duration": "",
                "daysOfWeek": "",
                "ID": "",
                "isFull": false,
                "type": "",
                
              }
              let data = doc.data();
              let rawDur = data.durations
              let date = new Date(data.starttime);
              secondaryFormat.startTime = (date.getUTCHours()+ "" + date.getUTCMinutes());
              secondaryFormat.duration = (moment.duration(rawDur).hours()*60 + moment.duration(rawDur).minutes());
              secondaryFormat.daysOfWeek = data.daysOfWeek;
              secondaryFormat.ID = (doc.id);
              secondaryFormat.type = data.type
              secondaryFormat.doubleParent = collection.id
              sectionFormat.secondary.push(secondaryFormat);
              
            })
            output[i].sections.push(sectionFormat);
      }
    }
    //console.log(output)
    //output = await getIsFull(output);
    output = await getRating(output)
    console.log(output)
    //console.log(JSON.stringify(output));
    return output;
}

async function getCollections(optimizecourses, requiredLength) {
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
          currentCourse.collections.push(collection.id);
        });
    })
  }
  return output;
}

async function getIsFull(data) {
  
  for(let i = 0; i < data.length; i++) {
    console.log("TWT")
    console.log(data[i].sections)
    for(let j = 0; j < data[i]?.sections?.length || 0; j++) {
      console.log(data[i].sections[j].primary.sectionID)
      data[i].sections[j].primary.isFull[0] = await purdueio.isFull(data[i].name.split(' ')[0], data[i].name.split(' ')[1], new Array().push(data[i].sections[j].primary.sectionID));
    }
  }
  return data;
}


async function getRating(output) {
  
  for(let i = 0; i < output.length; i++) {
    for(let j  = 0; j < output[i].sections.length; j++) {
      if(badList.has(output[i].sections[j].primary.professor)) {
        output[i].sections[j].primary.rating = 2.5;
        continue;
      }
      if(hitTable.has(output[i].sections[j].primary.professor)) {
        output[i].sections[j].primary.rating = hitTable.get(output[i].sections[j].primary.professor);
        console.log(output[i].sections[j].primary.rating);
        continue;
      }
      await utils.getProfessorRating(output[i].sections[j].primary.professor).then((data) => {
        output[i].sections[j].primary.rating = data.avgRating;
        hitTable.set(output[i].sections[j].primary.professor, data.avgRating);
      }).catch((e) => {
        output[i].sections[j].primary.rating = 2.5;
        console.log(e)
        console.log(output[i].sections[j].primary.professor)
        badList.set(output[i].sections[j].primary.professor, '1');
      })
    }
  }
  return output
}

module.exports = {
  optimizeSchedule
};

