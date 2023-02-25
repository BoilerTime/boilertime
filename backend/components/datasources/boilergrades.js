require('dotenv').config({path: '../.env'});
require('../../firebase')
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const classLists = db.collection('classes');

async function writeProfessors() {
  console.log('this function got called');
  let instructors = await fetch('https://boilergrades.com/api/indexes')
  instructors = await instructors.json();
  //console.log(instructors + ' printing instrcutors ');
  // instructors[0] = null, so we start at index 1
  for (let i = 1; i < 10; i++) {
    console.log(instructors[i]);
  }

  /*
  let instructor = req.query.instructor;
  let course = req.query.course;
  if (instructor) {
    axios.get('https://boilergrades.com/api/grades?instructor=' + instructor).then(resp => {
      for (var i = 0; i < resp.length; i++) {
        console.log(resp[i]);
      }
    //res.json({data: resp.data});
    });
  }
  else if (course) {
    axios.get('https://boilergrades.com/api/grades?course=' + course).then(resp => {
    //res.json({data: resp.data});
    });
  }
  else {
    // send error bad request 400
    res.sendStatus(400);
  }
  */
  }

async function writeClasses() {
  // instructors[0] = null, so we start at index 1
  let instructors = await fetch('https://boilergrades.com/api/indexes')
  instructors = await instructors.json();
  var coursesInARow = 1;
  // instructors[0] = null, so we start at index 1
  for (let i = 1; i < 3; i++) {
    let classes = '';
    if (i == 1) { 
      classes = await fetch('https://boilergrades.com/api/grades/?instructor=' + instructors[i]); 
      classes = await classes.json();
    }
    else {
      classes = await fetch('https://boilergrades.com/api/grades/?instructor=' + 'Turkstra, Jeffrey A.'); 
      classes = await classes.json();

    }
    //console.log(classes);
    var count = Object.keys(classes).length;
    console.log(count + " <-- this is the count");
    //    console.log("This is how many classes this prof has " + count + ' and this is the prof name ' + instructors[i]);
    console.log(classes);
    var totalAvgGPA = 0.0;
    for (let j = 0; j < Object.keys(classes).length; j++) {
      //console.log(classes[i]);
      console.log(j + ' <-- this is j');
      let singleClass = await classes[j];
      //singleClass = await singleClass.json();
      console.log("\n\n This is the single class \n\n" + await JSON.stringify(singleClass));
      //if ('a_plus' in classes[i] === true)
      var a_plus = null;
      if (classes[j] === undefined) {
        continue;
      }
      //      try {
      var a_plus = (classes[j].a_plus) || '0%';
      var a = (classes[j].a) || '0%';
      var a_minus = (classes[j].a_mjnus) || '0%';
      var b_plus = (classes[j].b_plus) || '0%';
      var b = (classes[j].b) || '0%';
      var b_minus = (classes[j].b_minus) || '0%';
      var c_plus = (classes[j].c_plus) || '0%';
      var c = (classes[j].c) || '0%';
      var c_minus = (classes[j].c_minus) || '0%';
      var d_plus = (classes[j].d_plus) || '0%';
      var d = (classes[j].d) || '0%';
      var d_minus = (classes[j].d_minus) || '0%';
      var f = (classes[j].f) || '0%';
      /*
      } catch (err) {
        console.log('something happened!')
      }
      */
      let total = a_plus+a+a_minus+b_plus+b+b_minus
        +c_plus+c+c_minus+d_plus+d+d_minus
        +f;
      console.log('thi is the total -> ' + total);
      let grades = total.split('%');
      // remove last element of array since its just ''
      grades.pop();
      console.log(grades);
      let avgGPA = 0.0;
      for (let k = 0; k < grades.length; k++) {
        avgGPA += parseFloat(grades[k] / 100) * findGPA(k); 
       // console.log('avgGPA at ' + k + ' = '  + avgGPA);
      }
      console.log('total avgGPA = ' + avgGPA);
      console.log(parseFloat(grades[0]) + parseFloat(grades[1]) + ' a_plus + a');
      if (j != 0) {
        if (j != Object.keys(classes).length - 1 && classes[j].course_num === classes[j+1].course_num) {
          totalAvgGPA += avgGPA;
          coursesInARow++;
        }
        else {
          console.log(totalAvgGPA / coursesInARow + " this is the total avg gpa for this course: " + classes[j].course_num+ " " + classes[j].title);
          totalAvgGPA = 0.0;
          coursesInARow = 0;
        }
      }
    }
  }
  //let classesTurk = await fetch('https://boilergrades.com/api/grades/?instructor=' + instructors[2084]); 
  //classesTurk = await classesTurk.json();
  //console.log(classesTurk)
}

function findGPA(gpa) {
  switch (gpa) {
    case 0:
      return 4;
    case 1:
      return 4;
    case 2:
      return 3.7;
    case 3:
      return 3.3;
    case 4:
      return 3;
    case 5:
      return 2.7;
    case 6:
      return 2.3;
    case 7:
      return 2;
    case 8:
      return 1.7;
    case 9:
      return 1.3;
    case 10:
      return 1;
    case 11:
      return 0.7;
    case 12:
      return 0;
  }
}

  module.exports = {writeProfessors, writeClasses};

