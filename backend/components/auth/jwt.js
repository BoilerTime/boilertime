require('dotenv').config({path: '../.env'});
require('../../firebase.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore()
const users = db.collection('user_profile')

module.exports = {
    authenticateUser,
    updatePassword,
    authenticateToken
}

async function authenticateUser({ email, password }) {
    const profile = await users.where('email', '==', email).where('password', '==', password).get();
    profile.forEach(doc => {
      return (firstname = doc.data().firstname, accessToken = jwt.sign({ sub: doc.id }, process.env.ACCESS_TOKEN, { expiresIn: '3d' }));
    });
}

async function updatePassword({ user_id, new_password }) {
  const profile = await users.where('user_id', '==', user_id).get();
  profile.forEach(doc => {
    doc.ref.update({ password: new_password });
  });
}

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
