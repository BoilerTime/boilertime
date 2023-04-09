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
      "member_ids": [user_id],
      "member_names": [await utils.getUserEmail(user_id)],
    };
    await groups.doc(group_id).set(group).then(async (res) => {
      await profiles.doc(user_id).update({
        "groups": FieldValue.arrayUnion(group_id)
      }).catch((err) => {
        throw new Error(500);
      });
    }).catch((err) => {
      throw new Error(500);
    });
    return group_id;
  }
}

async function duplicateGroups(user_id, group_id) {
  const profile = await profiles.doc(user_id).get();
  const doc = profile.data();
  return doc.groups != undefined && doc.groups.includes(group_id);
}


async function getGroups(user_id) {
  const profile = await profiles.doc(user_id).get();
  const doc = profile.data();
  if (doc.groups == undefined) {
    return [];
  } else {
    const myGroups = [];
    for (var i = 0; i < doc.groups.length; i++) {
      const group = await groups.doc(doc.groups[i]).get();
      const data = group.data()
      myGroups.push({ ...data, "group_id": group.id });
    };
    return myGroups;
  }
}

async function getGroup(group_id) {
  const group = await groups.doc(group_id).get();
  const data = group.data()
  return { ...data, "group_id": group.id };
}

async function inGroup(user_id, group_id, friend_id) {
  const group = await groups.doc(group_id).get();
  const data = group.data()
  return data.member_ids.includes(user_id) && data.member_ids.includes(friend_id);
}

async function joinGroup(user_id, group_id) {
  if (user_id == undefined || group_id == undefined) {
    throw new Error(400);
  } else if (await duplicateGroups(user_id, group_id)) {
    throw new Error(409);
  } else {
    await groups.doc(group_id).update({
      "member_ids": FieldValue.arrayUnion(user_id),
      "member_names": FieldValue.arrayUnion(await utils.getUserEmail(user_id)),
    }).catch((err) => {
      throw new Error(500);
    });
    await profiles.doc(user_id).update({
      "groups": FieldValue.arrayUnion(group_id)
    }).catch((err) => {
      throw new Error(500);
    });
    const group = await groups.doc(group_id).get();
    return group.data().group_name;
  }
}

module.exports = { createGroup, joinGroup, getGroups, getGroup, inGroup }