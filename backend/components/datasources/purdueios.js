const fetch = require('node-fetch');
var fs = require('fs');

require('dotenv').config({path: '../.env'});
require('../../firebase')
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');

const db = getFirestore()
const classLists = db.collection('classes');

const purdueios = async function() {
	console.log("Called");
	var rawSubject;
	var subjects = [];
	var courses = [];
	//Get a list of all the subjects offered at Purdue (required to go further down the tree
	rawSubjects = await fetch('https://api.purdue.io/odata/Subjects');
	//console.log(await subjects.json());
	rawSubjects = await rawSubjects.json();
	rawSubjects.value.forEach((res) => {
			subjects.push(res.Abbreviation);
	});
	console.log(subjects.length);

	//Get a list of all courses in the system
	//for(var i=0; i<1; i++) {
	for(var i=0; i<subjects.length; i++) {
			courses.push({"subject": subjects[i], "courses": await getCoursesBySubject(subjects[i])});
	}

	console.log(courses[0].courses.length);

	//Now, get all sections for each course that exists

	fs.writeFile('courses.json', JSON.stringify(courses), function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
	//return body;
}

//Returns an array of all courses that exist within a major in the form of an array
const getCoursesBySubject = async function(subject) {
	let courseList = [];
	let courses = await fetch('https://api.purdue.io/odata/Courses?$filter=(Classes/any(c:%20c/Term/Code%20eq%20%27202320%27))%20and%20Subject/Abbreviation%20eq%20%27' + subject + '%27');
	courses = await courses.json();
	//console.log(courses.value.length);
	//for(var i=0; i<10; i++){
	for(var i=0; i<courses.value.length; i++) {
		console.log(courses.value[i].Id);
		let classes = await fetch('https://api.purdue.io/odata/Courses?$filter=Id%20eq%20' + courses.value[i].Id + '&$expand=Classes($filter=Term/Code%20eq%20%27202320%27;$expand=Sections($expand=Meetings($expand=Instructors,Room($expand=Building))))');
		classes = await classes.json();
		courses.value[i].Sections = classes.value[0].Classes;
		//console.log(classes.value[0].Classes[0].Sections);
		//console.log(await classes.json().value);
		//console.log(classes);
	}
	return courses.value;
}


const saveCourses = async function() {
	let courseList = fs.readFileSync("courses.json");
	courseList = JSON.parse(courseList);

	let subjectDocs = [];
	//let courseStore = db.collection(courseEntry.id);
	let currentId;
	//for(let i = 0; i < 2; i++) {
	let courseCount = 0;
	for(let i = 0; i<courseList.length; i++) {
		console.log(courseList[i].subject + " " + i);
	}
	for(let i = 8; i < 9; i++) {
		await classLists.doc('spring_2023').collection(courseList[i].subject).add({hasCourses: true}).then((res) => {
    	//It worked, great! Don't need to do anything, though
			//let currentId = res.id;
			//subjectDocs.push(res.id);
			//console.log(await subjectDocs.push(res.id));
			currentId = res.id;
		}).catch((err) => {
			throw new Error().error = 500;
    })
		console.log(i);
		for(let j = 0; j < courseList[i].courses.length; j++) {
			//console.log(j);
			courseCount++;
			console.log("Course Count: " + courseCount)
			//console.log(courseList[i].courses[j]);
			await classLists.doc('spring_2023').collection(courseList[i].subject).doc(courseList[i].courses[j].Number).set({name: courseList[i].courses[j].Title, credits: courseList[i].courses[j].CreditHours, description: courseList[i].courses[j].Description, number: courseList[i].courses[j].Number});
			for(let k = 0; k<courseList[i].courses[j].Sections.length; k++) {
				//       console.log(courseList[i].courses[j].Sections[k].Sections.length);
				let sectionsList = courseList[i].courses[j].Sections[k].Sections;
				//console.log(sectionsList.length)

				for(let l = 0; l < sectionsList.length; l++) {
					console.log({type: sectionsList[l]?.Meetings[0]?.Type || "none",
					 starttime: sectionsList[l]?.Meetings[0]?.StartTime || "none",
					 daysOfWeek: sectionsList[l]?.Meetings[0]?.DaysOfWeek || "none",
					 durations: sectionsList[l]?.Meetings[0]?.Duration || "none",
					 instructor: sectionsList[l]?.Meetings[0]?.Instructors[0] || "none",
					 building: sectionsList[l]?.Meetings[0]?.Room?.Building?.ShortCode || "none",
					 roomNumber: sectionsList[l]?.Meetings[0]?.Room || "none",
					 startDate: sectionsList[l]?.Meetings[0]?.StartDate || "none",
					 endDate: sectionsList[l]?.Meetings[0]?.StartDate || "none"
					})
					await classLists.doc('spring_2023').collection(courseList[i].subject).doc(courseList[i].courses[j].Number).collection(courseList[i].courses[j].Sections[k].Id).doc(courseList[i].courses[j].Sections[k].Sections[l].Id).set(
						{type: sectionsList[l]?.Meetings[0]?.Type || "none",
							starttime: sectionsList[l]?.Meetings[0]?.StartTime || "none",
							daysOfWeek: sectionsList[l]?.Meetings[0]?.DaysOfWeek || "none",
							durations: sectionsList[l]?.Meetings[0]?.Duration || "none",
							instructor: sectionsList[l]?.Meetings[0]?.Instructors[0] || "none",
							building: sectionsList[l]?.Meetings[0]?.Room?.Building?.ShortCode || "none",
							roomNumber: sectionsList[l]?.Meetings[0]?.Room || "none",
							startDate: sectionsList[l]?.Meetings[0]?.StartDate || "none",
							endDate: sectionsList[l]?.Meetings[0]?.StartDate || "none"
						});
				}
			}
		}
	}
}



module.exports = {purdueios, saveCourses};
