require('dotenv').config({path: '../.env'});
require('../../firebase')
const dayjs = require('dayjs')
//Firebase Imports Only
//
module.exports = {
  getUserRatings,
  addUserRating,
  getCourseRatings,
  editUserRating,
  deleteUserRating
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const courseRatings = db.collection('ratings').doc('courses').collection('course_ratings');

/*
 * Function for adding a course rating it also checks for duplcates
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 * @param {number} prequisite_strictness - Rating of how strict the prequisites are out of 5 at rating[0]
 * @param {number} pace - Rating of how the pace of material covered is out of 5 at rating[1]
 * @param {number} depth - Rating of deep the material covered is out of 5 at rating[2]
 */
async function addUserRating(user_id, course, prequisiteStrictness, pace, depth) {
  //console.log(await userAlreadyRated(user_id, course) + " << this is the value");
  if (await userAlreadyRated(user_id, course)) {
    //console.log('here SENDING FALSE');
    return false;
  }
  else {
    //console.log('here in not');
    var rating = [];
    rating[0] = prequisiteStrictness;
    rating[1] = pace;
    rating[2] = depth;
    await courseRatings.add({user_id: user_id, course: course, rating: rating, flag_count: 0, timestamp: Timestamp.now()})
  }
  return true;
}

/**
 * Function for editing a course rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 * @param {number} prequisite_strictness - Rating of how strict the prequisites are out of 5 at rating[0]
 * @param {number} pace - Rating of how the pace of material covered is out of 5 at rating[1]
 * @param {number} depth - Rating of deep the material covered is out of 5 at rating[2]
 */
async function editUserRating(user_id, course, prequisiteStrictness, pace, depth) {
  //console.log(await userAlreadyRated(user_id, course) + " << this is the value");
  const userRatings = await courseRatings.where('user_id', '==', user_id).where('course', '==', course).get();
  var rating = [];
  rating[0] = prequisiteStrictness;
  rating[1] = pace;
  rating[2] = depth;
  userRatings.forEach(async doc => {
    await doc.ref.set({user_id: user_id, course: course, rating: rating, timestamp: Timestamp.now()})
  })
}

/**
 * Function for deleting a course rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 */
async function deleteUserRating(user_id, course) {
  const userRatings = await courseRatings.where('user_id', '==', user_id).where('course', '==', course).get();
  userRatings.forEach(async doc => {
    await doc.ref.delete()
  })
}

/*
 * Function for getting all ratings user has made for courses 
 * @param {string} user_id - ID of user
 */
async function getUserRatings(user_id) {
  const userRatings = await courseRatings.where('user_id', '==', user_id).get();


  jArray = [];
  var count = 0;
  userRatings.forEach(async doc => {
    doc = await doc.data();
    newDate =  dayjs.unix(doc.timestamp.seconds + doc.timestamp.nanoseconds/1000000).$d;
    var jsonObj = {} 
    jsonObj = {
      "course": doc.course,
      "rating": doc.rating,
      "timestamp": newDate.toDateString(),
      "flag_count": doc.flag_count
    }
    jArray[count] = jsonObj;
    count++;
  })
  return jArray;
}

/*
 * This function checks for duplicates - meaning if the user has already given a rating to this course
 * @param {string} user_id - The ID that is rating a course
 * @param {string} course - The course that is getting rated
 */
async function userAlreadyRated(user_id, course) {
  const ratings = await courseRatings.where('user_id', '==', user_id).where('course', '==', course).get();
  if (ratings.empty) {
    //console.log('EMPTY');
    return false;
  }
  //console.log('NOT EMPTY');
  return true;
}

/*
 * Function for getting ratings for certain courses
 * @param {string} courseName - Name of the course (ex. CS30700) 
 */
async function getCourseRatings(courseName) {
  const ratings = await courseRatings.where('course', '==', courseName).get(); 

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
      "flag_count": doc.flag_count,
      "user_id": doc.user_id
    }
    jArray[count] = (json);
    /*
    jsonObj['rating ' + count] = {
      "rating": doc.rating,
      "timestamp": newDate.toDateString()
    }
    */
    count+=1;
  });
  return jArray;
}


