require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');
const {getSchedule} = require('./getschedule');
const db = getFirestore();
const schedules = db.collection('user_schedules');
const classes = db.collection('classes')

module.exports = {
  addClasses,
  addClassesGuest,
  getClasses,
  getSections,
  classCounterIncrement,
  classCounterDecrement,
  hotClasses,
  takenTogether,
  getGeneratedSchedule,
  getClassMates,
  deleteSchedule
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
    "preference_list": user.preference_list,
    "blocked_times": user.blocked_times,
    "num_courses": user.num_courses,
    "configured": user?.configured || false,
    "timestamp": FieldValue.serverTimestamp()
  };
  await db.collection('user_schedules').doc(user.user_id).collection('spring_2023').doc('schedule').set(input).then((res) => {
    console.log("Saved")
  }).catch((err) =>{
    console.error(err);
    throw new Error(500);
  })
}

async function addClassesGuest(user) {
  const input = {
    "required_classes": user.required_classes,
    "optional_classes": user.optional_classes,
    "personal_preferences": user?.personal_preferences||"",
    "time": user.time,
    "preference_list": user.preference_list,
    "blocked_times": user.blocked_times,
    "num_courses": user.num_courses,
    "configured": user?.configured || false,
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
  const hot = await db.collection('counter').orderBy('count', 'desc').limit(4).get().then((res) => {
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
  const together = await db.collection('counter').doc(course).collection('pairs').orderBy('count', 'desc').limit(4).get().then((res) => {
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

async function deleteSchedule(user_id, term_id) {
    let generatedSchedule = await schedules.doc(user_id).collection(term_id).doc('generated_schedule').get();
    let createdSchedule = await schedules.doc(user_id).collection(term_id).doc('schedule').get();
    if (generatedSchedule.exists) {
      await generatedSchedule.ref.delete();
    }
    if (createdSchedule.exists) {
      await createdSchedule.ref.delete();
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
            if (doc.exists) {
                counter.doc(class1).collection('pairs').doc(class2).update({ "count": FieldValue.increment(-1)}).catch((err) => {
                console.error(err);
                throw new Error(500);
              });
            }
          } else {
            counter.doc(class1).update({ "count": FieldValue.increment(1), "users": FieldValue.arrayUnion(user_id) }).catch((err) => {
              const class1 = classes[i].subject + ' ' + classes[i].number;
              const doc = counter.doc(class1).get().catch((err) => {
                console.error(err);
                throw new Error(500);
              });
              if (doc.exists) {
                  counter.doc(class1).update({ "count": FieldValue.increment(-1), "users": FieldValue.arrayRemove(user_id) }).catch((err) => {
                    console.error(err);
                    throw new Error(500);
                  });
                }
             });
          }
        }
     } 
  }catch (e) {
    console.error(e);
  }
}

async function getSections(subject, number, sectionID) {
  console.log(subject + number + sectionID);
  const docs1 = await classes.doc('spring_2023').get();
  console.log('docs length ' + docs1.length);
  const docs = await classes.doc('spring_2023').collection(subject).doc(number).collection(sectionID).get()  
  console.log('docs length ' + docs.docs.length);
  var jArray = [];
  for (var i = 0; i < docs.docs.length; i++) {
    if (docs.docs[i].data().type != 'Lecture') {
      jArray.push({
        "starttime": docs.docs[i].data().starttime,
        "id": docs.docs[i].id,
        "durations": docs.docs[i].data().durations,
        "daysOfWeek": docs.docs[i].data().daysOfWeek
      })
    }
  }
  return jArray;
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
      if (doc.data().users[i] != user_id && jsonObj.pairs) {
        names.push(jsonObj.firstname + ' ' + jsonObj.lastname + ', ' + jsonObj.email);
      }
    } 
  } catch(error) {
    console.error('No Classmates');
  }
  return names;
}
