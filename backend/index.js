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
const deleteuser = require('./components/auth/deleteuser');
const utils = require('./components/utils/utils.js');
const verifyaccount = require('./components/auth/verifyaccount');
const password = require('./components/auth/password');
const schedule = require('./components/schedule/schedule');
const getSchedule = require('./components/schedule/getschedule');
const saveSchedule = require('./components/schedule/saveschedule');

const courseRatings = require('./components/ratings/courses');
const classroomRatings = require('./components/ratings/classrooms');
const taRatings = require('./components/ratings/tas');
const optimizer = require('./components/optimizer/optimizer');
const group = require('./components/groups/group');
const { JavaCaller } = require("java-caller");
const java = new JavaCaller({
  jar: "../btime.jar"
});

//Data scraper imports
const purdueio = require('./components/datasources/purdueios.js');
const boilergrades = require('./components/datasources/boilergrades.js');
const path = require('path');

app.use(express.json());

/* REMOVE ON PRODUCTION */
/* REMOVE ON PRODUCTION */
/* REMOVE ON PRODUCTION */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
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

app.post('/api/auth/user', jwt.authenticateToken, (req, res) => {
  res.json({authenticationToken: req.user.accessToken, refreshToken: req.user.refreshToken, user_id: req.user.user_id});
});
/*
 * This function updates a user profile
 * @param {string} user_id - user_id of user we want to update
 * @param {string} grad_month - grad month user is graduating
 * @param {string} grad_year - grad year student is graduating
 * @param {string} firstname - firstname of the user
 * @param {boolean} isGradStudent - whether user is a graduate student or not
 */
app.post('/api/update/profile', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const grad_month = req.body.grad_month;
    const grad_year = req.body.grad_year;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const isGradStudent = req.body.is_grad_student;
    const studentClass = utils.getStudentClass(grad_year, grad_month);
    //console.log(user_id + classification_year + firstname + lastname);
    const classification_year = utils.getStudentClass(grad_year, grad_month);
    utils.updateProfile(user_id, grad_month, grad_year, classification_year, firstname, lastname, isGradStudent);
    res.json({ accessToken: req.user.accessToken, refreshToken: req.user.refreshToken, user_id: req.user.user_id });
  }
});

/*
 * This function gets a user profile
 * @param {string} user_id - user_id of user we want to get 
 */
app.post('/api/get/profile', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    try {
      resObj = await utils.getUserProfile(user_id);
      res.json({ firstname: resObj.firstname, lastname: resObj.lastname, grad_month: resObj.grad_month, grad_year: resObj.grad_year, is_grad_student: resObj.is_grad_student, accessToken: req.user.accessToken});
    } catch {
      res.sendStatus(401);
    }
  }
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
    console.log("Logged in: " + email)
    res.json({ accessToken: accessToken, refreshToken: refreshToken, user_id: user_id, dark_mode: dark_mode });
  }).catch(err => {
    console.error(err)
    res.sendStatus(401);
  });
});

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.RESET);

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
      html: `<a href="http://localhost:3000/auth/resetpassword?user_id=${cryptr.encrypt(user_id)}">Reset Password</a>`
    }
    sendEmail.sendEmail({ mailOptions });
    res.sendStatus(200);
  }).catch(err => {
    console.error(err)
    res.sendStatus(401);
  });
});

app.get('/api/searchnew', (req, res) => {
  res.sendFile(path.join(__dirname, 'classes.json'));
})

app.get('/api/classroomsnew', (req, res) => {
  res.sendFile(path.join(__dirname, 'classrooms.json'));
})

app.get('/api/professorsnew', (req, res) => {
  res.sendFile(path.join(__dirname, 'professors.json')); 
})

app.get('/api/tasnew', (req, res) => {
  res.sendFile(path.join(__dirname, 'tas.json'));
})

app.get('/api/buildingsnew', (req, res) => {
  res.sendFile(path.join(__dirname, 'buildings.json'));
})

/**
 * Encrypts User ID
 * @param {string} user_id - user_id
 */
app.post('/api/encryptuserid', (req, res) => {
  const user_id = req.body.user_id;
  const encrypted = cryptr.encrypt(user_id);
  res.json({ user_id: encrypted });
});

/**
 * Update Password Given User ID and Password
 * @param {string} user_id - The user_id of the user that wants to update their password
 * @param {string} password - The password
 */
app.post('/api/resetpassword', (req, res) => {
  const user_id = req.body.user_id;
  const new_password = req.body.password;
  password.updatePassword({ user_id, new_password }).then( (password) => {
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
app.post('/api/ratemyprofessor', (req, res) => {
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
app.post('/api/search', (req, res) => {
  utils.getClassesFromDept(req.body.dept).then( array => {
    res.json({classes: array})
  }).catch(err => {
    console.log(err)
    res.sendStatus(500);
  })
})

app.post('/api/createuser', (req, res) => {
  createuser.createuser(req.body).then((user) => {
    console.log(`Created user: ${req.body.email}`)
    res.json({"user_id": user.user_id, email: req.body.email, firstname: req.body.firstname});
  }).catch(err => {
    console.log(err)
    res.sendStatus(err.error || 500);
  });
})

app.post('/api/deleteuser', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    await deleteuser.deleteAccount(req.body.user_id).then(async (user) => {
      console.log(`Deleted user: ${req.body.user_id}`)
      res.json(user);
    }).catch(err => {
      console.log(err)
      res.sendStatus(500);
    });
  }
})

app.post('/api/optimizedschedule', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    await getSchedule.getSchedule(req.body.user_id).then(async (schedule) => {
      await utils.addSchedulesCount();
      res.send({...schedule, accessToken: req.user.accessToken});
    }).catch(err => {
      console.log(err)
      res.sendStatus(err.error || 500);
    });
  }
})

app.post('/api/groupschedules', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else if (!await group.inGroup(req.body.user_id, req.body.group_id, req.body.friend_id)) {
    res.sendStatus(403);
  } else {
    await getSchedule.getSchedule(req.body.friend_id).then(async (schedule) => {
      res.send({...schedule, accessToken: req.user.accessToken});
    }).catch(err => {
      console.log(err)
      res.sendStatus(err.error || 500);
    });
  }
})

app.post('/api/get/term/optimizedschedule', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    await getSchedule.getScheduleTerm(req.body.user_id, req.body.term_id).then(async (schedule) => {
      res.send({...schedule, accessToken: req.user.accessToken});
    }).catch(err => {
      console.log(err)
      res.sendStatus(err.error || 500);
    });
  }
})

app.post('/api/createschedule', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    return res.sendStatus(418);
  }
  else {
    console.log(req.body);
    await schedule.addClasses(req.body).then((input) => {
      console.log("Schedule Added to Database")
    }).catch(err => {
      console.error(err)
      return res.sendStatus(500);
    });

    const optionalClasses = req.body.optional_classes;
    const requiredClasses = req.body.required_classes;
    const user_id = req.body.user_id;
    const classes = requiredClasses.concat(optionalClasses);

    // save previous schedule
    await optimizer.optimizeSchedule(req.body).then((data)=> {
      console.log("Saved!");
      // if no error: class counterdecrement using previous schedule (don't need to await)
      //class counter increment
      return res.json({accessToken: req.user.accessToken, schedule: data});
    }).catch((err) => {
      console.log(err)
      return res.sendStatus(500);
    });
  }
});

app.get('/api/hotclasses', async (req, res) => {
  await schedule.hotClasses().then((data) => {
    res.json(data);
  }).catch(err => {
    console.log(err)
    res.sendStatus(500);
  });
})

app.post('/api/takentogether', async (req, res) => {
  await schedule.takenTogether(req.body.class).then((data) => {
    res.json(data);
  }).catch(err => {
    console.log(err)
    res.sendStatus(500);
  });
})


app.post('/api/saveoptimizedschedule', async (req, res) => {
  console.log("Saving!")
  console.log(req.body);
  const prev_schedule = await schedule.getGeneratedSchedule(req.body.user_id);
  await saveSchedule.saveSchedule(req.body.user_id, req.body.data);
  schedule.classCounterDecrement(req.body.user_id, prev_schedule).then((input) => {
    console.log("Class Counter Decremented")
    schedule.classCounterIncrement(req.body.user_id, req.body.data.schedule).then((input) => {
      console.log("Class Counter Incremented")
    }).catch(err => {
      console.error(err)
      return res.sendStatus(500);
    });
  }).catch((err) => {
    console.error(err)
    return res.sendStatus(500);
  });
  res.sendStatus(200);
})


app.post('/api/saveschedule', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    console.log(req.body);
    await schedule.addClasses(req.body).then((input) => {
      console.log("Schedule Added to Database")
      res.json({accessToken: req.user.accessToken});
    }).catch(err => {
      console.error(err)
      res.sendStatus(500);
    });
  }
});

app.post('/api/getclasses', async (req, res) => {
  await schedule.getClasses(req.body.user_id).then((classes) => {
    res.send(classes);
  }).catch(err => {
    console.log(err)
    res.sendStatus(500);
  });
})

/**
 * Add bookmark given bookmark and user_id
 * @param {string} user_id - The user_id of the user that wants to update their bookmark
 * @param {string} class_name - The class that is being added to bookmark
 */
app.post('/api/addbookmark', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const class_name = req.body.class_name;
    utils.addBookmark(user_id, class_name).then(user => {
      console.log(`Added Bookmark ${class_name}`)
      res.json({ bookmarks: bookmarks, accessToken: req.user.accessToken });
    }).catch(err => {
      console.error(err)
      res.sendStatus(500)
    });
  }
});

/**
 * Remove bookmark given bookmark and user_id
 * @param {string} user_id - The user_id of the user that wants to update their bookmark
 * @param {string} class_name - The class that is being removed from bookmarks
 */
app.post('/api/removebookmark', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const class_name = req.body.class_name;
    utils.reomveBookmark(user_id, class_name).then(user => {
      console.log(`Removed Bookmark ${class_name}`)
      res.json({ bookmarks: bookmarks, accessToken: req.user.accessToken });
    }).catch(err => {
      console.error(err)
      res.sendStatus(500)
    });
  }
});

/**
 * Get the bookmarks given user_id
 * @param {string} user_id - The user_id of the user that wants to update their bookmark
 */
app.post('/api/getbookmarks', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  console.log('THIS IS THE HEADER ' + authenticationHeader);
  console.log('THIS IS THE HEWADER ' + req.headers);
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    utils.getBookmarks(user_id).then(user => {
      console.log("Retrieved Bookmarks from Database")
      res.json({ bookmarks: bookmarks, accessToken: req.user.accessToken });
    }).catch(err => {
      console.error(err)
      res.sendStatus(500)
    });
  }
});

app.post('/api/verifyaccount', async (req, res) => {
  verifyaccount.verifyaccount(req.body.userID).then(async (user) => {
    await utils.addUsersCount();
    res.json(user);
  }).catch(err => {
    console.error(err);
    res.sendStatus(err || 500);
  })
})


/*
 * Call for getting all ratings user has made for courses 
 * @param {string} user_id - ID of user
 */
app.post('/api/get/user_ratings/courses', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const authenticationHeader = req.headers['authorization'];
    const token = authenticationHeader && authenticationHeader.split(' ')[1];
    if (await jwt.checkGuest(token)) {
      console.log('this is access token ' + req.user.accessToken);
      //res.json({ guest: 'guest', access_token: req.user.accessToken});
      res.sendStatus(418);
    }
    else {
      const user_id = req.body.user_id;
      courseRatings.getUserRatings(user_id).then((jsonObj) => {
        res.json({ ...jsonObj, accessToken: req.user.accessToken });
      });
    }
  }
});

/*
 * Call for getting ratings for certain courses
 * Guest ALLLOWED
 * @param {string} course - Name of the course (ex. CS30700) 
 */
app.post('/api/get/course_ratings/courses', async (req, res) => {
  const course_name = req.body.course_name;
  resObj = await courseRatings.getCourseRatings(course_name);
  res.json(resObj);
});

/*
 * Call for adding a course rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 * @param {number} prequisite_strictness - Rating of how strict the prequisites are out of 5 at rating[0]
 * @param {number} pace - Rating of how the pace of material covered is out of 5 at rating[1]
 * @param {number} depth - Rating of deep the material covered is out of 5 at rating[2]
 */
app.post('/api/add/ratings/courses', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    console.log(req.body)
    const course = req.body.course;
    const user_id = req.body.user_id;
    const prequisiteStrictness = req.body.prequisite_strictness;
    const pace = req.body.pace;
    const depth = req.body.depth;
    const explanation = req.body.explanation;
    result = await courseRatings.addUserRating(user_id, course, prequisiteStrictness, pace, depth, explanation);
    if (!result) {
      //console.log('here sending bad status');
      res.sendStatus(409);
    }
    else {
      //console.log('here sending good status');
      await utils.addRatingsCount();
      res.json({ accessToken: req.user.accessToken });
    }
  }
});


/*
 * Call for editing a course rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 * @param {number} prequisite_strictness - Rating of how strict the prequisites are out of 5 at rating[0]
 * @param {number} pace - Rating of how the pace of material covered is out of 5 at rating[1]
 * @param {number} depth - Rating of deep the material covered is out of 5 at rating[2]
 */
app.post('/api/edit/ratings/courses', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const course = req.body.course;
    const user_id = req.body.user_id;
    const prequisiteStrictness = req.body.prequisite_strictness;
    const pace = req.body.pace;
    const depth = req.body.depth;
    const explanation = req.body.explanation;
    //console.log('ADD USER ' + await courseRatings.addUserRating(user_id, course, prequisiteStrictness, pace, depth) + ' this is the value of add user');
    await courseRatings.editUserRating(user_id, course, prequisiteStrictness, pace, depth, explanation).then(() => {
      res.json({ accessToken: req.user.accessToken });
    }).catch((err)=> {
      console.log(err)
      res.sendStatus(500)
    })
  }
});

/*
 * Call for editing a course rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} course - Name of the course they are rating
 */
app.post('/api/delete/ratings/courses',jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const course = req.body.course;
    const user_id = req.body.user_id;
    //console.log('ADD USER ' + await courseRatings.addUserRating(user_id, course, prequisiteStrictness, pace, depth) + ' this is the value of add user');
    await courseRatings.deleteUserRating(user_id, course).then(async () => {
      await utils.decrementRatingsCount();
      res.json({ accessToken: req.user.accessToken });
    }).catch((err)=> {
      console.log(err)
      res.sendStatus(500)
    });
  }
});

/*
 * Call for getting all ratings user has made for classrooms
 * @param {string} user_id - ID of user
 */
app.post('/api/get/user_ratings/classrooms', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    classroomRatings.getUserRatings(user_id).then((jsonObj) => {
      res.json({ ...jsonObj, accessToken: req.user.accessToken });
    });
  }
});

/*
 * Call for adding a classroom rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} classroom - Name of the clasroom they are rating
 * @param {number} access_conv - Rating of how convenient the access is out of 5 at rating[0]
 * @param {number} seating_quality - Rating of seating quality out of 5 at rating[1]
 * @param {number} technology_avail - Rating of available technology out of 5 at rating[2]
 */
app.post('/api/add/ratings/classrooms', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const classroom = req.body.classroom;
    const access_conv = req.body.access_conv;
    const seating_quality = req.body.seating_quality;
    const technology_avail = req.body.technology_avail;
    const explanation = req.body.explanation;
    result = await classroomRatings.addClassroomRating(user_id, classroom, access_conv, seating_quality, technology_avail, explanation);
    if (result) {
      await utils.addRatingsCount();
      res.json({accessToken: req.user.accessToken });
    }
    else {
      res.sendStatus(409);
    }
  }
});

/*
 * Call for editing a classroom rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} classroom - Name of the clasroom they are rating
 * @param {number} access_conv - Rating of how convenient the access is out of 5 at rating[0]
 * @param {number} seating_quality - Rating of seating quality out of 5 at rating[1]
 * @param {number} technology_avail - Rating of available technology out of 5 at rating[2]
 */
app.post('/api/edit/ratings/classrooms', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const classroom = req.body.classroom;
    const access_conv = req.body.access_conv;
    const seating_quality = req.body.seating_quality;
    const technology_avail = req.body.technology_avail;
    const explanation = req.body.explanation;
    await classroomRatings.editClassroomRating(user_id, classroom, access_conv, seating_quality, technology_avail, explanation).then(() => {
      res.json({accessToken: req.user.accessToken });
    }).catch((err)=> {
      console.log(err)
      res.sendStatus(500)
    })
  }
});

/*
 * Call for deleting a classroom rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} classroom - Name of the clasroom they are rating
 */
app.post('/api/delete/ratings/classrooms', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const classroom = req.body.classroom;
    await classroomRatings.deleteClassroomRating(user_id, classroom).then(async () => {
      await utils.decrementRatingsCount();
      res.json({accessToken: req.user.accessToken });
    }).catch((err)=> {
      console.log(err)
      res.sendStatus(500)
    });
  }
});

/*
 * Call for getting ratings for certain classrooms 
 * @param {string} classroom - Name of the classroom (ex. SMTH108) 
 */
app.post('/api/get/classroom_ratings/classrooms', (req, res) => {
  const classroomName = req.body.classroom;
  classroomRatings.getClassroomRatings(classroomName).then((jsonObj) => {
    res.json(jsonObj);
  });
});

/*
 * Call for getting all ratings user has made for TA's
 * @param {string} user_id - ID of user
 */
app.post('/api/get/user_ratings/tas', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    taRatings.getUserRatings(user_id).then((jsonObj) => {
      res.json({ ...jsonObj, accessToken: req.user.accessToken });
    });
  }
});

/*
 * Call for adding a TA rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} ta - Name of the TA they are rating
 * @param {number} gradingFairness - Rating of grading fairness out of 5 at rating[0]
 * @param {number} helpfullness- Rating of helpfullness out of 5 at rating[1]
 * @param {number} questionAnswering - Rating of question answering out of 5 at rating[2]
 * @param {number} responsiveness - Rating of responsiveness out of 5 at rating[3]
 */
app.post('/api/add/ratings/tas', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const ta = req.body.ta;
    const gradingFairness = req.body.grading_fairness;
    const questionAnswering = req.body.question_answering;
    const responsiveness = req.body.responsiveness;
    const explanation = req.body.explanation;
    result = await taRatings.addUserRating(user_id, ta, gradingFairness, questionAnswering, responsiveness, explanation);
    if (result) {
      await utils.addRatingsCount();
      res.json({ accessToken: req.user.accessToken });
    }
    else {
      res.sendStatus(409);
    }
  }
});

/*
 * Call for editing a TA rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} ta - Name of the TA they are rating
 * @param {number} gradingFairness - Rating of grading fairness out of 5 at rating[0]
 * @param {number} helpfullness- Rating of helpfullness out of 5 at rating[1]
 * @param {number} questionAnswering - Rating of question answering out of 5 at rating[2]
 * @param {number} responsiveness - Rating of responsiveness out of 5 at rating[3]
 */
app.post('/api/edit/ratings/tas', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const ta = req.body.ta;
    const gradingFairness = req.body.grading_fairness;
    const questionAnswering = req.body.question_answering;
    const responsiveness = req.body.responsiveness;
    const explanation = req.body.explanation;
    await taRatings.editUserRating(user_id, ta, gradingFairness, questionAnswering, responsiveness, explanation).then(() => {
      res.json({ accessToken: req.user.accessToken });
    }).catch((err)=> {
      console.log(err)
      res.sendStatus(500)
    })
  }
});

/*
 * Call for deleting a TA rating
 * @param {string} user_id - ID of the user who is rating
 * @param {string} ta - Name of the TA they are rating
 */
app.post('/api/delete/ratings/tas', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const ta = req.body.ta;
    await taRatings.deleteUserRating(user_id, ta).then(async () => {
      await utils.decrementRatingsCount();
      res.json({ accessToken: req.user.accessToken });
    }).catch((err)=> {
      console.log(err)
      res.sendStatus(500)
    })
  }
});

/*
 * Call for getting ratings for certain TA 
 * @param {string} ta - Name of the TA
 */
app.post('/api/get/ta_ratings/tas', (req, res) => {
  const ta = req.body.ta;
  taRatings.getTARatings(ta).then((jsonObj) => {
    res.json(jsonObj);
  });
});


/*
 * Call for getting an average gpa from professor
 * @param {string} prof_name - Name of the professor of the class
 * @param{string} class_name - Name of the class averageGPA is wanted for
 */
app.post('/api/getgpa', async (req, res) => {
  const prof_name = req.body.prof_name;
  const class_name = req.body.class_name;
  console.log('Retrieving for ' + prof_name + ' ' + class_name)
  const averageGPA = await boilergrades.getAverageGPA(prof_name, class_name);
  if (averageGPA === undefined) {
    // status 404 could not find class
    res.sendStatus(404);
  }
  else {
    res.send({ averageGPA: averageGPA });
  }

  /* This call is to write professor4s to db, already done.
    boilergrades.writeProfessors();
    */

});

/**
 * Call for getting an overall gpa from professor
 * @param {string} prof_name - Name of the professor of the class
 */
app.post('/api/getoverall_gpa', async (req, res) => {
  const prof_name = req.body.prof_name;
  console.log('Retrieving for ' + prof_name)
  const overallGPA = await boilergrades.getOverallGPA(prof_name);
  if (overallGPA === undefined) {
    // status 404 could not find class
    res.sendStatus(404);
  }
  else {
    res.send({ overall_gpa: overallGPA });
  }

  /* This call is to write professor4s to db, already done.
    boilergrades.writeProfessors();
    */

});

/**
 * Call for adding a flag to a rating
 * @param {string} user_id - The user_id associated with the rating to flag
 * @param {string} type - The type of rating to flag (course, classroom, or ta)
 * @param {string} name - THe name of the course, classroom, ta (CS30700, LWSNB160, Chirayu Garg)
 */
app.post('/api/add/flag', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const type = req.body.type;
    const user_id = req.body.user_id;
    const name = req.body.name
    jsonObj = await utils.addRatingFlag(type, user_id, name)

    if (jsonObj === undefined) {
      console.log('jsonObject is undefined');
      // bad request
      res.sendStatus(400);
    }
    else {
      await sendEmail.sendEmailWhenFlagged(type, name, user_id, jsonObj.flag_count);
      res.json({...jsonObj, accessToken: req.user.accessToken});
    }
  }
});

/**
 * Call for creating a guest
 * @returns {string} access token - The access token of guest
 */
app.post('/api/guest', async (req, res) => {
  jwt.createGuest().then(user => {
    //console.log(user);
    //console.log(accessToken);
    console.log(user);
    res.json(user);
  }).catch(err => {
    console.log("error");
    console.error(err)
    res.sendStatus(401);
  });
});

app.listen(port, () => {
  console.log(`BoilerTime API listening on port ${port}!`)
})

/**
 * Call for creating group
 * @param {string} user_id - The user_id associated with the owner of the group
 * @param {string} group_name - The name of the group\
 * @returns {string} group_id - The id of the group
 */
app.post('/api/creategroup',jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const group_name = req.body.group_name;
    await group.createGroup(user_id, group_name).then((group_id) => {
      console.log(group_name + ' created with id ' + group_id)
      res.json({group_id: group_id, accessToken: req.user.accessToken});
    }).catch((err) => {
      console.log(err);
      res.sendStatus(err.message);
    });
  }
});

/**
 * Call for joining group
 * @param {string} user_id - The user_id associated with the owner of the group
 * @param {string} group_id - The id of the group
 * @returns {string} group_name - The name of the group
 */
app.post('/api/joingroup', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    await group.joinGroup(user_id, group_id).then((group_name) => {
      console.log(user_id + ' joined ' + group_name );
      res.json({group_name: group_name, accessToken: req.user.accessToken});
    }).catch((err) => {
      console.log(err);
      res.sendStatus(err.message);
    });
  }
});

/**
 * Call for getting groups of a user
 * @param {string} user_id - The user_id associated with the owner of the group
 * @returns {string} group_name - The name of the group
 */
app.post('/api/groups', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    await group.getGroups(user_id).then((groups) => {
      res.json({groups: groups, accessToken: req.user.accessToken});
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  }
});

/**
 * Call for getting groups of a user
 * @param {string} group_id - The user_id associated with the owner of the group
 * @returns {JSON} group - group info
 */
app.post('/api/group', async (req, res) => {
  const group_id = req.body.group_id;
  await group.getGroup(group_id).then((groups) => {
    res.json(groups);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

/**
 * Call for leaving group
 * @param {string} user_id - The user_id associated with the owner of the group
 * @param {string} group_id - The id of the group
 * @returns {string} group_name - The name of the group
 */
app.post('/api/leavegroup', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    await group.leaveGroup(user_id, group_id).then(() => {
      res.json({accessToken: req.user.accessToken});
    }).catch((err) => {
      console.log(err);
      res.sendStatus(err.message);
    });
  }
});

/**
 * Call for removing group
 * @param {string} user_id - The user_id associated with the owner of the group
 * @param {string} group_id - The id of the group
 * @returns {string} group_name - The name of the group
 */
app.post('/api/removegroup', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    await group.removeGroup(user_id, group_id).then(() => {
      res.json({accessToken: req.user.accessToken});
    }).catch((err) => {
      console.log(err);
      res.sendStatus(err.message);
    });
  }
});


/*
 * Call for getting the building name from Short Code
 * @param {string} room - The user_id associated with the rating to flag
 */
app.post('/api/building', async (req, res) => {
  var room = req.body.room;
  if (room == undefined) {
    res.sendStatus(404);
  } else {
    room = room.split(" ")[0]
    await utils.getBuildingName(room).then((building) => {
      if (building === undefined) {
        console.log('building is undefined')
        res.sendStatus(404);
      } else {
        console.log('building is ' + building)
        res.json({ building: building });
      }
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500);
      return;
    });
  }
});

app.post('/api/get/num_users', async (req, res) => {
  res.json({ num_users: await utils.getNumUsers() });
});

app.post('/api/get/num_schedules', async (req, res) => {
  res.json({ num_schedules: await utils.getNumSchedules() });
});

app.post('/api/get/num_ratings', async (req, res) => {
  res.json({ num_ratings: await utils.getNumRatings() });
});

app.post('/api/add/user_count', jwt.authenticateToken, async (req, res) => {
  await utils.addUsersCount();
  res.sendStatus(200);
});

app.post('/api/add/schedule_count', jwt.authenticateToken, async (req, res) => {
  await utils.addSchedulesCount();
  res.sendStatus(200);
});

app.post('/api/add/ratings_count', jwt.authenticateToken, async (req, res) => {
  await utils.addRatingsCount();
  res.sendStatus(200);
});

/*
 * Call for getting all user_schedules
 * @param {string} room - The user_id of the user
 */
app.post('/api/get/user_schedules', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    var user_id = req.body.user_id;
    await getSchedule.getAllUserSchedules(user_id).then((jArray) => {
      res.json(jArray);
    }).catch((err) => {
      console.error(err)
    });
  }
});
/*
 * Call for getting the current theme as dictated by the database
 * @param {string} user_id - The user_id associated with the current session
 */

app.post('/api/get/darkmode', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    darkMode = await utils.getDarkMode(user_id);
    res.json({ dark_mode: darkMode });
  }
});

/*
 * Call for setting the current theme as dictated by the database
 * @param {string} user_id - The user_id associated with the current session
 * @param {string} dark_mode - The dark mode boolean true or false
 */
app.post('/api/set/darkmode', jwt.authenticateToken, async (req, res) => {
  const authenticationHeader = req.headers['authorization'];
  const token = authenticationHeader && authenticationHeader.split(' ')[1];
  if (await jwt.checkGuest(token)) {
    // if guest send 418
    res.sendStatus(418);
  }
  else {
    const user_id = req.body.user_id;
    const darkMode = req.body.dark_mode;
    await utils.setDarkMode(user_id, darkMode);
    console.log('Changed Darkmode to ' + darkMode);
    res.sendStatus(200);
  }
});

app.post('/api/get/classmates', jwt.authenticateToken, async (req, res) => {
  const user_id = req.body.user_id;
  const course = req.body.course;
  names = await schedule.getClassMates(user_id, course);
  res.json(names);
});

module.exports = app;
