const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const ratings = require('@mtucourses/rate-my-professors').default;
const { collection, query, where, getDocs } = require('firebase/firestore');

const db = getFirestore();
const users = db.collection('user_profile');
const classes = db.collection('classes').doc('spring_2023');
const ratingsCollection = db.collection('ratings');

/**
 * Get the user_id given the email
 * @param {string} email - The email that the user wants to find the user_id for
 * @returns {string} - The user_id
 * @throws {500} if no user_id is found
 */
async function getUID({ email }) {
  const profile = await users.where('email', '==', email).get();
  if (profile.empty) {
    throw new Error(500);
  }
  profile.forEach(doc => {
    return (user_id = doc.data().user_id);
  });
}
/** 
  * Utilility for finding if any users exist by email
  * @param {string} email - The email that needs to be found in the server
  * @returns {boolean} - A boolean representing whether or not there are matching users in the database.
**/
const findExistingUsers = async function (email) {
  const existingUsers = await users.where('email', '==', email).get();
  //If there are existing users with the same email, return false
  //console.log(existingUsers.size);
  return existingUsers.size > 0;
}

/**
 * Searches RMP for a professor
 * @param {string} professor - The name of the professor
 * @returns {JSON} - A json containing details about the professor
 */
async function getProfessorRating(professor) {
  const purdueid = 'U2Nob29sLTc4Mw=='
  let split = professor.replace("-", " ").split(" ").filter(item => item);
  while (split.length > 0) {
    const teachers = await ratings.searchTeacher(await concat(split), purdueid)
    if (teachers.length == 0) {
      split.splice(split.length - 2, 1);
    } else {
      const teacher = await ratings.getTeacher(teachers[0].id)
      return teacher
    }
  }
  throw new Error("Professor Not Found in RMP")
}

/**
 * Concatenate Array of String with spaces in between
 * @param {array} split - String to Join together with spaces
 * @param {string} out - Output string
 */
async function concat(split) {
  let count = 1
  let out = split[0]
  while (count < split.length) {
    out += " " + split[count]
    count += 1
  }
  return out
}

/**
 * Iterates through all documents in a department
 * @param {string} professor - The name of the professor
 * @returns {JSON} - A json containing details about the professor
 */
async function getClassesFromDept(department) {
  const numbers =  await classes.collection(department).get();
  if (numbers.empty) {
    throw new Error(500);
  }
  var output=new Array();
  numbers.forEach(doc => {
    if (doc.id.length == 5) {
      output.push(`${department} ${doc.id}`);
    }
  })
  return output
}

async function updateProfile(user_id, grad_month, grad_year, new_classification_year, new_firstname, new_lastname, isGradStudent) {

  const profile = users.doc(user_id);
  await profile.update({classification_year: new_classification_year, firstname: new_firstname, lastname: new_lastname, grad_year: grad_year, grad_month: grad_month, is_grad_student: isGradStudent});
  /*
  profile.forEach(doc => {
    doc.ref.update({classification_year: new_classification_year, firstname: new_firstname, lastname: new_lastname});
  });
  */
}

function getStudentClass(grad_year, grad_month) {
  let current_year = new Date().getFullYear();
  //console.log('this is the current year ' + current_year);
  if (grad_year - current_year >= 4) {
    return 'freshman';
  }
  else if (grad_year - current_year == 3) {
    return 'sophomore';
  }
  else if (grad_year - current_year == 2) {
    return 'junior';
  }
  else if (grad_year - current_year <= 1) {
    return 'senior';
  }
}

/*
 * Update the password 
 * @param {string} user_id - The user_id of the user having their password updated
 * @param {string} new_password - The user_id
 * @throws {500} if no user_id is found
 */
async function updatePassword({ user_id, new_password }) {
  const profile = await users.doc(user_id).get();
  if (profile.empty) {
    throw new Error(500);
  } else {
    profile.ref.update({ password: new_password })
    return (password = new_password);
  }
}

/**
 * Add bookmark
 * @param {string} user_id - The user_id of the user having their bookmark updated
 * @param {string} class_name - The class_name to add
 */
async function addBookmark(user_id, class_name) {
  const profile = users.doc(user_id)
  const union = await profile.update({
    bookmarks: FieldValue.arrayUnion(class_name)
  })
  const bookmarks = await getBookmarks(user_id).then((bookmarks) => {
    return (bookmarks)
  })
}

/**
 * Remove bookmark
 * @param {string} user_id - The user_id of the user having their bookmark updated
 * @param {string} class_name - The class_name to add
 */
async function reomveBookmark(user_id, class_name) {
  const profile = users.doc(user_id)
  const union = await profile.update({
    bookmarks: FieldValue.arrayRemove(class_name)
  })
  const bookmarks = await getBookmarks(user_id).then((bookmarks) => {
    return (bookmarks)
  })
}

/**
 * Get bookmark
 * @param {string} user_id - The user_id of the user having their bookmark updated
 * @param {string} class_name - The class_name to add
 */
async function getBookmarks(user_id) {
  const profile = await users.doc(user_id).get();
  if (!profile.exists) {
    throw new Error(500)
  } else {
    return (bookmarks = profile.data().bookmarks);
  }
}

/*
 * This function gets a user profile from db
 * @param {string} user_id - The ID of user we want to get
 */
async function getUserProfile(user_id) {
  const profile = await users.doc(user_id).get();
  doc = await profile.data();
  return {firstname: doc.firstname, lastname: doc.lastname, grad_month: doc.grad_month, grad_year: doc.grad_year, is_grad_student: doc.is_grad_student}

}

/*
 * This function adds a flag to a rating
 * @param {string} user_id - ID of the user that rated this rating
 * @param {string} type - Type of rating (ex. course, classroom, or ta)
 * @param {string} name - Name of the thing/person getting rated (ex. course: CS30700, classroom: SMTH108, or a ta: Chirayu Garg)
 */
async function addRatingFlag(type, user_id, name) {
  ratingToFlag = await ratingsCollection.doc(type + 's').collection(type + '_ratings').where('user_id', '==', user_id).where(type, '==', name).get();
  if (ratingToFlag.empty) {
    return undefined;
  }
  var flag_count = 0;
  ratingToFlag.forEach(async doc => {
    doc.ref.update({flag_count: doc.data().flag_count + 1});
    flag_count = doc.data().flag_count;
  });
  return {flag_count: flag_count + 1};
}

/*
 * This function gets the user email from user_id
 * @param {string} uesr_id - the user_id  of user
 */
async function getUserEmail(user_id) {
  const profile = await users.doc(user_id).get();
  if (profile.empty) {
    throw new Error(500);
  }
  return (email = await profile.data().email);
}

/**
 * Finds the first key that corresponds with a given value in an array. O(n)
 * @param {*} arr The array to be searched
 * @param {*} key The value to be serached for 
 * @returns The index 
 */
function findKeyForUnsorted(arr, key) {
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] == key) {
      return i;
    }
  }
  return -1;
}

/**
 * Helper function to pad a time with the prefix 0H
 * @param {*} time The time to be padded if missing 0H
 * @returns the result of the padding
 */
function padTime(time) {
  if(!time.includes("H")) {
    time = "PT0H" + time.substring(2); 
  }
  return time;
}


const fs = require('fs');

/**
 * Generate List of Classrooms
 */
async function generateClassroomList() {
  const buildings = await db.collection('classrooms').get();
  buildings.forEach(async building => {
      const ShortCode = await building.data().ShortCode;
      const rooms = await building.ref.collection("rooms").get();
      rooms.forEach(async room => {
        const number = room.id;
        console.log(ShortCode + " " + number);
        fs.appendFile('classrooms.json', "\"" + ShortCode + " " + number + "\",\n", function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
      })
  })
}

/**
 * Generate ShortCode to Building Name
 */
async function generateBuildings() {
  const buildings = await db.collection('classrooms').get();
  const list = [];
  buildings.forEach(async building => {
    const ShortCode = await building.data().ShortCode;
    const Name = await building.data().Name;
    if (Name != "TBA" && !list.includes(ShortCode)) {
      list.push(ShortCode)
      fs.appendFile('buildings.json',  "\"" + ShortCode +"\" : \"" + Name + "\",\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
  })
}

const classrooms = require('../../classrooms.json');

async function sortClassrooms() {
  classrooms.classrooms.sort();
  classrooms.classrooms = [...new Set(classrooms.classrooms)]
  fs.writeFile('classrooms.json', JSON.stringify(classrooms), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

const buildings = require('../../buildings.json');

async function getBuildingName(room) {
  return buildings[room];
}

module.exports = { getUID, findExistingUsers, updateProfile, updatePassword, addBookmark, reomveBookmark, getBookmarks, getProfessorRating, getClassesFromDept, getUserProfile, getStudentClass, addRatingFlag, findKeyForUnsorted, padTime, generateClassroomList, sortClassrooms, getBuildingName, generateBuildings };

