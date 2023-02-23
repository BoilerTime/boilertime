require('../../firebase')
const crypto = require('crypto');
const config = require('../../../config.json');

//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const db = getFirestore()
const count = db.collection('uuidcount');

/**
  * Returns a uniquely generated unique used ID based on the SHA-256 hash of a UUID count and an a key that MUST be set in the .env file prior to use.
  * @returns {Promise} A promise for a string representing the UUIDas described
**/
const uuid = async function() {
	const currentCount = await count.doc('count').get();
  if(!currentCount.exists) {
		throw new Error (500);
  }
  var cachedCount = currentCount.data().count
  var newUUID =crypto.createHash("sha256").update(String(cachedCount + config.uuid_secret)).digest("hex");
  cachedCount++;
  await count.doc('count').set({
		count: cachedCount

  })
  return newUUID;
}

module.exports = { uuid };
