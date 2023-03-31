require('dotenv').config({path: '../.env'});
require('../../firebase')
const dayjs = require('dayjs')
//Firebase Imports Only
//
module.exports = {
  addClassroomRating,
  getUserRatings,
  getClassroomRatings,
  editClassroomRating,
  deleteClassroomRating
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const classroomRatings = db.collection('ratings').doc('classrooms').collection('classroom_ratings');

/*
 * Function for adding a classroom rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} classroom - Name of the clasroom they are rating
 * @param {number} access_conv - Rating of how convenient the access is out of 5 at rating[0]
 * @param {number} seating_quality - Rating of seating quality out of 5 at rating[1]
 * @param {number} technology_avail - Rating of available technology out of 5 at rating[2]
 */
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

/**
 * Function for editing a classroom rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} classroom - Name of the clasroom they are rating
 * @param {number} access_conv - Rating of how convenient the access is out of 5 at rating[0]
 * @param {number} seating_quality - Rating of seating quality out of 5 at rating[1]
 * @param {number} technology_avail - Rating of available technology out of 5 at rating[2]
 */
async function editClassroomRating(user_id, classroom, access_conv, seating_quality, technology_avail) {
  const userRatings = await classroomRatings.where('user_id', '==', user_id).where('classroom', '==', classroom).get();
  var rating = [];
  rating[0] = access_conv;
  rating[1] = seating_quality;
  rating[2] = technology_avail;
  userRatings.forEach(async doc => {
    doc.ref.set({user_id: user_id, classroom: classroom, rating: rating, timestamp: Timestamp.now()})
  })
}

/**
 * Function for editing a classroom rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} classroom - Name of the clasroom they are rating
 * @param {number} access_conv - Rating of how convenient the access is out of 5 at rating[0]
 * @param {number} seating_quality - Rating of seating quality out of 5 at rating[1]
 * @param {number} technology_avail - Rating of available technology out of 5 at rating[2]
 */
async function deleteClassroomRating(user_id, classroom) {
  const userRatings = await classroomRatings.where('user_id', '==', user_id).where('classroom', '==', classroom).get();
  userRatings.forEach(async doc => {
    doc.ref.delete()
  })
}

/*
 * Function for getting all ratings user has made for classrooms
 * @param {string} user_id - ID of user
 */
async function getUserRatings(user_id) {
  const userRatings = await classroomRatings.where('user_id', '==', user_id).get();

  jArray = [];
  var count = 0;
  userRatings.forEach(async doc => {
    doc = await doc.data();
    newDate =  dayjs.unix(doc.timestamp.seconds + doc.timestamp.nanoseconds/1000000).$d;
    var jsonObj = {}
    jsonObj = {
      "classroom": doc.classroom,
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
 * Function for getting ratings for certain classrooms 
 * @param {string} classroom - Name of the classroom (ex. SMTH108) 
 */
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
  })
  return jArray;
  
}

/*
 * This function checks for duplicates - meaning if the user has already given a rating to this classroom 
 * @param {string} user_id - The ID that is rating a course
 * @param {string} classroom - The classroom that is getting rated
 */
async function userAlreadyRated(user_id, classroom) {
  const ratings = await classroomRatings.where('user_id', '==', user_id).where('classroom', '==', classroom).get();

  if (ratings.empty) {
    return false;
  }
  return true;
}
  
