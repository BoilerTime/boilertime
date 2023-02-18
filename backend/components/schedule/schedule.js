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
  * @param {JSON} user - The json containing the email and classes
**/
async function addClasses(user) {
  const email = user.email;
  const user_id = utils.getUID({email});
  const schedule = await schedules.where('user_id', '==', user_id).get();
  schedule.forEach(doc => {
    doc.collection('sprint_2023').add({
      required_classes: user.required_classes,
      optional_classes: user.optional_classes,
      personal_preferences: user.personal_preferences
    });
  });
}
