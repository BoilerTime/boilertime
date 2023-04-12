const cron = require('node-cron');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
require('../../firebase')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const notify = db.collection('notify');


// need to create bash script that executes this file every 4am
// need to add that bash script to cronetab -e
cron.schedule('0 4 * * *', async () => {
  // Assuming you have a reference to the Firestore collection

  // Get all documents in the collection
  notify.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`Processing document with ID: ${doc.id}`);

      // Get an array of field names in the document
      let fieldNames = Object.keys(doc.data());

      // Loop through each field in the document
      for (let i = 0; i < fieldNames.length; i++) {
        let field = fieldNames[i];

        // Check if the field is an array
        if (Array.isArray(doc.data()[field])) {
          // Get the name of the array (i.e. "CS 24000")
          const arrayName = field.split(" ")[0];
          console.log(`Array name: ${arrayName}`);

          // Loop through each element in the array
          for (let j = 0; j < doc.data()[field].length; j++) {
            let element = doc.data()[field][j];
            console.log(`${field}[${j}] = ${element}`);

            // check here from purdue.io to see if the sections opened up or not. if they did then send an email, else just delete :wqa
            //
          }
        } else {
          console.log(`${field} = ${doc.data()[field]}`);
        }
      }
    });
  }).catch((error) => {
    console.log("Error getting documents:", error);
  });
});
