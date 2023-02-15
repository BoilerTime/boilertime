//We are using express. Impot the module and configure it to run on Port3000
var express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const jwt = require('jsonwebtoken');
app.use(express.json());


initializeApp({
  // add your own config.json file
  credential: cert('./config.json')
});

const db = getFirestore();

//Route for /api. Add new event listeners as needed for new routes. 
app.get('/api', (req, res) => {
  res.send('API live!')
})

app.get('/api/posts', authenticateToken, (req, res) => {

  console.log(req.user.name);

  res.json(req.user.name);
});

app.post('/api/login', (req, res) => {

  // need to authenticate user first then jwt

  // jwt below
    
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
  //console.log('This is the accessToken ' + accessToken);

  res.json({ accessToken: accessToken });

  //console.log(req);
  //console.log('\n\n\n\n Now printing body \n\n\n\n');
  //console.log(req.body);
  //console.log(db.collection('user_profile').doc('test_user').toString());
  /*
  const cityRef = db.collection('').doc('SF');
  const doc = await cityRef.get();
  if (!doc.exists) {
      console.log('No such document!');
  } else {
      console.log('Document data:', doc.data());
  }
  */
  //res.send('The user name of this user is ' + req.body.username);
});

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
app.listen(port, () => {
  console.log(`BoilerTime live on Port: ${port}`)
})
