require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const schedules = db.collection('user_schedules')
const classes = db.collection('classes')

const getSchedule = async function(user) {
    //First, get the document that matches the user id. Hardcoding Spring 2023 for now
    console.log(user)
    let userProfile = await schedules.doc(user).collection('spring_2023').doc('generated_schedule').get();

    
    let userSchedule = await userProfile.data();
    console.log(userSchedule)
    let response = {"schedule": []};
    //Now, we must loop through the schedule that is stored and get the information that corresponds with each ID
    for(let i=0; i<userSchedule.schedule.length; i++) {
        //console.log(userSchedule.schedule[i])
        //Get the information about the class and each section the user is in
        let currentClass = await classes.doc("spring_2023").collection(userSchedule.schedule[i].subject).doc(userSchedule.schedule[i].number);
        //console.log(await currentClass.data());
        console.log(userSchedule.schedule[i].userSection)
        let sections = await classes.doc("spring_2023").collection(userSchedule.schedule[i].subject).doc(userSchedule.schedule[i].number).collection(userSchedule.schedule[i].userSection.sectionID);
        //console.log(await sections.data());
        let classInSection = await sections.doc(userSchedule.schedule[i].userSection.meetings[0]).get();
        console.log(await classInSection.data());
    }

}

module.exports = {getSchedule}