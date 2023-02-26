const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore();
const users = db.collection('user_profile');


/**
 * Get the user_id given the email
 * @param {string} email - The email that the user wants to find the user_id for
 * @returns {string} - The user_id
 * @throws {500} if no user_id is found
 */
async function getUID({ email }) {
  const profile = await users.where('email', '==', email).get();
  if (profile.empty) {
    throw new Error(500);
  }
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
  //console.log(existingUsers.size);
  return existingUsers.size > 0;
}

/**
 * Update the password 
 * @param {string} user_id - The user_id of the user having their password updated
 * @param {string} new_password - The user_id
 * @throws {500} if no user_id is found
 */
async function updatePassword({ user_id, new_password }) {
  const profile = await users.doc(user_id).get();
  if (profile.empty) {
    throw new Error(500);
  } else {
    profile.ref.update({ password: new_password })
    return (password = new_password);
  }
}

/**
 * Add bookmark
 * @param {string} user_id - The user_id of the user having their bookmark updated
 * @param {string} class_name - The class_name to add
 */
async function addBookmark(user_id, class_name) {
  const profile = users.doc(user_id)
  const union = await profile.update({
    bookmarks: FieldValue.arrayUnion(class_name)
  })
}

/**
 * Remove bookmark
 * @param {string} user_id - The user_id of the user having their bookmark updated
 * @param {string} class_name - The class_name to add
 */
async function reomveBookmark(user_id, class_name) {
  const profile = users.doc(user_id)
  const union = await profile.update({
    bookmarks: FieldValue.arrayRemove(class_name)
  })
}

/**
 * Remove bookmark
 * @param {string} user_id - The user_id of the user having their bookmark updated
 * @param {string} class_name - The class_name to add
 */
async function getBookmarks(user_id, class_name) {
  const profile = await users.doc(user_id).get();
  if (!profile.exists) {
    throw new Error(500)
  } else {
    return (bookmarks = profile.data().bookmarks);
  }
}

module.exports = { getUID, findExistingUsers, updatePassword, addBookmark, reomveBookmark, getBookmarks };
