const nodemailer = require('nodemailer');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

module.exports = {
  sendEmail,
  getUID
}

const db = getFirestore()
const users = db.collection('user_profile')


async function getUID({ email }) {
  const profile = await users.where('email', '==', email).get();
  profile.forEach(doc => {
    return (user_id = doc.data().user_id);
  });
}

async function sendEmail ({ mailOptions }) {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}