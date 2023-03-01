require('dotenv').config({path: '../.env'});
require('../../firebase')
const dayjs = require('dayjs')
//Firebase Imports Only
//
module.exports = {
  getUserRatings,
  addUserRating,
  getCourseRatings
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const classRatings = db.collection('ratings').doc('courses').collection('course_ratings');

async function addUserRating(user_id, course, prequisiteStrictness, pace, depth) {
  var rating = [];
  rating[0] = prequisiteStrictness;
  rating[1] = pace;
  rating[2] = depth;
  classRatings.add({user_id: user_id, course: course, rating: rating, timestamp: Timestamp.now()})
}

async function getUserRatings(user_id) {
  const userRatings = await classRatings.where('user_id', '==', user_id).get();
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

async function getCourseRatings(courseName) {
  const courseRatings = await classRatings.where('course', '==', courseName).get(); 
  var jsonObj = {};

  let count = 0
  jArray = [];
  courseRatings.forEach(async doc => {
    doc = await doc.data();
    newDate =  dayjs.unix(doc.timestamp.seconds + doc.timestamp.nanoseconds/1000000).$d;
    json = {}
    json = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString()
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
