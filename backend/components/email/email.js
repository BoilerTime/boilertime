const nodemailer = require('nodemailer');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

module.exports = {
  sendEmail,
  getUID
}

const db = getFirestore()
const users = db.collection('user_profile')


async function getUID({ username }) {
    const profile = await users.where('email', '==', username).get();
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