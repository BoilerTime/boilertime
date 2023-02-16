require('dotenv').config({path: '../.env'});
require('../../firebase')
const crypto = require('crypto');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore'); 
const db = getFirestore()
const count = db.collection('uuidcount');
const config = require('../../../config.json');

const uuid = async function() {
    const currentCount = await count.doc('count').get();
    if(!currentCount.exists) {
	throw new Error (500);
    }
    var cachedCount = currentCount.data().count

    var newUUID =crypto.createHash("sha256").update(String(cachedCount + config.uuid_secret)).digest("base64");

    cachedCount++;
    await count.doc('count').set({
	count: cachedCount
    })
    return newUUID;
}

module.exports = {uuid};
