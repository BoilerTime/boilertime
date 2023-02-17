require('dotenv').config({path: '../.env'});
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('../../firebase')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const users = db.collection('user_profile')

module.exports = {
    authenticateUser,
    authenticateToken
}

/**
* A function to receive a pair of email and password and return a JWT on successful comparison with the database.
* @param {string} email - the email of the user.
* @param {string} password - a SHA-256 hashed password.
*/
async function authenticateUser({ email, password }) {
    const profile = await users.where('email', '==', email).where('password', '==', password).get();
    profile.forEach(doc => {
      return (firstname = doc.data().firstname, accessToken = jwt.sign({ sub: doc.id }, process.env.ACCESS_TOKEN, { expiresIn: '3d' }));
    });
}


/*
 * This function authenicates the user token by the token in the .env file. If they match it will not send a 403 status error
 * @param {string} user - if the tokens match we set the user to req.user so that we can use it in index.js
 */
function authenticateToken(req, res, next) {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (token == null) {
    // we don't have a token
    res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        // user doesn't have access
        res.sendStatus(403);
      }
      req.user = user;
      next();
  });
}
