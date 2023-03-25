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
  createGuest,
  checkGuest,
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
      return (user_id = doc.data().user_id, accessToken = access_token, refreshToken = refresh_token);
    } else {
      throw new Error("User Is Not Verified")
    }
    //return (firstname = doc.data().firstname, accessToken = jwt.sign({ sub: doc.id }, process.env.ACCESS_TOKEN, { expiresIn: '3d' }));
  });
}

/**
 * This function creates a guest token and signs it with GUEST_ACCESS
 */
async function createGuest() {
  var guest = {};
  const guestAccess = jwt.sign(guest, process.env.GUEST_ACCESS, { expiresIn: '30m' }); 

  await jwt.verify(guestAccess, process.env.GUEST_ACCESS, async (err, user) => {
    guest = user;
  }); 
  return { guest: guest, accessToken: guestAccess };
} 

/**
 * This function checks if the given token is signed wtih GUEST_ACCESS or not
 * @param {string} accessToken - access token of user 
 * @returns {boolean} guest - true if user is guest, and false if not
 */
async function checkGuest(accessToken) {
  guest = undefined;
  jwt.verify(accessToken, process.env.GUEST_ACCESS, async (err, user) => {
    if (err) {
      guest = false;
    }
    else {
      guest = true;
    }
  }); 
  return guest;
} 

/*
 * This function authenicates the user token by the token in the .env file. If they match it will not send a 403 status error
 * @param {string} user - if the tokens match we set the user to req.user so that we can use it in index.js
 */
async function authenticateToken(req, res, next) {
  console.log("HEADER " + req.headers['authorization']);
  const authenticationHeader = req.headers['authorization'];
  console.log(authenticationHeader + 'this is the auth header');
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  guest = await checkGuest(token);
  if (guest) {
    console.log('This is a guest profile');
    //res.sendStatus(418);
    req.user = {accessToken: token};
    next();
    //res.sendStatus(200);
  }
  //console.log(token);
  console.log('here after checking guest');
  if (token == null) {
    console.log('NO TOKEN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJFN UNDEFJNLDKSJFKLDSJF');
    // we don't have a token
    res.sendStatus(401);
  }
  else {
    if (!guest) {
      jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
        if (err) {
          // user doesn't have access since token is expired
          // need to implement refresh acess token to create new access token here if refresh is valid itself
          console.log('Error verifying token, checking if user still has access...');
          generateNewAccessToken({ user_id: req.body.user_id }).then((newAccessToken) => {
            //console.log(newAccessToken1 + ' newAcessToken1');
            if (newAccessToken1 === undefined) {
              console.error('No valid refresh token access denied');
              res.sendStatus(403);
            } else {
              const user2 = { user_id: req.body.user_id, accessToken: newAccessToken1 };
              req.user = user2;
              console.log('Generated a new access token, refresh token was valid.');
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
  }
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
    console.log('this is the refreshtoken ' + refresh_token);
    jwt.verify(doc.data().refresh_token, process.env.REFRESH_TOKEN, async (err, user) => {
      if (err) {
        console.error('Refresh token is present but not valid, user does not have access anymore');
        return (newAccessToken1 = undefined);
      }
      else {
        /*
        if (doc.data().refresh_token === "") {
      //console.log('here the refresh is blank used too many times');
          return (newAccessToken1 = undefined);
        }
        */
      //else {
      const user1 = { user_id: doc.data().user_id };
      console.log("\n\n MAKE NEW ACCESS TOKEN \n\n")
      newAccessToken = jwt.sign(user1, process.env.ACCESS_TOKEN, { expiresIn: '30m' });
      //doc.ref.update({ access_token: newAccessToken, refresh_token: "" });
      doc.ref.update({ access_token: newAccessToken, refresh_token: null });
      return (newAccessToken1 = newAccessToken);
      //}
    }
    });
  });
}
