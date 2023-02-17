require('dotenv').config({path: '../.env'});
require('../../firebase')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const schedules = db.collection('user_schedules')

module.exports = {
    addClasses
}

async function addClasses({ user_id, optional_classes, personal_preferences, required_classes }) {
    const schedule = await users.where('user_id', '==', user_id).get();
    profile.forEach(doc => {
       doc.collection('sprint_2023').add({
          required_classes: required_classes,
          optional_classes: optional_classes,
          personal_preferences: personal_preferences
      });
    });
}
