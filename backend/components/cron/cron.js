const cron = require('node-cron');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
require('../../firebase')
const purdueio = require('../datasources/purdueios')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const sendEmail = require('../../components/email/sendEmail')

const db = getFirestore()
const notify = db.collection('notify');

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

// need to create bash script that executes this file every 4am
// need to add that bash script to cronetab -e
//cron.schedule('0 4 * * *', async () => {
async function runCron() {
  // Assuming you have a reference to the Firestore collection

  // Get all documents in the collection
  notify.get().then(async (querySnapshot) => {
    for (var i = 0; i < querySnapshot.docs.length; i++) {
      let doc = querySnapshot.docs[i];
      console.log(`Processing document with ID: ${doc.id}`);

      // Get an array of field names in the document
      let fieldNames = Object.keys(doc.data());

      // Loop through each field in the document
      for (let j = 0; j < fieldNames.length; j++) {
        let field = fieldNames[j];
        console.log(field)

        // Check if the field is an array
        if (Array.isArray(doc.data()[field])) {
          // Get the name of the array (i.e. "CS 24000")
          const arrayName = field.split(" ")[0];
          console.log(`Array name: ${arrayName}`);
          isFullArray = await purdueio.isFull(field.split(" ")[0], field.split(" ")[1], doc.data()[field]);
          console.log(isFullArray);
          if(isFullArray.includes(true)) {
            console.log('do nothing');
          }
          else {
            const classnowopen = {
              from: 'BoilerTime Data Integrity <donotreply@mg.boilerti.me>',
              to: `${doc.id}`,
              subject: 'BoilerTime – ' + field + ' is now open for registration',
              template: 'classnowopen',
              'h:X-Mailgun-Variables': JSON.stringify({
                course: field,
                email: doc.id,
              }),
              'h:Reply-To': 'boilertimepurdue@gmail.com',
            };
            try {
              const response = await mg.messages.create("mg.boilerti.me", classnowopen);
              console.log(response);
            } catch {
              console.log("Failed to send email to user");
            }
          }

          // Loop through each element in the array
          for (let k = 0; k < doc.data()[field].length; k++) {
            let element = doc.data()[field][k];
            console.log(`${field}[${k}] = ${element}`);

            // check here from purdue.io to see if the sections opened up or not. if they did then send an email, else just delete :wqa
            //
          }
        } else {
          console.log(`${field} = ${doc.data()[field]}`);
        }
      }
    }
  });
}
//});
module.exports = { 
  runCron
}
