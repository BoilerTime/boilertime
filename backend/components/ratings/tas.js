require('dotenv').config({path: '../.env'});
require('../../firebase')
const dayjs = require('dayjs')
//Firebase Imports Only
//
module.exports = {
  getUserRatings,
  addUserRating,
  getTARatings
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const taRatings = db.collection('ratings').doc('tas').collection('ta_ratings');

async function addUserRating(user_id, ta, gradingFairness, questionAnswering, responsiveness) {
  //console.log(await userAlreadyRated(user_id, ta) + " << this is the value");
  if (await userAlreadyRated(user_id, ta)) {
    //console.log('here SENDING FALSE');
    return false;
  }
  else {
    //console.log('here in not');
    var rating = [];
    rating[0] = gradingFairness;
    rating[2] = questionAnswering;
    rating[1] = responsiveness;
    await taRatings.add({user_id: user_id, ta: ta, rating: rating, timestamp: Timestamp.now()});
  }
  return true;
}

async function getUserRatings(user_id) {
  const ratings = await taRatings.where('user_id', '==', user_id).get();
  var jsonObj = {} 

  ratings.forEach(async doc => {
    doc = await doc.data();
    newDate =  dayjs.unix(doc.timestamp.seconds + doc.timestamp.nanoseconds/1000000).$d;
    jsonObj[doc.ta] = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString()
    }
  })
  return jsonObj;
}

async function getTARatings(ta) {
  const ratings = await taRatings.where('ta', '==', ta).get(); 

  var jsonObj = {};

  let count = 0
  jArray = [];
  ratings.forEach(async doc => {
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

async function userAlreadyRated(user_id, ta) {
  const ratings = await taRatings.where('user_id', '==', user_id).where('ta', '==', ta).get();
  if (ratings.empty) {
    //console.log('EMPTY');
    return false;
  }
  //console.log('NOT EMPTY');
  return true;
}
