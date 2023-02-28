require('dotenv').config({ path: '../.env' });
require('../../firebase')
const utils = require('../utils/utils');
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const db = getFirestore()
const users = db.collection('user_profile');

const verifyaccount = async function (userID) {
  //If the user_id is undefined for some reason when the function is called, throw a 400 error 
  if (!(userID)) {
    throw new Error().error = 400;
  }
  //Get the profile from the database, if it exists
  const profile = await users.where('user_id', '==', userID).get();
  //console.log(profile);
  //If, for some reason, there are 0 or 2+ users, throw a forbidden error for making a bad request
  if (profile.size != 1) {
    throw new Error().error = 403;
  }

  //Now that we know the user exists and is not verified, we can mark them as verified
  var record;
  profile.forEach(doc => {
    ;
    record = doc.data();
    if (record.isVerified) {
      throw new Error().error = 409;
    }
    doc.ref.update({ isVerified: true });
  })
  //Now return some info about the user who was just verified to the client
  return record;//{firstname: profile.fistName, email: profile.email};
}

module.exports = { verifyaccount };
