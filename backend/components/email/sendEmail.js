const nodemailer = require('nodemailer');

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
      console.log("Failed to send becuase of error: " + error);
      throw new Error().error = 500;
    } else {
      //Do something
    }
  });
}
