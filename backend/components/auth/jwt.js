require('dotenv').config({ path: '../.env' });
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
  if (profile.empty) {
    throw new Error("User Does Not Exist")
  }
  //const access_token = jwt.sign(process.env.ACCESS_TOKEN, {expiresIn: '1d'});
  //const refresh_token = jwt.sign(email, process.env.REFRESH_TOKEN, {expiresIn: '1d'});

  profile.forEach(doc => {
    if (doc.data().isVerified) {
      var user = { user_id: doc.data().user_id };
      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '30m' });
      const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN);
      user = { user_id: doc.data().user_id, accessToken: access_token };
      doc.ref.update({ access_token: access_token, refresh_token: refresh_token });
      return (user_id = doc.data().user_id, accessToken = access_token, refreshToken = refresh_token, dark_mode = doc.data().dark_mode);
    } else {
      throw new Error("User Is Not Verified")
    }
    //return (firstname = doc.data().firstname, accessToken = jwt.sign({ sub: doc.id }, process.env.ACCESS_TOKEN, { expiresIn: '3d' }));
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
      console.error('error verifying must not have matches or token is expired!!');
      generateNewAccessToken({ user_id: req.body.user_id }).then((newAccessToken) => {
        //console.log(newAccessToken1 + ' newAcessToken1');
        if (newAccessToken1 === undefined) {
          console.error('refresh token is invalid');
          res.sendStatus(403);
        } else {
          const user2 = { user_id: req.body.user_id, accessToken: newAccessToken1 };
          req.user = user2;
          console.log('\n\nJUST GENERATED NEW ACCESTOKEN YOU STILL HAVE ACESS!!\n\n');
          next();
        }
      });
    }
    else {
      req.user = user;
      next();
    }
  });
}

/*
 * This function generates a new access token if the refresh token is present, if not then it will return an undefined to token to force user to log in again
 * @param {Object} user - this object contains user id to match in the database and get the profile of that user. This is then used to create the access token and link it to user.user_id 
 */
async function generateNewAccessToken(user) {
  const profile = await users.where('user_id', '==', user.user_id).get();
  //console.log(profile + " this is the profile")
  //const refresh_token = await profile.data().refresh_token;
  let newAccessToken = "";
  profile.forEach(async doc => {
    const refresh_token = await doc.data().refresh_token;
    //console.log('this is the refreshtoken ' + refresh_token);
    jwt.verify(doc.data().refresh_token, process.env.REFRESH_TOKEN, async (err, user) => {
      if (err) {
        console.error('\n\nTHE USER GAVE A RANDOM REFRESH TOKEN\n\n');
        return (newAccessToken1 = undefined);

      }
      else {
        if (doc.data().refresh_token === "") {
          //console.log('here the refresh is blank used too many times');
          return (newAccessToken1 = undefined);
        }
        else {
          const user1 = { user_id: doc.data().user_id };
          newAccessToken = jwt.sign(user1, process.env.ACCESS_TOKEN, { expiresIn: '15s' });
          doc.ref.update({ access_token: newAccessToken, refresh_token: "" });
          return (newAccessToken1 = newAccessToken);
        }
      }
    });
  });
}
