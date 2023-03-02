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

/*
 * Function for adding a TA rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} ta - Name of the TA they are rating
 * @param {number} gradingFairness - Rating of grading fairness out of 5 at rating[0]
 * @param {number} helpfullness- Rating of helpfullness out of 5 at rating[1]
 * @param {number} questionAnswering - Rating of question answering out of 5 at rating[2]
 * @param {number} responsiveness - Rating of responsiveness out of 5 at rating[3]
 */
async function addUserRating(user_id, ta, gradingFairness, helpfullness, questionAnswering, responsivness) {
  //console.log(await userAlreadyRated(user_id, ta) + " << this is the value");
  if (await userAlreadyRated(user_id, ta)) {
    //console.log('here SENDING FALSE');
    return false;
  }
  else {
    //console.log('here in not');
    var rating = [];
    rating[0] = gradingFairness;
    rating[1] = helpfullness;
    rating[2] = questionAnswering;
    rating[3] = responsivness;
    await taRatings.add({user_id: user_id, ta: ta, rating: rating, flag_count: 0, timestamp: Timestamp.now()})
  }
  return true;
}

/*
 * Function for getting all ratings user has made for TA's
 * @param {string} user_id - ID of user
 */
async function getUserRatings(user_id) {
  const ratings = await taRatings.where('user_id', '==', user_id).get();
  var jsonObj = {} 

  ratings.forEach(async doc => {
    doc = await doc.data();
    newDate =  dayjs.unix(doc.timestamp.seconds + doc.timestamp.nanoseconds/1000000).$d;
    jsonObj[doc.ta] = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString(),
      "flag_count": doc.flag_count
    }
  })
  return jsonObj;
}

/*
 * Function for getting ratings for certain TA 
 * @param {string} ta - Name of the TA
 */
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

/*
 * This function checks for duplicates - meaning if the user has already given a rating to this TA
 * @param {string} user_id - The ID that is rating a course
 * @param {string} ta - The TA that is getting rated
 */
async function userAlreadyRated(user_id, ta) {
  const ratings = await taRatings.where('user_id', '==', user_id).where('ta', '==', ta).get();
  if (ratings.empty) {
    //console.log('EMPTY');
    return false;
  }
  //console.log('NOT EMPTY');
  return true;
}
