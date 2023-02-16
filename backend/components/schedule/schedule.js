require('dotenv').config({path: '../.env'});
require('../../firebase')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const schedules = db.collection('user_schedules')

module.exports = {
    authenticate
}

async function authenticate({ user_id, optional_classes, personal_preferences, required_classes }) {
    const schedule = await users.where('user_id', '==', user_id).get();
    profile.forEach(doc => {
      const optional_classes = doc.collection(optional_classes);
      const required_classes = doc.collection(required_classes);
      const preferences = doc.collection(preferences);
    });
}
