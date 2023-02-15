// We are using express. Import the module and configure it to run on port 3001
var express = require('express');
require('dotenv').config({path: '../.env'});
const app = express();
// frontend runs on 3000, backend runs on 3001
const port = 3001;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const jwt = require('./components/auth/jwt');
const sendEmail = require('./components/email/sendEmail')

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

app.post('/api/forgotpassword', (req, res) => {
  const email = req.body.email;
  //getuid
  sendEmail.getUID({ email }).then(user => {
    const mailOptions = {
      from: 'joshuajy03@gmail.com',
      to: `${email}`,
      subject: 'Reset BoilerTime Password',
      html: `<a href="http://localhost:3000/resetpassword?id=${user_id}">Reset Password</a>`
    }
    sendEmail.sendEmail({ mailOptions });
    res.send('Email Sent');
  }).catch(err => {
    console.log(err)
    res.sendStatus(401);
  });
});

app.post('/api/resetpassword', (req, res) => {
  const user_id = req.body.user_id;
  const new_password = req.body.password;
  jwt.updatePassword({ user_id, new_password }).then(
    res.send('Password Updated')
  ).catch(err => {
    console.log(err)
    res.sendStatus(401);
  });
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
  console.log(`BoilerTime API listening on port ${port}!`)
})