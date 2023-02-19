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
    updatePassword,
    authenticateToken
}

/**
* A function to receive a pair of email and password and return a JWT on successful comparison with the database.
* @param {string} email - the email of the user.
* @param {string} password - a SHA-256 hashed password.
*/
async function authenticateUser({ email, password }) {
  const profile = await users.where('email', '==', email).where('password', '==', password).get();
  //const access_token = jwt.sign(process.env.ACCESS_TOKEN, {expiresIn: '1d'});
  //const refresh_token = jwt.sign(email, process.env.REFRESH_TOKEN, {expiresIn: '1d'});

    profile.forEach(doc => {
    var user = {user_id: doc.data().user_id};
    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '15s'});
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN);
    user = {user_id: doc.data().user_id, accessToken: access_token};
    doc.ref.update({access_token: access_token});
    doc.ref.update({refresh_token: refresh_token})
    return (firstname = doc.data().firstname, accessToken = access_token, refreshToken = refresh_token);
      //return (firstname = doc.data().firstname, accessToken = jwt.sign({ sub: doc.id }, process.env.ACCESS_TOKEN, { expiresIn: '3d' }));
  });
}

async function updatePassword({ user_id, new_password }) {
  const profile = await users.where('user_id', '==', user_id).get();
  profile.forEach(doc => {
    doc.ref.update({ password: new_password });
  });
}

/*
 * This function authenicates the user token by the token in the .env file. If they match it will not send a 403 status error
 * @param {string} user - if the tokens match we set the user to req.user so that we can use it in index.js
 */
function authenticateToken(req, res, next) {
  const authenticationHeader = req.headers['authorization'];
  //console.log(authenticationHeader + 'this is the auth header');
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  //console.log(token);
  if (token == null) {
    // we don't have a token
    res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
      if (err) {
        // user doesn't have access since token is expired
        // need to implement refresh acess token to create new access token here if refresh is valid itself
        console.log('error verifying must not have matches or token is expired!!');
        generateNewAccessToken({ user_id: req.body.user_id }).then((newAccessToken) => {
            console.log(newAccessToken + ' newAcessToken');
            console.log(newAccessToken1 + ' newAcessToken1');
            if (newAccessToken1 === undefined) {
              console.log('invalid');
              res.sendStatus(403);
            }
            else {
              const user2 = {user_id: req.body.user_id, accessToken: newAccessToken1};
              req.user = user2;
              //req.headers['authorization'].split(' ')[1] = newAccessToken1;
              console.log(req.headers['authorization'].split(' ')[1]);
              console.log('just generated a new access token');
              console.log('\n\nJUST GENERATED NEW ACCESTOKEN YOU STILL HAVE ACESS!!\n\n');
              next();
            }
        });
      }
      else {
        console.log('this is the user ' + user.user_id);
        req.user = user;
        next();
      }
  });
}

async function generateNewAccessToken(user) {
    const profile = await users.where('user_id', '==', user.user_id).get();
    let newAccessToken = "";
    profile.forEach(doc => {
      if (doc.data().refresh_token === "") {
          console.log('here refresh is invalid');
          return (newAccessToken1 = undefined);
      }
      else {
        console.log('here we in line 101 with  doc.data = ' + doc.data().user_id);
        const user1 = {user_id: doc.data().user_id};
        newAccessToken = jwt.sign(user1, process.env.ACCESS_TOKEN, {expiresIn: '15s'});
        doc.ref.update({access_token: newAccessToken});
        doc.ref.update({refresh_token: ""});
        return (newAccessToken1 = newAccessToken);
      }
    });
}
