const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

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
 * Send email when a user flags a rating
 * @param {string} user_id - The user_id associated with the rating to flag
 * @param {string} type - The type of rating to flag (course, classroom, or ta)
 * @param {string} name - THe name of the course, classroom, ta (CS30700, LWSNB160, Chirayu Garg)
 */
async function sendEmailWhenFlagged(type, name, user_id, flag_count) {
    var team_maillist = [
      'mahadkhalid4955@gmail.com',
      'joshuajy03@gmail.com',
      'hsmayer7@gmail.com',
      'laijustin.h@gmail.com',
      'zacharycsy@gmail.com',
      'npowers2000@gmail.com'
    ];
    var user_email = await utils.getUserEmail(user_id)

    const touser = {
      from: 'BoilerTime Data Integrity <donotreply@boilerti.me>',
      to: user_email,
      subject: 'Your rating on BoilerTime has been flagged!',
      template: 'flaggedrating_touser',
      'h:X-Mailgun-Variables': JSON.stringify({
        user: user_email,
        topic: name,
        email: user_email,
      }),
      'h:Reply-To': 'boilertimepurdue@gmail.com',
    };

    try {
      const response = await mg.messages.create("mg.boilerti.me", touser);
      console.log(response);
    } catch {
      console.log("Failed to send email to user");
    }

    const toteam = {
      from: 'BoilerTime Data Integrity <donotreply@boilerti.me>',
      to: team_maillist,
      subject: 'A rating on BoilerTime has been flagged!',
      template: 'flaggedrating_toteam',
      'h:X-Mailgun-Variables': JSON.stringify({
        user_email: user_email,
        rating_type: type,
        rating_name: name,
        flag_count: flag_count,
        email: "",
      }),
      'h:Reply-To': 'boilertimepurdue@gmail.com',
    };

    try {
      const response = await mg.messages.create("mg.boilerti.me", toteam);
      console.log(response);
    } catch {
      console.log("Failed to send email to team");
    }

}
