require('dotenv').config({path: '../.env'});
require('../../firebase')
const axios = require('axios');
//const cheerio = require('cheerio');

var fs = require('fs');

//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');
const courseList = require('../../courses.json');
const professorList = require('../../professors_and_courses_bg.json');
console.log(professorList);
console.log(professorList.includes('Gao, Jing') + " << This is the value");

async function getTAs() {
  let taMap = new Map([[String.prototype, [String.prototype]]]);

  // Loop through each subject
  for (let i = 0; i < courseList.length; i++) {
    const subject = courseList[i];

    // Loop through each course in the subject
    for (let j = 0; j < subject.courses.length; j++) {
      const course = subject.courses[j];

      // Loop through each section in the course
      for (let k = 0; k < course.Sections.length; k++) {
        const section = course.Sections[k];

        // Loop through each meeting in the section
        for (let m = 0; m < section.Sections[0].Meetings.length; m++) {
          const meeting = section.Sections[0].Meetings[m];

          // Loop through each instructor in the meeting
          for (let n = 0; n < meeting.Instructors.length; n++) {
            const instructor = meeting.Instructors[n];

            let name = instructor.Name.split(' ');
            //console.log(name.length + " This is the name.length");
            if (name.length == 3) {
             formattedName = name[2] + ', ' + name[0] + ' ' + name[1];  
            } else if (name.length == 2) {
              formattedName = name[1] + ', ' + name[0];
            }

            //jconsole.log(name);
            // Do something with the instructor
            console.log(professorList.includes(formattedName) + " includes value");
            if (professorList.includes(formattedName)) {
              //console.log(formattedName);
              console.log("THIS IS A PROFESSOR");
              console.log(formattedName + ' << formatted name\n');
            }
            else {
              //console.log(formattedName + "\n\n");
              if (taMap.has(instructor.Name)) {
                newArr = taMap.get(instructor.Name);
                if (!newArr.includes(subject.subject + course.Number)) {
                  newArr.push(subject.subject+course.Number);
                  taMap.set(instructor.Name, newArr);  
                }
              }
              else {
                taMap.set(instructor.Name, [subject.subject + course.Number])
                console.log(course.Number + " COURSE NUMBER");
              }
              console.log("THIS IS NOT A PROFESSOR");
              console.log(formattedName + ' << formatted name\n');
            }
          }
        }
      }
    }
  }
  console.log(taMap);
  return taMap;
}

function writeToFile(taMap) {

	fs.writeFile('courses.json', JSON.stringify(courses), function (err) {
		if (err) throw err;
		console.log('Saved!');
	});

  for (tas in taMap) {
    
  }
}

async function getPurdueDirectoryInfo(name) {
  try {
    const url = `https://www.purdue.edu/directory/?searchtype=all&searchquery=${name}`;
    const response = await axios.get(url);
    //const $ = cheerio.load(response.data);

    const results = [];
    $('.dir-result').each(async (index, element) => {
      const person = {
        name: $(element).find('.name').text().trim(),
        title: $(element).find('.title').text().trim(),
        department: $(element).find('.org').text().trim(),
        phone: $(element).find('.phone').text().trim(),
        email: $(element).find('.email').text().trim(),
      };
      await console.log(person + "THIS IS THE PERSON");
      results.push(person);
    });

    return results;
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  getTAs
}


