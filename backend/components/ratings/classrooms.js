require('dotenv').config({path: '../.env'});
require('../../firebase')
const dayjs = require('dayjs')
//Firebase Imports Only
//
module.exports = {
  addClassroomRating,
  getUserRatings,
  getClassroomRatings
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const classroomRatings = db.collection('ratings').doc('classrooms').collection('classroom_ratings');

async function addClassroomRating(user_id, classroom, access_conv, seating_quality, technology_avail) {
  if (!(await userAlreadyRated(user_id, classroom))) {
    var rating = [];
    rating[0] = access_conv;
    rating[1] = seating_quality;
    rating[2] = technology_avail;
    await classroomRatings.add({user_id: user_id, classroom: classroom, rating: rating, flag_count: 0, timestamp: Timestamp.now()})
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
    jsonObj[doc.classroom] = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString(),
      "flag_count": doc.flag_count
    }
  })
  return jsonObj;
}

async function getClassroomRatings(classroom) {
  const ratings = await classroomRatings.where('classroom', '==', classroom).get();

  var jsonObj = {};

  let count = 0
  jArray = [];
  ratings.forEach(async doc => {
    doc = await doc.data();
    newDate =  dayjs.unix(doc.timestamp.seconds + doc.timestamp.nanoseconds/1000000).$d;
    json = {}
    json = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString(),
      "flag_count": doc.flag_count
    }
    jArray[count] = (json);
    /*
    jsonObj['rating ' + count] = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString()
    }
    */
    count+=1;
  })
  return jArray;
  
}

async function userAlreadyRated(user_id, classroom) {
  const ratings = await classroomRatings.where('user_id', '==', user_id).where('classroom', '==', classroom).get();

  if (ratings.empty) {
    return false;
  }
  return true;
}
  
