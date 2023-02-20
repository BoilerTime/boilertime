require('dotenv').config({path: '../.env'});
require('../../firebase')
const emailvalidator = require('email-validator');
const uuid = require('./uuid.js');
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore'); 
const utils = require('../utils/utils.js');

const db = getFirestore()
const profiles = db.collection('user_profile');

/**
  * Create User creates a new user to enter into the database matching the parameters passed to it.
  * @param {JSON} profile - A JSON representation of the user profile. Must include the user's first name, last name, and email address. 
  * @returns {JSON} - The profile of the created user that was stored into the database. The name, email, and password will all match was was passed to the function, but there will be a new user_id field that represents the UUID that was assigned to the user upon creation. 
**/
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

    if(await utils.findExistingUsers(profile.email)) {
	let response = new Error();
	response.error = 409;
	throw response;
    }
    
    const userID = await uuid.uuid();
    const userProfile = {
	"classification_year": null,
	"email": profile.email,
	"firstname": profile.firstname,
	"isVerified": false,
	"lastname": profile.lastname,
	"password": profile.password,
	"phonenumber": null,
	"user_id": userID
    }

    await profiles.add(userProfile).then((res) => {
    	//It worked, great! Don't need to do anything, though
    }).catch((err) => {
	throw new Error().error = 500;
    })
    return userProfile;
}



module.exports = {createuser};
