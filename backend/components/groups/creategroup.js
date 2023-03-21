require('dotenv').config({ path: '../.env' });
require('../../firebase')
const uuid = require('../auth/uuid.js');
//Firebase Imports Only
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { collection, query, where, getDocs } = require('firebase/firestore');
const utils = require('../utils/utils.js');
const crypto = require('crypto');

const db = getFirestore()
const profiles = db.collection('user_profile');
const groups = db.collection('groups');

async function createGroup(user_id, group_name) {
  if (user_id == undefined || group_name == undefined) {
    throw new Error(400);
  } else {
    const group_id = await uuid.uuid();
    const group = {
      "owner": user_id,
      "group_name": group_name,
    };
    await groups.doc(group_id).set(group).then(async (res) => {
      await profiles.doc(user_id).update({
        "groups": FieldValue.arrayUnion(group_id),
      }).catch((err) => {
        throw new Error(500);
      });
    }).catch((err) => {
      throw new Error(500);
    });
    return group_id;
  }
}

module.exports = { createGroup }