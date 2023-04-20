<template>
  <NavBar />
  <div class="h-screen overflow-auto p-16 bg-gray-200 dark:bg-neutral-600">
    <!--Transition Container-->
    <TransitionRoot :show="isModalVisible" enter="transition duration-100" enter-from="opacity-0"
      enter-to="opacity-100 z-index-50" leave="transition duration-100" leave-from="opacity-100" leave-to="opacity-0">
      <!--Edit Profile Modal-->
      <Modal @closed="closeModal">
        <template #header>
          <h1 class="font-extrabold text-3xl dark:text-gray-200">
            Edit Profile
          </h1>
        </template>
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="flex flex-row gap-4">
              <div class="flex flex-col gap-2">
                <label for="firstname" class="font-bold dark:text-gray-200">First Name</label>
                <input type="text" id="firstname" v-model="firstname"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="First Name" />
              </div>
              <div class="flex flex-col gap-2">
                <label for="lastname" class="font-bold dark:text-gray-200">Last Name</label>
                <input type="text" id="lastname" v-model="lastname"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Last Name" />
              </div>
            </div>
            <div class="flex">
              <label for="privacy" class="font-bold dark:text-gray-200">Privacy</label>
              <Switch v-model="privacy" :class="privacy ? 'bg-blue-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 items-center rounded-full">
                <span :class="privacy ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </Switch>
              <label for="pairs" class="font-bold dark:text-gray-200">Share Me</label>
              <Switch v-model="pairs" :class="pairs ? 'bg-blue-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 items-center rounded-full">
                <span :class="pairs ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </Switch>
            </div>
            <div class="flex flex-row gap-4 place-content-center">
              <div class="flex flex-col gap-4">
                <label for="gradMonth" class="font-bold dark:text-gray-200">Graduation Month</label>
                <select id="gradMonth" v-model="gradMonth"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Month">
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div class="flex flex-col gap-4">
                <label for="gradYear" class="font-bold dark:text-gray-200">Graduation Year</label>
                <select id="gradYear" v-model="gradYear"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Year">
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032">2032</option>
                  <option value="2033">2033</option>
                  <option value="2034">2034</option>
                  <option value="2035">2035</option>
                  <option value="2036">2036</option>
                  <option value="2037">2037</option>
                  <option value="2038">2038</option>
                  <option value="2039">2039</option>
                  <option value="2040">2040</option>
                </select>
              </div>
              <div class="flex flex-col gap-4">
                <label for="isGradStudent" class="font-bold dark:text-gray-200 justify-end">Graduate Student</label>
                <button id="isGradStudent" @click="isGradStudent = !isGradStudent"
                  class="border rounded-lg p-2 bg-indigo-500 hover:bg-indigo-700 text-white dark:border-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  {{ isGradStudent ? "Yes" : "No" }}
                </button>
              </div>
            </div>
            <button @click="showPasswordChange"
              class="text-black dark:text-gray-200 text-lg font-bold py-2 px-3 hover:underline">
              Need to change your password?
            </button>
            <div v-if="TestsDiv">
              <form @submit.prevent="() => changePassword()">
                <!--Password text & input box-->
                <label for="password" class="block mb-2 font-bold text-black dark:text-gray-200">New Password</label>
                <input type="password" id="password"
                  class="w-full dark:bg-neutral-500 border dark:border-black rounded-lg p-2 dark:placeholder-neutral-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password" v-model="password" required />
                <!--Confirm Password text & input box-->
                <label for="confpassword" class="block mb-2 mt-2 font-bold text-black dark:text-gray-200">Confirm
                  Password</label>
                <input type="password" id="confpassword"
                  class="w-full dark:bg-neutral-500 border dark:border-black rounded-lg p-2 dark:placeholder-neutral-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password" v-model="confpassword" required />

                <!--Confirms the password change-->
                <div class="container py-3 px-5 w-full flex flex-col items-center">
                  <button type="submit"
                    class="bg-green-500 hover:bg-green-700 border dark:border-black text-white font-bold py-2 px-10 rounded-lg">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </template>
        <template #footer>
          <button type="button"
            class="w-1/8 bg-yellow-500 hover:bg-yellow-700 border dark:border-black text-white font-bold py-2 px-2 rounded-lg"
            @click="submit">
            Submit
          </button>
        </template>
      </Modal>
    </TransitionRoot>

    <!--Profile Card-->
    <div
      class="mx-auto max-w-6xl p-8 bg-white dark:bg-neutral-700 border dark:border-black rounded-lg shadow-lg grid grid-flow-row">
      <!--Flex grouping for profile info content-->
      <div class="flex flex-auto gap-4">
        <!--Profile Picture-->
        <div
          class="rounded-full h-24 w-24 text-white bg-yellow-500 flex items-center justify-center text-4xl font-extrabold">
          <h1>{{ firstname[0] }}{{ lastname[0] }}</h1>
        </div>
        <!--Profile Info-->
        <div class="place-self-center">
          <h1 class="font-extrabold text-4xl dark:text-gray-200">
            {{ firstname }} {{ lastname }}
          </h1>
          <h1 class="font-light text-md dark:text-gray-200">{{ gradMonth }} {{ gradYear }}</h1>
          <h1 class="font-light text-md dark:text-gray-200 italic">
            {{ isGradStudent ? "Graduate" : "Undergraduate" }}
          </h1>
        </div>
      </div>
      <!--Flex grouping for user ratings-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl dark:text-gray-200">User Ratings ⭐️</h1>
      </div>
      <div class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 mt-5 p-4">
        <h1 class="font-bold text-2xl mb-3">Courses</h1>
        <ul class="list-inside list-item mb-6" v-for="(course, index) in courses" :key="index" v-if="isDataLoaded">
          <li class="font-bold text-lg">{{ course.course }} </li>
          <li class="font-light italic text-sm mb-2">
            Submitted at: {{ course.timestamp }}
          </li>
          <li class="font-light text-sm mb-2 text-red-500" v-if="course.flag_count >= 3">
            This review has been flagged for review by the content moderators
          </li>
          <li>
            How strict are the prerequisite requirements? {{ course.rating[0] }}
          </li>
          <li>
            How is the pace of the materials covered? {{ course.rating[1] }}
          </li>
          <li>How in-depth is the material? {{ course.rating[2] }}</li>
          <li>Your Review:</li>
          <li>{{ course.explanation }}</li>
          <li class="flex gap-2 place-items-center">
            <a class="mr-3 bg-yellow-500 hover:bg-yellow-700 font-bold border-black text-white text-sm p-2.5 rounded-lg"
              @click="
                edit(
                  course.course,
                  course.rating[0],
                  course.rating[1],
                  course.rating[2],
                  course.explanation,
                  'course',
                  userStore.user_id
                )
              ">Edit</a><a
              class="bg-red-500 hover:bg-red-700 font-bold border-black text-white text-sm p-2.5 rounded-lg"
              @click="deletecourses(course.course)">Delete</a>
            <flagicon class="h-14 w-14 p-3 hover:text-neutral-600" @click="flag"></flagicon>
          </li>
        </ul>
        <h1 class="font-bold text-2xl mt-3 mb-3">Classrooms</h1>
        <ul class="list-inside list-item mb-6" v-for="classroom in classrooms" v-if="isDataLoaded">
          <li class="font-bold text-lg">{{ classroom["classroom"] }}</li>
          <li class="font-light text-sm mb-2 italic">
            Submitted at: {{ classroom.timestamp }}
          </li>
          <!-- Classroom Reivews, edit content because it does not make sense -->
          <li class="font-light text-sm mb-2 text-red-500" v-if="classroom.flag_count >= 3">
            This review has been flagged for review by the content moderators
          </li>
          <li>
            How strict are the prerequisite requirements?
            {{ classroom.rating[0] }}
          </li>
          <li>
            How is the pace of the materials covered? {{ classroom.rating[1] }}
          </li>
          <li>How in-depth is the material? {{ classroom.rating[2] }}</li>
          <li>Your Review:</li>
          <li>{{ classroom.explanation }}</li>
          <li class="flex gap-2 place-items-center">
            <a class="mr-3 bg-yellow-500 hover:bg-yellow-700 font-bold border-black text-white text-sm p-2.5 rounded-lg"
              @click="
                edit(
                  classroom.classroom,
                  classroom.rating[0],
                  classroom.rating[1],
                  classroom.rating[2],
                  course.explanation,
                  'classroom',
                  userStore.user_id
                )
              ">Edit</a><a
              class="bg-red-500 hover:bg-red-700 font-bold border-black text-white text-sm p-2.5 rounded-lg"
              @click="deleteclassrooms(classroom.classroom)">Delete</a>
            <flagicon class="h-14 w-14 p-3 hover:text-neutral-600" @click="flag"></flagicon>
          </li>
        </ul>
        <h1 class="font-bold text-2xl mt-3 mb-3">Teaching Assistants</h1>
        <ul class="list-inside list-item mb-2" v-for="ta in tas" v-if="isDataLoaded">
          <li class="font-bold text-lg">{{ ta["ta"] }}</li>
          <li class="font-light text-sm mb-2 italic">
            Submitted at: {{ ta.timestamp }}
          </li>
          <!--Flagging Teaching Assistants, review label content (does not make sense)-->
          <li class="font-light text-sm mb-2 text-red-500" v-if="ta.flag_count >= 3">
            This review has been flagged for review by the content moderators
          </li>
          <li>
            How strict are the prerequisite requirements? {{ ta.rating[0] }}
          </li>
          <li>How is the pace of the materials covered? {{ ta.rating[1] }}</li>
          <li>How in-depth is the material? {{ ta.rating[2] }}</li>
          <li>Your Review:</li>
          <li>{{ ta.explanation }}</li>
          <li class="flex gap-2 place-item-center">
            <a class="mr-3 bg-yellow-500 hover:bg-yellow-700 font-bold border-black text-white text-sm p-2.5 mt-2 mb-2 rounded-lg"
              @click="
                edit(ta.ta, ta.rating[0], ta.rating[1], ta.rating[2], ta.explanation, 'ta')
              ">Edit</a><a
              class="bg-red-500 hover:bg-red-700 font-bold border-black text-white text-sm p-2.5 mt-2 mb-2 rounded-lg"
              @click="deleteta(ta.ta)">Delete</a>
            <flagicon class="h-14 w-14 p-3 hover:text-neutral-600" @click="flag"></flagicon>
          </li>
        </ul>
        <ul class="list-inside list-item" v-else>
          <li>No ratings yet!</li>
        </ul>
        <EditRating :isOpen="isOpen" :closeEdit="closeEdit" :title="editTitle" :q1="editQ1" :q2="editQ2" :q3="editQ3"
          :expl="editExpl" :type="editType" :id="user_id" />
      </div>
      <!--Flex grouping for bookmarked classes-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl mb-5 dark:text-gray-200">Bookmarked Classes ❗️</h1>
        <div class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 p-4">
          <ul class="list-inside list-item">
            <li class="mb-2 font-bold text-lg" v-for="(item, index) in bookmarkedClasses" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <!--Flex grouping for groups-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl mb-5 dark:text-gray-200">Groups 😎</h1>
        <div class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 mt-5 p-4">
          <ul class="list-inside list-item">
            <li class="divide-y divide-solid">
            <li v-for="(item, index) in groups" :key="index">
            <li class="mb-2 font-bold">Group Name:</li>
            <li class="mb-2 font-light">{{ item.group_name }}</li>
            <li class="mb-2 font-bold">Group Members:</li>
            <li class="font-light mb-2" v-for="(item, index) in groups[index].member_names" :key="index">
              {{ item }}
            </li>
            <li class="mb-2 font-bold">Invite Link:</li>
            <li class="mb-2 font-light divide-y divide-dashed">{{ "https://boilerti.me/group/join/?group_id=" +
              item.group_id }}</li>
            </li>
            </li>
          </ul>
        </div>
      </div>
      <!--Edit Profile Button-->
      <div class="grid grid-flow-col gap-4 justify-end">
        <button type="button"
          class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white font-bold border dark:border-black py-2 px-2 rounded-lg"
          @click="showModal">
          Edit Profile
        </button>
        <!--Get All User Data Button-->
        <button type="button"
          class="w-1/8 bg-green-500 hover:bg-green-700 text-white font-bold border dark:border-black py-2 px-2 rounded-lg"
          @click="history">
          Get All User Data
        </button>
        <!--Delete Account-->
        <input type="password" id="password"
          class="w-full dark:bg-neutral-500 border dark:border-black rounded-lg p-2 dark:placeholder-neutral-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Password" v-model="password" required />
        <button type="button"
          class="w-1/8 bg-red-500 hover:bg-red-700 text-white font-bold border dark:border-black py-2 px-2 rounded-lg"
          @click="deleteAccount">
          Delete Account
        </button>
        <!--Go home-->
        <button
          class="w-1/8 bg-indigo-500 hover:bg-indigo-700 font-bold border dark:border-black text-white py-2 px-2 rounded-lg">
          <a href="/app">Home</a>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../../store/user";
import Modal from "../../components/Modal.vue";
import { TransitionRoot } from "@headlessui/vue";
import sha256 from "js-sha256";
import { FlagIcon as flagicon } from "@heroicons/vue/24/outline";
import { saveAs } from 'file-saver';
import { Switch } from '@headlessui/vue'
//import { encrypt } from "iron-webcrypto";
//import test from "node:test";

var userStore = useUserStore();
var isModalVisible = ref(false);
var isCourseModalVisible = ref(false);
var isClassroomModalVisible = ref(false);
var isTAModalVisible = ref(false);
var firstname = ref("");
var lastname = ref("");
var gradMonth = ref("");
var email = ref("");
var gradYear = ref();
var isGradStudent = ref();
var privacy = ref(false);
var pairs = ref(false);
var bookmarkedClasses = ref([]);
var groups = ref([]);

var user_id = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
};

const password = ref("");
const confpassword = ref("");
var TestsDiv = ref(false);
function showPasswordChange() {
  if (TestsDiv.value == true) {
    TestsDiv.value = false;
  } else {
    TestsDiv.value = true;
  }
}

async function history() {
  var blob = new Blob([
    "User Info\n",
    "User ID: ", user_id,
    "\nEmail: ", email.value,
    "\nFirst Name: ", firstname.value,
    "\nLast Name: ", lastname.value,
    "\nGrad Month: ", gradMonth.value,
    "\nGrad Year: ", gradYear.value,
    "\nIs Grad Student: ", isGradStudent.value,
    "\nRequired Courses\n", JSON.stringify(selectedRequiredCourses.value, null, 2),
    "\nOptional Courses\n", JSON.stringify(selectedOptionalCourses.value, null, 2),
    "\nBookmarks\n", JSON.stringify(bookmarkedClasses.value, null, 2),
    "\nClassroom Ratings\n", JSON.stringify(classrooms, null, 2),
    "\nTA Ratings\n", JSON.stringify(tas, null, 2),
    "\nCourse Ratings\n", JSON.stringify(courses, null, 2),
    "\nGroups\n", JSON.stringify(groups.value, null, 2)],
    { type: "text/plain;charset=utf-8" });
  saveAs(blob, "boilergrades.txt").catch((err) => {
    alert("Error saving file")
    console.log(err);
  });
}

async function deleteAccount() {
  try {
    var pwd = sha256(password.value);
    const res = await axios.post('https://api.boilerti.me/api/deleteuser', {
        user_id: user_id,
        password: pwd
      }, config).then(() => {
        userStore.logOut()
        alert("Account deleted");
        navigateTo("/");
      })
  } catch (error) {
    // temp alert
    alert("Incorrect username or password");
    password.value = null;
  }
}

var encrypteduserid = "";

/**
 * changePassword() will take in the new password and the confirmation,
 * making sure the two are the same before updating the user's password.
 */

async function changePassword() {
  var newpassword = sha256(password.value);
  var newconfpassword = sha256(confpassword.value);
  // Getting the encrypted user ID
  await axios
    .post("https://api.boilerti.me/api/encryptuserid", {
      user_id: user_id,
    })
    .then((res) => {
      encrypteduserid = res.data.user_id;
    })
    .catch(function (error) {
      console.error(error);
      alert("Error: " + error);
    });
  // Resetting the password
  if (newpassword === newconfpassword) {
    await axios
      .post("https://api.boilerti.me/api/resetpassword", {
        user_id: encrypteduserid,
        password: newpassword,
      })
      .then(function () {
        alert("Password has been changed.");
        navigateTo("/app/profile");
      })
      .catch(function (error) {
        console.error(error);
        alert("Error: " + error);
      });
  } else {
    alert("Passwords do not match.");
  }
}

/* CAPTCHA variables */
const randval1 = Math.floor(
  Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1)
);
const randval2 = Math.floor(
  Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1)
);
const actualval = randval1 + randval2;
const enterval = ref("");

var isDataLoaded = ref(false);

function flag() {
  window.prompt("Why are you flagging this?", "");
}

function showModal() {
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}

function showCourseModal() {
  isCourseModalVisible.value = true;
}

function closeCourseModal() {
  isCourseModalVisible.value = false;
}

function showClassroomModal() {
  isClassroomModalVisible.value = true;
}

function closeClassroomModal() {
  isClassroomModalVisible.value = false;
}

function showFlagModal() {
  isTAModalVisible.value = true;
}

function closeFlagModal() {
  isTAModalVisible.value = false;
}

/** THIS IS FOR EDIT MODAL */

const isOpen = ref(false);

function closeEdit() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

var editTitle = ref("")
var editQ1 = ref("")
var editQ2 = ref("")
var editQ3 = ref("")
var editExpl = ref("")
var editType = ref("")

async function edit(title, q1, q2, q3, expl, type) {
  editTitle.value = title
  editQ1.value = q1
  editQ2.value = q2
  editQ3.value = q3
  editExpl.value = expl
  editType.value = type
  openModal()
}

/** THE ABOVE IS FOR EDIT MODAL */

async function getBookmarks() {
  axios
    .post(
      "https://api.boilerti.me/api/getbookmarks",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      console.log(response.data.bookmarks);
      bookmarkedClasses.value = response.data.bookmarks;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getGroups() {
  axios.post('https://api.boilerti.me/api/groups', {
    user_id: user_id
  }, config)
    .then((res) => {
      groups.value = res.data.groups;
    })
    .catch(function (error) {
      console.error(error);
      alert(error);
    })
}

async function deletecourses(course) {
  axios
    .post(
      "https://api.boilerti.me/api/delete/ratings/courses",
      {
        user_id: userStore.user_id,
        course: course,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      console.log(response.data);
      alert("Successfully deleted request");
      location.reload();
    }, config)
    .catch((error) => {
      console.error(error);
    });
}

async function deleteclassrooms(classroom) {
  axios
    .post(
      "https://api.boilerti.me/api/delete/ratings/classrooms",
      {
        user_id: userStore.user_id,
        classroom: classroom,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      console.log(response.data);
      alert("Successfully deleted request");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function deleteta(ta) {
  axios
    .post(
      "https://api.boilerti.me/api/delete/ratings/tas",
      {
        user_id: userStore.user_id,
        ta: ta,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      console.log(response.data);
      alert("Successfully deleted request");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getUserInfo() {
  axios
    .post(
      "https://api.boilerti.me/api/get/profile/",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
      gradMonth.value = response.data.grad_month;
      gradYear.value = response.data.grad_year;
      isGradStudent.value = response.data.is_grad_student;
      email.value = response.data.email;
      pairs.value = response.data.pairs;
      privacy.value = response.data.privacy;
      console.log(pairs.value + " " + privacy.value);
    })
    .catch((error) => {
      console.error(error);
    });
}
var selectedRequiredCourses = ref([]);
var selectedOptionalCourses = ref([]);

async function getSchedule() {
  axios.post('https://api.boilerti.me/api/getclasses', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    selectedRequiredCourses.value = response.data.required_classes
  })
  axios.post('https://api.boilerti.me/api/getclasses', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    selectedOptionalCourses.value = response.data.optional_classes
  })
}

let courses = [];
let classrooms = [];
let tas = [];

async function getratings() {
  await axios
    .post(
      "https://api.boilerti.me/api/get/user_ratings/courses",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
        accessToken = userStore.accessToken;
        config.headers["authorization"] = `Bearer ${accessToken}`;
        location.reload();
      }
      courses = response.data;
    })
    .catch((error) => {
      console.error(error);
    })
    .then(async () => {
      await axios
        .post(
          "https://api.boilerti.me/api/get/user_ratings/classrooms",
          {
            user_id: userStore.user_id,
          },
          config
        )
        .then((response) => {
          /*
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id
        }
      }
      */
          classrooms = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
      await axios
        .post(
          "https://api.boilerti.me/api/get/user_ratings/tas",
          {
            user_id: userStore.user_id,
          },
          config
        )
        .then((response) => {
          if (response.data["accessToken"] != undefined) {
            userStore.user = {
              accessToken: response.data["accessToken"],
              //refreshToken: response.data["refreshToken"],
              user_id: user_id,
            };
          }
          tas = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    });
}

async function flagCourse(course) {
  if (actualval == enterval.value) {
    await axios
      .post(
        "https://api.boilerti.me/api/add/flag",
        {
          type: "course",
          user_id: userStore.user_id,
          name: course.name.value,
        },
        config
      )
      .then(function () {
        if (response.data["accessToken"] != undefined) {
          userStore.user = {
            accessToken: response.data["accessToken"],
            //refreshToken: response.data["refreshToken"],
            user_id: user_id,
          };
        }
        alert("Review report successfully submitted.");
        isCourseModalVisible.value = false;
      })
      .catch(function (error) {
        console.error();
        alert(error);
      });
  } else {
    alert("CAPTCHA entered incorrectly. Please try again.");
  }
}

async function submit() {
  axios
    .post(
      "https://api.boilerti.me/api/update/profile",
      {
        user_id: userStore.user_id,
        firstname: firstname.value,
        lastname: lastname.value,
        classification_year: "Freshman",
        grad_month: gradMonth.value,
        grad_year: gradYear.value,
        is_grad_student: isGradStudent.value,
        pairs: pairs.value,
        privacy: privacy.value,
      },
      config
    )
    .then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id,
        };
      }
      isModalVisible.value = false;
    })
    .catch((error) => {
      console.error(error);
    });
}

onMounted(async () => {
  getUserInfo();
  getBookmarks();
  getGroups();
  getratings();
  getSchedule();
  setTimeout(() => {
    console.log(courses);
    console.log(classrooms);
    console.log(tas);
    isDataLoaded.value = true;
  }, 1000);
});
</script>