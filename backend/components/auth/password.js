
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const ratings = require('@mtucourses/rate-my-professors').default;
const { collection, query, where, getDocs } = require('firebase/firestore');
const sendEmail = require('../email/sendEmail');
const utils = require('../utils/utils');

const db = getFirestore();
const users = db.collection('user_profile');
/*
 * Update the password 
 * @param {string} user_id - The user_id of the user having their password updated
 * @param {string} new_password - The user_id
 * @throws {500} if no user_id is found
 */
async function updatePassword({ user_id, new_password }) {
  const profile = await users.doc(user_id).get();
  if (profile.empty) {
    throw new Error(500);
  } else {
    profile.ref.update({ password: new_password }).then(async () => {
      const email = await utils.getUserEmail(user_id);
      const mailOptions = {
        from: process.env.EMAIL,
        to: `${email}`,
        subject: 'BoilerTime Password Changed',
        html: `<b>Your Password Has Been Updated</b>`
      }
      sendEmail.sendEmail({ mailOptions });
    })
    return new_password;
  }
}

module.exports = {updatePassword}