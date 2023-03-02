require('dotenv').config({path: '../.env'});
require('../../firebase')
const dayjs = require('dayjs')
//Firebase Imports Only
//
module.exports = {
  addClassroomRating
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const classroomRatings = db.collection('ratings').doc('classrooms').collection('classroom_ratings');

async function addClassroomRating(rating, user_id, classroom) {
  if (!(await userAlreadyRated(user_id))) {
    await classroomRatings.add({user_id: user_id, classroom: classroom, rating: rating, timestamp: Timestamp.now()})
    return true;
  }
  else {
    return false;
  }
}

async function getUserRatings(user_id) {
  const userRatings = await classroomRatings.where('user_id', '==', user_id).get();
  var jsonObj = {}

  userRatings.forEach(async doc => {
    doc = await doc.data();
    newDate =  dayjs.unix(doc.timestamp.seconds + doc.timestamp.nanoseconds/1000000).$d;
    jsonObj[doc.course] = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString()
    }
  })
  return jsonObj;
}

async function userAlreadyRated(user_id, classroom) {
  const ratings = await classroomRatings.where('user_id', '==', user_id).where('classroom', '==', classroom).get();

  if (ratings.empty) {
    return false;
  }
  return true;
}
  
