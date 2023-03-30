require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const schedules = db.collection('user_schedules')
const classes = db.collection('classes')

/**
 * This function gets the complete optimized schedule for a user whose user ID is given. 
 * @param {String} user The ID of the user whose schedule is to be found
 * @returns {JSON} A JSON response that contains all the sections that the user is in as well as information about the associated classes
 */
const getSchedule = async function(user) {
    //First, get the document that matches the user id. Hardcoding Spring 2023 for now
    //console.log(user)
    let userProfile = await schedules.doc(user).collection('spring_2023').doc('generated_schedule').get();

    
    let userSchedule = await userProfile.data();
    //console.log(userSchedule)
    let response = {"schedule": []};
    //let classDetails = {};
    //Now, we must loop through the schedule that is stored and get the information that corresponds with each ID
    for(let i=0; i<userSchedule.schedule.length; i++) {
        //console.log(userSchedule.schedule[i])
        //Get the information about the class and each section the user is in
        let currentClass = await classes.doc("spring_2023").collection(userSchedule.schedule[i].subject).doc(userSchedule.schedule[i].number).get();
        currentClass = await currentClass.data();
        let classInformation = {
            "subject": userSchedule.schedule[i].subject,
            "number": userSchedule.schedule[i].number,
            "creditHours": currentClass.credits,
            "description": currentClass.description,
            "name": currentClass.name,
            "meetings": []
        }
        let sections = await classes.doc("spring_2023").collection(userSchedule.schedule[i].subject).doc(userSchedule.schedule[i].number).collection(userSchedule.schedule[i].userSections.sectionID);
        
        for(let j = 0; j<userSchedule.schedule[i].userSections.meetings.length; j++) {
            let classInSection = await sections.doc(userSchedule.schedule[i].userSections.meetings[0]).get();
            //console.log(userSchedule.schedule[i].userSections.meetings[0]);
            classInSection = await classInSection.data();
            //console.log(classInSection)
            let sectionInformation = {
                "instructorName": classInSection.instructor.Name,
                "startTime": classInSection.starttime,
                "duration": utils.padTime(classInSection.durations),
                "daysOfWeek": classInSection.daysOfWeek.split(', '),
                "type": classInSection.type,
                "buildingCode": classInSection.room.Building.ShortCode,
                "buildingName": classInSection.room.Building.Name,
                "roomNumber": classInSection.room.Number
            }
            classInformation.meetings.push(sectionInformation);
        }
        //console.log(await sections.data());
        //console.log(await classInSection.data());
        response.schedule.push(classInformation);
    }
    return response;
}

/*
 * This function gets all user schedules
 * @param {string} user_id - the user_id of the user
 * @returns {JSON} json of schedules
 */
async function getAllUserSchedules(user_id) {
  const userSchedules = await schedules.doc(user_id);
  var jArray = [];
  var numSchedules = 0;
  const collections = await userSchedules.listCollections();

  for (var i = 0; i < collections.length; i++) {
    doc = await userSchedules.collection(collections[i].id).doc("schedule").get();
    doc = await doc.data();
    const jsonObj = {
      "term_id": collections[i].id,
      "optional_classes": await doc.optional_classes,
      "required_classes": await doc.required_classes,
      "personal_preferences": await doc.personal_preferences
    }
    jArray[collections[i].id] = (jsonObj);
    numSchedules++;
  }
  return { "num_schedules": numSchedules, ...jArray };
}

module.exports = {
  getSchedule,
  getAllUserSchedules
}
