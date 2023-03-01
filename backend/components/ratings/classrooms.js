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
  }
  else {
    return undefined;
  }
}

async function userAlreadyRated(user_id, classroom) {
  const ratings = await classroomRatings.where('user_id', '==', user_id).get();

  ratings.forEach(async doc => {
    doc = await doc.data();
    if (doc.classroom == classroom) {
      return true;
    }
  })
  return false;
}
  
