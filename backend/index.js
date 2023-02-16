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
});

//app.get('/api/:email/profile', jwt.authenticateToken, (req, res) => {
app.get('/api/profile', jwt.authenticateToken, (req, res) => {
  console.log(req.body.email);
  console.log(req.user);
  res.json(req.body.email);
});

app.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  jwt.authenticateUser({ email, password }).then(user => {
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




app.listen(port, () => {
  console.log(`BoilerTime API listening on port ${port}!`)
})
