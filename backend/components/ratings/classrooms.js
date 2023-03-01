require('dotenv').config({path: '../.env'});
require('../../firebase')
//Firebase Imports Only
//
module.exports = {
  getUserRatings,
  addUserRating
}

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const classRatings = db.collection('ratings').doc('classrooms').collection('classes_ratings');

async function addUserRating(user_id, course, rating) {
  classRatings.add({user_id: user_id, course: course, rating: rating, timestamp: Timestamp.now()})
}

async function getUserRatings(user_id) {
  const userRatings = await classRatings.where('user_id', '==', user_id).get();

  userRatings.forEach(async doc => {
    doc = await doc.data();
    console.log(doc.course + ' has the following comment ' + doc.rating);
  })
}
