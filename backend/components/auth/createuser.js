require('dotenv').config({ path: '../.env' });
require('../../firebase')
const emailvalidator = require('email-validator');
const uuid = require('./uuid.js');
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');
const sendEmail = require('../email/sendEmail');
const crypto = require('crypto');

const db = getFirestore()
const profiles = db.collection('user_profile');
const schedules = db.collection('user_schedules');

/**
  * Create User creates a new user to enter into the database matching the parameters passed to it.
  * @param {JSON} profile - A JSON representation of the user profile. Must include the user's first name, last name, and email address.
  * @returns {JSON} - The profile of the created user that was stored into the database. The name, email, and password will all match was was passed to the function, but there will be a new user_id field that represents the UUID that was assigned to the user upon creation.
**/
const createuser = async function (profile) {
  //If the request is malformed, throw an error right away
  if ((!(profile.email && profile.firstname && profile.lastname && profile.gradmonth && profile.gradyear && profile.isGraduateStudent != undefined && profile.password))) {
    console.log(profile.email + profile.firstname + profile.lastname + profile.gradmonth + profile.gradyear + profile.isGraduateStudent + profile.password)
    let response = new Error();
    response.error = 400;
    throw response;
    //throw new Error({'error': '400'});
  }

  //If the user has not provided a valid email address, this is an illegal request to the server
  profile.email = profile.email.toLowerCase()
  if (!(emailvalidator.validate(profile.email) && profile.email.endsWith('@purdue.edu'))) {
    let response = new Error();
    response.error = 403;
    throw response;
    //throw new Error({'error': '403'});
  }

  if (await findExistingUsers(profile.email)) {
    let response = new Error();
    response.error = 409;
    throw response;
  }

  const userID = await uuid.uuid();
  const userProfile = {
    "email": profile.email,
    "firstname": profile.firstname,
    "isVerified": false,
    "lastname": profile.lastname,
    "password": profile.password,
    "user_id": userID,
    "grad_year": profile.gradyear,
    "grad_month": profile.gradmonth,
    "is_grad_student": profile.isGraduateStudent,
    "bookmarks": []
  }

  await profiles.doc(userID).set(userProfile).then((res) => {
    //It worked, great! Don't need to do anything, though
  }).catch((err) => {
    throw new Error().error = 500;
  })

  await sendVerificationEmail(userProfile).then(() => {
    //Do smth
  }).catch((err) => {
    throw new Error().error = 500;
  })
  return userProfile;
}

const findExistingUsers = async function (email) {
  const existingUsers = await profiles.where('email', '==', email).get();
  //If there are existing users with the same email, return false
  console.log(existingUsers.size);
  return existingUsers.size > 0;
}

const sendVerificationEmail = async function (profile) {

  const mailOptions = {
    from: 'BoilerTime',
    to: `${profile.email}`,
    subject: 'Verify BoilerTime Account',
    html: `
	  <h1 style="font-size: 14px; font-weight: normal;">Hi, ${profile.firstname}!</h1>
	  <p> Welcome to BoilerTime! We're excited to help create your perfect class schedule! Please <a href="http://localhost:3000/auth/verifyaccount?id=${profile.user_id}">Click Here</a> to verify your account!</p>`
  }
  try {
    await sendEmail.sendEmail({ mailOptions });
  } catch (e) {
    throw new Error().error = 500;
  }

}

module.exports = { createuser };
