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
const courseRatings = db.collection('ratings').doc('courses').collection('course_ratings');

async function addUserRating(user_id, course, prequisiteStrictness, pace, depth) {
  console.log(await userAlreadyRated(user_id, course) + " << this is the value");
  if (await userAlreadyRated(user_id, course)) {
    console.log('here SENDING FALSE');
    return false;
  }
  if (await !userAlreadyRated(user_id, course)) {
    console.log('here in not');
    var rating = [];
    rating[0] = prequisiteStrictness;
    rating[1] = pace;
    rating[2] = depth;
    await courseRatings.add({user_id: user_id, course: course, rating: rating, timestamp: Timestamp.now()})
  }
  return true;
}

async function getUserRatings(user_id) {
  const userRatings = await courseRatings.where('user_id', '==', user_id).get();
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

async function userAlreadyRated(user_id, course) {
  const ratings = await courseRatings.where('user_id', '==', user_id).get();
  let res = false;
  for (var i in ratings.docs) {
    let doc = ratings.docs[i];
    doc = await doc.data();
    if (doc.course === course) {
      console.log('found a doc equal ' + doc.course + ' ' + course);
      return true;
    }
  }
  return false;
  /*
  try {
  ratings.forEach(async (doc) => {
    doc = await doc.data();
    if (doc.course === course) {
      console.log('found a doc equal ' + doc.course + ' ' + course);
      throw EarlyExit;
    }
  })
  } catch (exception) {
    if (exception == EarlyExit) {
      return false;
    }
    else {
      return true;
    }
  }
    /*
    then((res) => {
    return res;
  }) 
  */
  //return false;
  
}

async function getCourseRatings(courseName) {
  const courseRatings = await courseRatings.where('course', '==', courseName).get(); 
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
