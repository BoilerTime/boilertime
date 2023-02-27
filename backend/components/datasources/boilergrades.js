require('dotenv').config({path: '../.env'});
require('../../firebase')
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const professorList = db.collection('professor_profile');


/*
 * Call for getting an average gpa from professor 
 * @param {string} prof_name - Name of the professor of the class 
 * @param{string} class_name - Name of the class averageGPA is wanted for
 * @return {number} returns the averageGPA
 */
async function getAverageGPA(prof_name, class_name) {
    let instructorID = await fetch ('https://api.purdue.io/odata/Instructors?$filter=contains(Name,%27' + prof_name + '%27)')
    instructorID = await instructorID.json();

    var averageGPA = 0.0;
    try {
      let doc = await professorList.doc(instructorID.value[0].Id).collection('classes').doc(class_name).get();
      doc = await doc.data();
      return doc.average_gpa;
    } catch (err) {
      console.log(err)
      console.log('prof+class not found in db');
      return undefined;
    }
  
}
/*
 * This function gets all professors from boilergrades api
 * Then it goes through each professors classes they have taught, and calculates the averaage gpa for each section
 * Finally we wrote all that information to the data base   
 */
async function writeProfessors() {
  let instructors = await fetch('https://boilergrades.com/api/indexes')
  instructors = await instructors.json();
  // 6696 professors in boilergrades/api/indexes
  // index 0 is null
  for (let i = 0; i < 6696; i++) {
    let name = instructors[i].split(',');
    instructorID = await fetch ('https://api.purdue.io/odata/Instructors?$filter=contains(Name,%27' + name[1].trim() + ' ' + name[0] + '%27)')
    instructorID = await instructorID.json();
    try {
      professorList.doc(instructorID.value[0].Id).set({Name: instructors[i]})
    } catch (err) {
      continue;
    }
    let courseMap = new Map();
    courseMap = await writeClasses(instructors[i], i);
    if (courseMap === undefined) {
      continue;
    }
    for (let [key, value] of courseMap) {
      if (key.indexOf('Honors') != -1) {
        console.log('honors class here ' + key);
        console.log('this is the value ' + value);
        professorList.doc(instructorID.value[0].Id).collection('classes').doc(value[3] + value[2] + '-Honors').set({average_gpa: parseFloat(value[0])});
      }
      else {
        console.log('non honors class here this is the value ' + value);
        professorList.doc(instructorID.value[0].Id).collection('classes').doc(value[3] + value[2]).set({average_gpa: parseFloat(value[0])});
      }
    }
    console.log('instructors done ' + i + '/' + '6696 and current professor = ' + instructors[i]); 
  }
}

/**
 * This fucntion goes through the professor passed in's calsses and finds average GPA to return
 * @param {string} instructor - The instructor to parse data for each class they have taught.
 * @return {Map} - returns a map that has a key of course, and value of averageGPA to write into database
 */
async function writeClasses(instructor, index) {
  let instructors = await fetch('https://boilergrades.com/api/indexes')
  instructors = await instructors.json();
  let courseMap = new Map();
  let classes = '';
  classes = await fetch('https://boilergrades.com/api/grades/?instructor=' + instructor); 
  classes = await classes.json();
  for (let i = 0; i < Object.keys(classes).length; i++) {
    if (classes[i].title.indexOf('Honors') !== -1) {
      console.log('This professor has an honors course ' + instructor + " and this is i " + index);
      break;
    }
    else if (i === Object.keys(classes).length - 1) {
      return undefined;
    }
  }

  for (let j = 0; j < Object.keys(classes).length; j++) {
    if (classes[j] === undefined) {
      continue;
    }
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
    let total = a_plus+a+a_minus+b_plus+b+b_minus
      +c_plus+c+c_minus+d_plus+d+d_minus
      +f;
    let grades = total.split('%');
    // remove last element of array since its just ''
    grades.pop();
    let avgGPA = 0.0;
    let sum = 0.0; 
    for (let k = 0; k < grades.length; k++) {
      sum += parseFloat(grades[k]); 
    }
    for (let k = 0; k < grades.length; k++) {
      avgGPA += parseFloat(grades[k] / sum) * findGPA(k); 
    }
    avgGPA = Number((avgGPA).toFixed(2));
    if (courseMap.has(classes[j].title)) {

      //console.log('multiplying prev avg gpa = ' + courseMap.get(classes[j].title)[0] + " with old counter " + courseMap.get(classes[j].title)[1] + " and adding this gpa " + avgGPA + " and divide it by new counter " + (courseMap.get(classes[j].title)[1] + 1)  + " and this all equals = " + (courseMap.get(classes[j].title)[0]*courseMap.get(classes[j].title)[1] + avgGPA) / (courseMap.get(classes[j].title)[1] + 1));
      courseMap.set(classes[j].title, [Number(((courseMap.get(classes[j].title)[0]*courseMap.get(classes[j].title)[1]) + avgGPA) / (courseMap.get(classes[j].title)[1] + 1)).toFixed(2),  (courseMap.get(classes[j].title)[1] + 1), classes[j].course_num, classes[j].subject]);
    }
    else {
      courseMap.set(classes[j].title, [Number(avgGPA).toFixed(2), 1, classes[j].course_num, classes[j].subject]);
    }
    //console.log(courseMap.get(classes[j].title) + " current map for " + classes[j].course_num + " " + classes[j].title);
  }
  return courseMap;
}

/*
 * This function returns a GPA based off the index of array
 * @param {number} gpa - index of GPA array, lowest index is and A+ and largest index is F
 * @return {number} - the GPA associated with the array index
 */
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

module.exports = {writeProfessors, writeClasses, getAverageGPA}

