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
const uuid = require('./components/auth/uuid');
const createuser = require('./components/auth/createuser');
const utils = require('./components/utils/utils.js');
const verifyaccount = require('./components/auth/verifyaccount');
const schedule = require('./components/schedule/schedule');


app.use(express.json());

/* REMOVE ON PRODUCTION */
/* REMOVE ON PRODUCTION */
/* REMOVE ON PRODUCTION */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
/* REMOVE ON PRODUCTION */
/* REMOVE ON PRODUCTION */
/* REMOVE ON PRODUCTION */

//Route for /api. Add new event listeners as needed for new routes. 
/*
 * This function gets a path for /api
 */
app.get('/api', (req, res) => {
  res.send('API live!')
});

/*
 * Test function for confirming user token with the authentiacateToken method in jwt.js
 * @param {function} jwt.authenticateToken() - authenticates the token passed into it by json 
 * @param {string} email - print the email of user to test correct user
 */
app.post('/api/profile', jwt.authenticateToken, (req, res) => {
  res.json({authenticationToken: req.user.accessToken, user_id: req.user.user_id});
});

/*
 * This function lets a user login and generates a jwt token for them
 * @param {string} email - Email of user
 * @param {string} password - Hashed password of user 
 */
app.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  jwt.authenticateUser({ email, password }).then(user => {
    //console.log(user);
    //console.log(accessToken);
    console.log(`Login sucessful ${email}`)
    res.json({ accessToken: accessToken, refreshToken: refreshToken, user_id: user_id});
  }).catch(err => {
    console.error(err)
    res.sendStatus(401);
  });
});

/**
 * Sends an email to reset the password
 * @param {string} email - The email to send the password to
 */
app.post('/api/forgotpassword', (req, res) => {
  const email = req.body.email;
  //getuid
  utils.getUID({ email }).then(user => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: `${email}`,
      subject: 'Reset BoilerTime Password',
      html: `<a href="http://localhost:3000/auth/resetpassword?user_id=${user_id}">Reset Password</a>`
    }
    sendEmail.sendEmail({ mailOptions });
    res.json({user_id: user_id, email: email});
  }).catch(err => {
    console.error(err)
    res.sendStatus(401);
  });
});

/**
 * Update Password Given User ID and Password
 * @param {string} user_id - The user_id of the user that wants to update their password
 * @param {string} password - The password
 */
app.post('/api/resetpassword', (req, res) => {
  const user_id = req.body.user_id;
  const new_password = req.body.password;
  utils.updatePassword({ user_id, new_password }).then(user => {
    console.log(`Updated password to ${password}`)
    res.json({ password: password });
  }).catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
})

app.post('/api/createuser', (req, res) => {
  createuser.createuser(req.body).then((user) => {
    console.log(`Created user: ${email}`)
    res.json({"user_id": user.user_id, email: req.body.email, firstname: req.body.firstname});
  }).catch(err => {
    //console.log(JSON.stringify(err))
    res.sendStatus(err.error || 500);
  });
})

app.post('/api/createschedule', (req, res) => {
  schedule.addClasses(req.body).then((input) => {
    console.log("Schedule Added to Database")
    res.json({
      "schedule": [
        {
          "Class": "CS 180000",
          "Credits" : 4,
          "Title": "Problem Solving And Object-Oriented Programming",
          "Lecture": {
            "DaysOfWeek": ["Monday", "Wednesday", "Friday"],
            "StartTime": "16:30",
            "Duration": 110,
          },
          "Professor": "Turkstra",
          "RMP": 4.3,
          "Boiler Grades": 3.2,
        },
        {
          "Class": "CS 24000",
          "Credits" : 4,
          "Title": "Programming in C",
          "Lecture": {
            "DaysOfWeek": ["Monday", "Wednesday", "Friday"],
            "StartTime": "12:30",
            "Duration": 50,
          },
          "Professor": "Gustavo",
          "RMP": 3.3,
          "Boiler Grades": 3.6,
        },
        {
          "Class": "CS 18200",
          "Credits" : 3,
          "Title": "Foundations of Computer Science",
          "Lecture": {
            "DaysOfWeek": ["Tuesday", "Thursday"],
            "StartTime": "10:30",
            "Duration": 50,
          },
          "Professor": "Selke",
          "RMP": 2.5,
          "Boiler Grades": 3.5,
        }
      ]
    })
  }).catch(err => {
    console.error(err)
    res.sendStatus(500);
  });
})

app.post('/api/verifyaccount', (req, res) => {
  verifyaccount.verifyaccount(req.body.userID).then((user) => {
    res.json(user);
  }).catch(err => {
    //console.log(err.error);
    res.sendStatus(err || 500);
  })
})


function authenticateToken(req, res, next) {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (token == null) {
    // we don't have a token
    res.sendStatus(401);
  };
};

app.listen(port, () => {
  console.log(`BoilerTime API listening on port ${port}!`)
})
