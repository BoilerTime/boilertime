require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const schedules = db.collection('user_schedules')

module.exports = {
  addClasses
}

/** 
  * Adds the given classes and preferences to the databases given the email
  * @param {JSON} user - The json containing the user_id, required_classes, optional_classes and personal_preferences
**/
async function addClasses(user) {
  const input = {
    "required_classes": user.required_classes,
    "optional_classes": user.optional_classes,
    "personal_preferences": user?.personal_preferences||"",
    "timestamp": FieldValue.serverTimestamp()
  };
  await db.collection('user_schedules').doc(user.user_id).collection('spring_2023').doc('schedule').set(input).then((res) => {
    console.log("Saved")
  }).catch((err) =>{
    console.error(err);
    throw new Error(500);
  })

}
