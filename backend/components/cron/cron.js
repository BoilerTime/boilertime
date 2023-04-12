const cron = require('node-cron');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');


// need to create bash script that executes this file every 4am
// need to add that bash script to cronetab -e
cron.schedule('0 4 * * *', async () => {
  try {
    const response = await fetch(apiEndpoint);
    const result = await response.text();

    // move this stuff to send mail list
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: maillist,
      subject: '',
      text: ''
    }

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error(error);
  }
});
