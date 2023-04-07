require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const schedules = db.collection('user_schedules')

module.exports = {
  addClasses,
  getClasses,
  classCounter,
  hotClasses,
  takenTogether
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
    "time": user.time,
    "rmp": user.rmp,
    "timestamp": FieldValue.serverTimestamp()
  };
  await db.collection('user_schedules').doc(user.user_id).collection('spring_2023').doc('schedule').set(input).then((res) => {
    console.log("Saved")
  }).catch((err) =>{
    console.error(err);
    throw new Error(500);
  })
}

/**
  * Adds the given classes and preferences to the databases given the email
  * @param {string} user_id - the user_id of the user
**/
async function getClasses(user_id) {
  const classes = await db.collection('user_schedules').doc(user_id).collection('spring_2023').doc('schedule').get().catch((err) => { 
    console.error(err);
    throw new Error(500);
  });
  const doc = classes.data();
  if (doc == undefined) {
    throw new Error(500);
  } else {
    return doc;
  }
}

async function hotClasses() {
  const hotClasses = []
  const hot = await db.collection('counter').orderBy('count', 'desc').limit(5).get().then((res) => {
    res.forEach((doc) => {
      hotClasses.push(doc.id);
    })
  }).catch((err) => {
    console.error(err);
    throw new Error(500);
  });
  return hotClasses;
}

async function takenTogether(course) {
  const takenTogether = []
  const together = await db.collection('counter').doc(course).orderBy('count', 'desc').limit(5).get().then((res) => {
    res.forEach((doc) => {
      takenTogether.push(doc.id);
    })
  }).catch((err) => {
    console.error(err);
    throw new Error(500);
  });
  return takenTogether;
}

async function classCounter(classes) {
  const counter = db.collection('counter');
  for (var i = 0; i < classes.length; i++) {
    for (var j = 0; j < classes.length; j++) {
      if (i != j) {
        const class1 = classes[i];
        const class2 = classes[j];
        const doc = await counter.doc(class1).collection(class2).get().catch((err) => {
          console.error(err);
          throw new Error(500);
        });
        if (doc.empty) {
          await counter.doc(class1).collection(class2).doc('count').set({ "count": 1 }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        } else {
          await counter.doc(class1).collection(class2).doc('count').update({ "count": FieldValue.increment(1) }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        }
      } else {
        const class1 = classes[i];
        const doc = await counter.doc(class1).get().catch((err) => {
          console.error(err);
          throw new Error(500);
        });
        if (!doc.exists) {
          await counter.doc(class1).set({ "count": 1 }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        } else {
          await counter.doc(class1).update({ "count": FieldValue.increment(1) }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        }
      }
    }
  }
}