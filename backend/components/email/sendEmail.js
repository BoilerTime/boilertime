const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

module.exports = {
  sendEmail,
  sendEmailWhenFlagged
}

const db = getFirestore()
const ratings = db.collection('ratings');

/**
 * Send email given mailOptions
 * @param {JSON} mailOptions - Details of the email
 */
async function sendEmail({ mailOptions }) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Failed to send becuase of error: " + error);
      throw new Error().error = 500;
    } else {
      //Do something
    }
  });
}

/**
 * Send email given mailOptions
 * @param {JSON} mailOptions - Details of the email
 */
async function sendEmailWhenFlagged(type, name, user_id, flag_count) {
    var maillist = [
      'mahadkhalid4955@gmail.com',
      'joshuajy03@gmail.com',
      'hsmayer7@gmail.com',
      'laijustin.h@gmail.com',
      'laijustin.h@gmail.com',
      'zacharycsy@gmail.com',
      'npowers2000@gmail.com'
    ];
    const user_email = await utils.getUserEmail(user_id)
    const mailOptions = {
      from: process.env.EMAIL,
      to: maillist,
      subject: 'New Flagged Rating on BoilerTime!',
      text: `A new rating has been flagged on a, Type: ${type}, Name: ${name} by user email: ${user_email}, userID: ${user_id}. The flag count for this rating is now: ${flag_count}`
    }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Failed to send becuase of error: " + error);
      throw new Error().error = 500;
    } else {
      //Do something
    }
  });
}
