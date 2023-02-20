const fetch = require('node-fetch');
var fs = require('fs');

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
	//for(var i=0; i<1; i++) {
	for(var i=0; i<subjects.length; i++) {
			courses.push({"subject": subjects[i], "courses": await getCoursesBySubject(subjects[i])});
	}

	console.log(courses);
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
	return courses.value;
}



module.exports = {purdueios};
