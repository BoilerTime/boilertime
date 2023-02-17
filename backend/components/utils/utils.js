const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore();
const users = db.collection('user_profile');


/**
 * Get the user_id given the email
 * @param {string} email - The email that the user wants to find the user_id for
 * @returns {string} - The user_id
 */
async function getUID({ email }) {
  const profile = await users.where('email', '==', email).get();
  profile.forEach(doc => {
    return (user_id = doc.data().user_id);
  });
}

/** 
  * Utilility for finding if any users exist by email
  * @param {string} email - The email that needs to be found in the server
  * @returns {boolean} - A boolean representing whether or not there are matching users in the database.
**/
const findExistingUsers = async function (email) {
    const existingUsers = await users.where('email', '==', email).get();
    //If there are existing users with the same email, return false
    console.log(existingUsers.size);
    return existingUsers.size > 0;
}


module.exports = {getUID, findExistingUsers};