require('dotenv').config({path: '../.env'});
require('../../firebase')
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const professorList = db.collection('professor_profile');

async function writeProfessors() {
  //console.log('this function got called');
  let instructors = await fetch('https://boilergrades.com/api/indexes')
  instructors = await instructors.json();
  //console.log(instructors + ' printing instrcutors ');
  // instructors[0] = null, so we start at index 1
  for (let i = 1177; i < instructors.length; i++) {
    //for (let i = 1; i < instructors.length; i++) {
    //console.log(instructors[i]);
    let name = instructors[i].split(',');
    //console.log(name[1].trim() + ' ' + name[0]);
    instructorID = await fetch ('https://api.purdue.io/odata/Instructors?$filter=contains(Name,%27' + name[1].trim() + ' ' + name[0] + '%27)')
    instructorID = await instructorID.json();
    //console.log(instructorID)
    try {
      //console.log((instructorID.value[0].Id) + ' VALUE ');
      professorList.doc(instructorID.value[0].Id).set({Name: instructors[i]})
    } catch (err) {
      //console.log(err);
      //console.log('professor ' + instructors[i] + ' does not have an ID')
      continue;
    }
    let courseMap = new Map();
    courseMap = await writeClasses(instructors[i]);
    //console.log(courseMap + ' < final course map');
    //console.log(courseMap.size+ " THIS IS THE LENGTH OF COURSEMAP");
    for (let [key, value] of courseMap) {
      //console.log(key + " = " + value);
      //console.log(value[3] + value[2] + " this is what the doc will be named and this is the gpa " + value[0]);
      professorList.doc(instructorID.value[0].Id).collection('classes').doc(value[3] + value[2]).set({average_gpa: value[0]});
    }
    console.log('Instructors ' + i + '/' + instructors.length + ' done');



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

async function writeClasses(instructor) {
  // instructors[0] = null, so we start at index 1
  let instructors = await fetch('https://boilergrades.com/api/indexes')
  instructors = await instructors.json();
  var coursesInARow = 1;
  // instructors[0] = null, so we start at index 1
  let courseMap = new Map();
  let classes = '';
  classes = await fetch('https://boilergrades.com/api/grades/?instructor=' + instructor); 
  classes = await classes.json();

  //console.log(classes);
  var count = Object.keys(classes).length;
  //    console.log("This is how many classes this prof has " + count + ' and this is the prof name ' + instructors[i]);
  //console.log(classes);
  var totalAvgGPA = 0.0;
  for (let j = 0; j < Object.keys(classes).length; j++) {
    //console.log(classes[i]);
    let singleClass = await classes[j];
    //singleClass = await singleClass.json();
    //console.log("\n\nThis is the single class\n" + await JSON.stringify(singleClass) + '\n');
    //if ('a_plus' in classes[i] === true)
    var a_plus = null;
    if (classes[j] === undefined) {
      continue;
    }
    //      try {
    var a_plus = (classes[j].a_plus) || '0%';
    var a = (classes[j].a) || '0%';
    var a_minus = (classes[j].a_minus) || '0%';
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
    //console.log('thi is the total -> ' + total);
    let grades = total.split('%');
    // remove last element of array since its just ''
    grades.pop();
    //console.log(grades);
    let avgGPA = 0.0;
    let sum = 0.0; 
    for (let k = 0; k < grades.length; k++) {
      sum += parseFloat(grades[k]); 
      //console.log('this is the sume ' + sum);
    }
    for (let k = 0; k < grades.length; k++) {
      avgGPA += parseFloat(grades[k] / sum) * findGPA(k); 
      // console.log('avgGPA at ' + k + ' = '  + avgGPA);
    }
    avgGPA = Number((avgGPA).toFixed(2));
    //console.log('total avgGPA = ' + avgGPA);
    //console.log(parseFloat(grades[0]) + parseFloat(grades[1]) + ' a_plus + a');
    if (courseMap.has(classes[j].title)) {

      //console.log('multiplying prev avg gpa = ' + courseMap.get(classes[j].title)[0] + " with old counter " + courseMap.get(classes[j].title)[1] + " and adding this gpa " + avgGPA + " and divide it by new counter " + (courseMap.get(classes[j].title)[1] + 1)  + " and this all equals = " + (courseMap.get(classes[j].title)[0]*courseMap.get(classes[j].title)[1] + avgGPA) / (courseMap.get(classes[j].title)[1] + 1));
      courseMap.set(classes[j].title, [Number(((courseMap.get(classes[j].title)[0]*courseMap.get(classes[j].title)[1]) + avgGPA) / (courseMap.get(classes[j].title)[1] + 1)).toFixed(2),  (courseMap.get(classes[j].title)[1] + 1), classes[j].course_num, classes[j].subject]);
    }
    else {
      courseMap.set(classes[j].title, [avgGPA, 1, classes[j].course_num, classes[j].subject]);
    }
    //console.log(courseMap.size);
    //console.log([avgGPA, 0] + " < TESTING");
    //console.log(courseMap.get(classes[j].title) + " current map for " + classes[j].course_num);
  }
  //let classesTurk = await fetch('https://boilergrades.com/api/grades/?instructor=' + instructors[2084]); 
  //classesTurk = await classesTurk.json();
  //console.log(classesTurk)
  testArr = ['3.3', '13.2', '10.1', '7.1', '12.5', '5.7', '5.6', '14.0', '3.7', '1.5', '7', '2.1'];
  testGPA = 0.0;
  for (let k = 0; k < testArr.length; k++) {
    testGPA += parseFloat(testArr[k] / 100) * findGPA(k); 
    // console.log('avgGPA at ' + k + ' = '  + avgGPA);
  }
  return courseMap;
  //console.log('print testGPA ' + testGPA);
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

