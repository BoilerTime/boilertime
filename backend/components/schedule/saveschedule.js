require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const schedules = db.collection('user_schedules');


//Schedule is a JSON array that contains the subject, number, and section ID for each class that is to be saved. 
/* 
    [
        {
            "subject": "CS"
            "number": "18000",
            "userSections": [123123890, 1091274134] //The section ID for each of the sectinons the student is enrolled in 
        }
    ]
*/
const saveSchedule = async function(user, schedule) {
    let userProfile = await schedules.doc(user).collection("spring_2023").doc('generated_schedule');
    userProfile.set({"schedule": schedule}); //Update the db with the array that is passed to the method


}

module.exports = {saveSchedule};