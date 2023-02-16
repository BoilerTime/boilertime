require('dotenv').config({path: '../.env'});
require('../../firebase')
const emailvalidator = require('email-validator');
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore'); 
const db = getFirestore()
const profiles = db.collection('user_profiles');

const createuser = async function(profile) {
    //If the request is malformed, throw an error right away
    if((!(profile.email && profile.firstname && profile.lastname))) {
	let response = new Error();
	response.error = 400;
	throw response;
	//throw new Error({'error': '400'});
    }

    //If the user has not provided a valid email address, this is an illegal request to the server
    if(!(emailvalidator.validate(profile.email) && profile.email.toLowerCase().endsWith('@purdue.edu'))) {
	let response = new Error();
	response.error = 403;
	throw response;
	//throw new Error({'error': '403'});
    }

    if(findExistingUsers(profile.email)) {
	let response = new Error();
	response.error = 409;
	throw response;
    }
    return "success!";
}

const findExistingUsers = async function (email) {
    const existingUsers = await profiles.where('email', '==', email);
    //If there are existing users with the same email, return false
    return existingUsers.size > 0;
}

module.exports = {createuser};
