const nodemailer = require('nodemailer');
require('dotenv').config({path: '../.env'});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

module.exports = {
  sendEmail
}

/**
 * Send email given mailOptions
 * @param {JSON} mailOptions - Details of the email
 */
async function sendEmail ({ mailOptions }) {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      throw error
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
