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
const boilergrades = require('./components/datasources/boilergrades.js');
const verifyaccount = require('./components/auth/verifyaccount');
const schedule = require('./components/schedule/schedule');
const getSchedule = require('./components/schedule/getschedule');
const saveSchedule = require('./components/schedule/saveschedule');


//Data scraper imports
const purdueio = require('./components/datasources/purdueios.js');
//purdueio.purdueios();

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
app.get('/api/profile', jwt.authenticateToken, (req, res) => {
  const user_id = req.body.user_id;
  const grad_month = req.body.grad_month;
  const grad_year = req.body.grad_year;
  const grad_student = req.body.grad_student;
  const classification_year = req.body.classification_year;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  //console.log(user_id + classification_year + firstname + lastname);
  utils.updateProfile(user_id, classification_year, firstname, lastname);
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
    console.log(user);
    console.log(accessToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken, firstname: firstname });
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

/**
 * Query for Professor for RMP
 */
app.get('/api/ratemyprofessor', (req, res) => {
  const professor = req.body.prof_name
  utils.getProfessorRating(professor).then( teacher => {
    console.log("Found Teacher in RMP")
    res.json(teacher)
  }).catch(err => {
    console.log(err)
    res.sendStatus(500);
  })
})

/**
 * Search Query
 */
app.get('/api/search', (req, res) => {
  utils.getClassesFromDept(req.body.dept).then( array => {
    res.json({classes: array})
  }).catch(err => {
    console.log(err)
    res.sendStatus(500);
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

/* TEST ENDPOINT TO RETURN OPTIMIZED SCHEDULE STRUCTURE */
app.get('/api/optimizedschedule', (req, res) => {
  res.json({
    "schedule":
      [
        {
          "subject":"CS",
          "number":"18000",
          "creditHours":4,
          "description":"Evening exams",
          "name":"Problem Solving And Object-Oriented Programming",
          "meetings":[
            {
                "instructorName":"Srinivasa Arun Yeragudipati",
                 "startTime":"2023-02-21T20:30:00Z",
                 "duration":"PT1H50M",
                 "daysOfWeek":["Thursday"],
                 "type":"Laboratory",
                 "buildingCode":"HAAS",
                 "buildingName":"Felix Haas Hall",
                 "roomNumber":"G056"
           },
           {
                "instructorName": "Srinivasa Arun Yeragudipati",
                "startTime":"2023-02-21T20:30:00Z",
                "duration":"PT1H50M",
                "daysOfWeek":["Thursday"],
                "type":"Laboratory",
                "buildingCode":"HAAS",
                "buildingName":"Felix Haas Hall",
                "roomNumber":"G056"
            }
          ]
        },
        {
          "subject":"POL",
          "number":"30000",
          "creditHours":3,
          "description":"Evening exams",
          "name":"Introduction to Data Analytics",
          "meetings":[
            {
                "instructorName":"Eric Waltenburg",
                "startTime":"2023-02-21T10:30:00Z",
                "duration":"PT1H50M",
                "daysOfWeek":["Monday", "Wednesday", "Friday"],
                "type":"Lecture",
                "buildingCode":"HIKS",
                "buildingName":"Hicks Undergraduate Library",
                "roomNumber":"B288"
              }
          ]
        }
    ]
  })
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
          "Lecture": [{
            "DaysOfWeek": ["Monday", "Wednesday", "Friday"],
            "StartTime": "16:30",
            "Duration": 110,
          }],
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
app.get('/api/getoptimizedschedule', async (req, res) => {
  let schedule = await getSchedule.getSchedule(req.body.user_id);
  console.log(schedule)
  res.send(schedule);
})

/**
 * Add bookmark given bookmark and user_id
 * @param {string} user_id - The user_id of the user that wants to update their bookmark
 * @param {string} class_name - The class that is being added to bookmark
 */
app.post('/api/addbookmark', (req, res) => {
  const user_id = req.body.user_id;
  const class_name = req.body.class_name;
  utils.addBookmark(user_id, class_name).then(user => {
    console.log(`Added Bookmark ${class_name}`)
    res.json({ bookmarks: bookmarks });
  }).catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
})

/**
 * Remove bookmark given bookmark and user_id
 * @param {string} user_id - The user_id of the user that wants to update their bookmark
 * @param {string} class_name - The class that is being removed from bookmarks
 */
app.post('/api/removebookmark', (req, res) => {
  const user_id = req.body.user_id;
  const class_name = req.body.class_name;
  utils.reomveBookmark(user_id, class_name).then(user => {
    console.log(`Removed Bookmark ${class_name}`)
    res.json({ bookmarks: bookmarks });
  }).catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
})

/**
 * Add bookmark given bookmark and user_id
 * @param {string} user_id - The user_id of the user that wants to update their bookmark
 */
app.get('/api/getbookmarks', (req, res) => {
  const user_id = req.body.user_id;
  utils.getBookmarks(user_id).then(user => {
    console.log("Retried Bookmarks from Databse")
    res.json({ bookmarks: bookmarks });
  }).catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
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

/*
 * Call for getting an average gpa from professor 
 * @param {string} prof_name - Name of the professor of the class 
 * @param{string} class_name - Name of the class averageGPA is wanted for
 */
app.post('/api/gpa', async (req, res) => {
  const prof_name = req.body.prof_name;
  const class_name = req.body.class_name;
  const averageGPA = await boilergrades.getAverageGPA(prof_name, class_name);
  if (averageGPA === undefined) {
    // status 404 could not find class
    res.sendStatus(404);
  }
  else {
    res.send({averageGPA: averageGPA});
  }
  /* This call is to write professor4s to db, already done.
  boilergrades.writeProfessors();
  */
})  

