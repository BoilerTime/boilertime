require('dotenv').config({path: '../.env'});
const jwt = require('jsonwebtoken');
const axios = require('axios');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const { collection, query, where, getDocs } = require('firebase/firestore');

initializeApp({
  credential: cert('../config.json')
});

const db = getFirestore()
const users = db.collection('user_profile')

module.exports = {
    authenticate,
    updatePassword
}

async function authenticate({ username, password }) {
    const profile = await users.where('email', '==', username).where('password', '==', password).get();
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