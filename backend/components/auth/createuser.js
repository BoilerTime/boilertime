require('dotenv').config({path: '../.env'});
require('../../firebase')

//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore'); 
const db = getFirestore()
const profiles = db.collection('user_profiles');

const createuser = async function(profile) {
    if(!(profile.email && profile.firstname && profile.lastname)) {
	return new Error(403);
    }
    return "success!";
}

module.exports = {createuser};
