
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const ratings = require('@mtucourses/rate-my-professors').default;
const { collection, query, where, getDocs } = require('firebase/firestore');
const sendEmail = require('../email/sendEmail');
const utils = require('../utils/utils');

const db = getFirestore();
const users = db.collection('user_profile');
const schedules = db.collection('schedules');
const groups = db.collection('groups');

/*
 * Delete the user account
 * @param {string} user_id - The user_id of the user having their password updated
 */
async function deleteAccount(user_id) {
  await users.doc(user_id).delete()
  await schedules.doc(user_id).delete()
}

module.exports = {updatePassword}