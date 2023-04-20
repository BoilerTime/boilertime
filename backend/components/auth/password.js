
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const ratings = require('@mtucourses/rate-my-professors').default;
const { collection, query, where, getDocs } = require('firebase/firestore');
const sendEmail = require('../email/sendEmail');
const utils = require('../utils/utils');

const db = getFirestore();
const users = db.collection('user_profile');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.RESET);

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

/*
 * Update the password 
 * @param {string} user_id - The user_id of the user having their password updated
 * @param {string} new_password - The user_id
 * @throws {500} if no user_id is found
 */
async function updatePassword({ user_id, new_password }) {
  user_id = cryptr.decrypt(user_id);
  const profile = await users.doc(user_id).get();
  if (profile.empty) {
    throw new Error(500);
  } else {
    profile.ref.update({ password: new_password }).then(async () => {
      const email = await utils.getUserEmail(user_id);
      const updatedpw = {
        from: 'BoilerTime Trust & Safety <donotreply@mg.boilerti.me>',
        to: email,
        subject: 'Your rating on BoilerTime has been flagged!',
        template: 'updatedpw',
        'h:X-Mailgun-Variables': JSON.stringify({
          email: email,
        }),
        'h:Reply-To': 'boilertimepurdue@gmail.com',
      };
      try {
        const response = await mg.messages.create("mg.boilerti.me", updatedpw);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    })
    return new_password;
  }
}

module.exports = { updatePassword }