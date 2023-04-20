require('dotenv').config({path: '../.env'});
require('../../firebase')
const dayjs = require('dayjs')
//Firebase Imports Only
//
module.exports = {
  getUserRatings,
  addRating,
  getCourseRatings,
  editUserRating,
  deleteUserRating
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const courseUserRatings = db.collection('ratings').doc('courses').collection('user_ratings');
const courseRatings = db.collection('ratings').doc('courses').collection('course_ratings');

/*
 * Function for adding a course rating it also checks for duplcates
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 * @param {number} prequisite_strictness - Rating of how strict the prequisites are out of 5 at rating[0]
 * @param {number} pace - Rating of how the pace of material covered is out of 5 at rating[1]
 * @param {number} depth - Rating of deep the material covered is out of 5 at rating[2]
 */
async function addRating(user_id, course, prequisiteStrictness, pace, depth, explanation) {
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
    await courseUserRatings.doc(user_id).collection(course).doc(user_id).set({user_id: user_id, course: course, rating: rating, flag_count: 0, explanation: explanation, timestamp: Timestamp.now()})
    courseRating = await courseRatings.doc(course).get();
    if (courseRating.exists) {
      const data = courseRating.data();
      rating[0] = ((data.avg_ratings[0] * data.num_ratings + rating[0]) / (data.num_ratings + 1)).toFixed(2); 
      rating[1] = ((data.avg_ratings[1] * data.num_ratings + rating[1]) / (data.num_ratings + 1)).toFixed(2); 
      rating[2] = ((data.avg_ratings[2] * data.num_ratings + rating[2]) / (data.num_ratings + 1)).toFixed(2); 
      courseRating = await courseRatings.doc(course).update({explanations: FieldValue.arrayUnion({explanation: explanation, timestamp: Timestamp.now()}), avg_ratings: rating, num_ratings: data.num_ratings + 1});
    }
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
async function editUserRating(user_id, course, prequisiteStrictness, pace, depth, explanation) {
  //console.log(await userAlreadyRated(user_id, course) + " << this is the value");
  const userRatings = await courseUserRatings.doc(user_id).collection(course).doc(user_id).get();
  console.log(userRatings.exists);
  var rating = [];
  rating[0] = prequisiteStrictness;
  rating[1] = pace;
  rating[2] = depth;
  var updated_average = []
  if (userRatings.exists) {
    const doc = await userRatings.data();
    courseRating = await courseRatings.doc(course).get();
    await courseRatings.doc(course).set({explanations: {explanation: explanation, timestamp: Timestamp.now()}, avg_ratings: rating});
    if (courseRating.exists) {
      const data = courseRating.data();
      updated_average[0] = ((data.avg_ratings[0] * data.num_ratings - doc.rating[0] + rating[0]) / (data.num_ratings)).toFixed(2); 
      updated_average[1] = ((data.avg_ratings[1] * data.num_ratings - doc.rating[1] + rating[1]) / (data.num_ratings)).toFixed(2); 
      updated_average[2] = ((data.avg_ratings[2] * data.num_ratings - doc.rating[2] + rating[2]) / (data.num_ratings)).toFixed(2); 
      courseRating = await courseRatings.doc(course).update({explanations: FieldValue.arrayUnion({explanation: explanation, timestamp: Timestamp.now()}), avg_ratings: updated_average, num_ratings: data.num_ratings});
    }
    await userRatings.ref.update({user_id: user_id, course: course, rating: rating, explanation, explanation, timestamp: Timestamp.now()})
  }
}

/**
 * Function for deleting a course rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 */
async function deleteUserRating(user_id, course) {
  const userRatings = await courseUserRatings.doc(user_id).where('course', '==', course).get();
  userRatings.forEach(async doc => {
    await doc.ref.delete()
  })
}

/*
 * Function for getting all ratings user has made for courses 
 * @param {string} user_id - ID of user
 */
async function getUserRatings(user_id) {
  const userRatings = await courseUserRatings.doc(user_id).get();

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
      "flag_count": doc.flag_count,
      "explanation": doc.explanation,
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
  const ratings = await courseUserRatings.doc(user_id).collection(course).get();
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
  const ratings = await courseRatings.doc(courseName).get(); 

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
      "user_id": doc.user_id,
      "explanation": doc.explanation
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

