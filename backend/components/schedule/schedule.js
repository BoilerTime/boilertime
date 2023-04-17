require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');
const {getSchedule} = require('./getschedule');

const db = getFirestore();
const schedules = db.collection('user_schedules');

module.exports = {
  addClasses,
  addClassesGuest,
  getClasses,
  classCounterIncrement,
  classCounterDecrement,
  hotClasses,
  takenTogether,
  getGeneratedSchedule,
  getClassMates
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
    "blocked_times": user.blocked_times,
    "timestamp": FieldValue.serverTimestamp()
  };
  await db.collection('user_schedules').doc(user.user_id).collection('spring_2023').doc('schedule').set(input).then((res) => {
    console.log("Saved")
  }).catch((err) =>{
    console.error(err);
    throw new Error(500);
  })
}

async function addClassesGuest(guest) {
  const input = {
    "required_classes": guest.required_classes,
    "optional_classes": guest.optional_classes,
    "personal_preferences": guest?.personal_preferences||"",
    "time": guest.time,
    "rmp": guest.rmp,
    "blocked_times": guest.blocked_times,
    "timestamp": FieldValue.serverTimestamp()
  };
  return input;
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
  const together = await db.collection('counter').doc(course).collection('pairs').orderBy('count', 'desc').limit(5).get().then((res) => {
    res.forEach((doc) => {
      takenTogether.push(doc.id);
    })
  }).catch((err) => {
    console.error(err);
    throw new Error(500);
  });
  return takenTogether;
}

// get optimized schedule from db
async function classCounterIncrement(user_id, classes) {

  const counter = db.collection('counter');
  for (var i = 0; i < classes.length; i++) {
    // add names here
    for (var j = 0; j < classes.length; j++) {
      if (i != j) {
        const class1 = classes[i].subject + ' ' + classes[i].number;
        const class2 = classes[j].subject + ' ' + classes[j].number;
        const doc = await counter.doc(class1).collection('pairs').doc(class2).get().catch((err) => {
          console.error(err);
          throw new Error(500);
        });
        if (!doc.exists) {
          await counter.doc(class1).collection('pairs').doc(class2).set({ "count": 1 }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        } else {
          await counter.doc(class1).collection('pairs').doc(class2).update({ "count": FieldValue.increment(1) }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        }
      } else {
        const class1 = classes[i].subject + ' ' + classes[i].number;
        const doc = await counter.doc(class1).get().catch((err) => {
          console.error(err);
          throw new Error(500);
        });
        if (!doc.exists) {
          await counter.doc(class1).set({ "count": 1 ,"users": FieldValue.arrayUnion(user_id) }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        } else {
          await counter.doc(class1).update({ "count": FieldValue.increment(1), "users": FieldValue.arrayUnion(user_id) }).catch((err) => {
            console.error(err);
            throw new Error(500);
          });
        }
      }
    }
  }
}

async function getGeneratedSchedule(user_id) {
  const doc = await schedules.doc(user_id).collection('spring_2023').doc('generated_schedule').get();
  try {
  return doc.data().schedule;
  } catch (e) {
    return undefined;
  }

}

async function classCounterDecrement(user_id, generated_schedule) {
  try {
    classes = generated_schedule
    const counter = db.collection('counter');
    for (var i = 0; i < classes.length; i++) {
      // add names here
      for (var j = 0; j < classes.length; j++) {
        if (i != j) {
          const class1 = classes[i].subject + ' ' + classes[i].number;
          const class2 = classes[j].subject + ' ' + classes[j].number;
          const doc = await counter.doc(class1).collection('pairs').doc(class2).get().catch((err) => {
            console.error(err);
            throw new Error(500);
          });
          if (!doc.exists) {
            continue;
          } else {
            await counter.doc(class1).collection('pairs').doc(class2).update({ "count": FieldValue.increment(-1)}).catch((err) => {
              console.error(err);
              throw new Error(500);
            });
          }
        } else {
          const class1 = classes[i].subject + ' ' + classes[i].number;
          const doc = await counter.doc(class1).get().catch((err) => {
            console.error(err);
            throw new Error(500);
          });
          if (!doc.exists) {
            continue;
          } else {
            await counter.doc(class1).update({ "count": FieldValue.increment(-1), "users": FieldValue.arrayRemove(user_id) }).catch((err) => {
              console.error(err);
              throw new Error(500);
            });
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function getClassMates(user_id, course) {
  const doc = await db.collection('counter').doc(course).get();
  const names = [];


  if (!doc.exists) {
    return names;
  }
  try {
    for (var i = 0; i < doc.data().users.length; i++) {
      const jsonObj = await utils.getUserProfile(doc.data().users[i]);
      if (doc.data().users[i] != user_id) {
        names.push(jsonObj.firstname + ' ' + jsonObj.lastname + ', ' + jsonObj.email);
      }
    } 
  } catch(error) {
    console.error('No Classmates');
  }
  return names;
}
