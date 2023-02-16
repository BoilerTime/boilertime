// We are using express. Import the module and configure it to run on port 3001
var express = require('express');
require('dotenv').config({path: '../.env'});
const app = express();
// frontend runs on 3000, backend runs on 3001
const port = 3001;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const jwt = require('./components/auth/jwt');
const uuid = require('./components/auth/uuid');
const createuser = require('./components/auth/creatuser');

app.use(express.json());

//Route for /api. Add new event listeners as needed for new routes. 
app.get('/api', (req, res) => {
  res.send('API live!')
})

app.get('/api/posts', authenticateToken, (req, res) => {
  console.log(req.user.name);
  res.json(req.user.name);
});

app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  jwt.authenticate({ username, password }).then(user => {
    res.json({ accessToken: accessToken, firstname: firstname });
  }).catch(err => {
    console.log(err)
    res.sendStatus(401);
  });
});

app.post('./api/createuser', (req, res) => {
   console.log(createuser.createuser(req.body));
})
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
  console.log(`BoilerTime API listening on port ${port}!`)
})
