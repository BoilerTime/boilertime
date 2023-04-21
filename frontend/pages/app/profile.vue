<template>
  <div v-if="isMobile">
    <NavBarMobile />
  </div>
  <div v-else>
    <NavBar />
  </div>
  <div
    class="h-screen overflow-auto p-6 md:p-16 bg-gray-100 dark:bg-neutral-600"
  >
    <!--Transition Container-->
    <TransitionRoot
      :show="isModalVisible"
      enter="transition duration-100"
      enter-from="opacity-0"
      enter-to="opacity-100 z-index-50"
      leave="transition duration-100"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <!--Edit Profile Modal-->
      <Modal @closed="closeModal">
        <template #header>
          <h1 class="font-extrabold text-3xl dark:text-gray-200">
            Edit Profile
          </h1>
        </template>
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-col gap-2">
                <label for="firstname" class="font-bold dark:text-gray-200"
                  >First Name</label
                >
                <input
                  type="text"
                  id="firstname"
                  v-model="firstname"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="First Name"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label for="lastname" class="font-bold dark:text-gray-200"
                  >Last Name</label
                >
                <input
                  type="text"
                  id="lastname"
                  v-model="lastname"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div class="flex flex-row gap-4 place-content-center">
              <div class="flex flex-col gap-4">
                <label for="gradMonth" class="font-bold dark:text-gray-200"
                  >Graduation Month</label
                >
                <select
                  id="gradMonth"
                  v-model="gradMonth"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Month"
                >
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
                <label for="gradYear" class="font-bold dark:text-gray-200"
                  >Graduation Year</label
                >
                <select
                  id="gradYear"
                  v-model="gradYear"
                  class="border rounded-lg p-2 dark:bg-neutral-500 dark:border-black dark:text-gray-200 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Year"
                >
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
                <label
                  for="isGradStudent"
                  class="font-bold dark:text-gray-200 justify-end"
                  >Graduate Student</label
                >
                <button
                  id="isGradStudent"
                  @click="isGradStudent = !isGradStudent"
                  class="rounded-lg p-2 bg-indigo-100 hover:bg-indigo-700 dark:text-white text-indigo-500 dark:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {{ isGradStudent ? "Yes" : "No" }}
                </button>
              </div>
            </div>
            <button
              @click="showPasswordChange"
              class="text-indigo-500 dark:text-white text-lg font-bold py-2 px-3 hover:underline"
            >
              Need to change your password?
            </button>
            <div v-if="TestsDiv">
              <form @submit.prevent="() => changePassword()">
                <!--Password text & input box-->
                <label
                  for="password"
                  class="block mb-2 font-bold text-black dark:text-gray-200"
                  >New Password</label
                >
                <input
                  type="password"
                  id="password"
                  class="w-full dark:bg-neutral-500 border dark:border-black rounded-lg p-2 dark:placeholder-neutral-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                  v-model="password"
                  required
                />
                <!--Confirm Password text & input box-->
                <label
                  for="confpassword"
                  class="block mb-2 mt-2 font-bold text-black dark:text-gray-200"
                  >Confirm Password</label
                >
                <input
                  type="password"
                  id="confpassword"
                  class="w-full dark:bg-neutral-500 border dark:border-black rounded-lg p-2 dark:placeholder-neutral-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                  v-model="confpassword"
                  required
                />

                <!--Confirms the password change-->
                <div
                  class="container py-3 px-5 w-full flex flex-col items-center"
                >
                  <button
                    type="submit"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-10 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
            <button
              @click="showDeleteAccount"
              class="text-indigo-500 dark:text-white text-lg font-bold py-2 px-3 hover:underline"
            >
              Delete account
            </button>
            <div
              v-if="DeleteAccountDiv"
              class="flex flex-col items-center gap-4"
            >
              <!--Delete Account-->
              <input
                type="password"
                id="password"
                class="w-full dark:bg-neutral-500 border dark:border-black rounded-lg p-2 dark:placeholder-neutral-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
                v-model="password"
                required
              />
              <button
                type="button"
                class="w-1/8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-10 rounded-lg"
                @click="deleteAccount"
              >
                Delete Account
              </button>
            </div>
          </div>
        </template>
        <template #footer>
          <button
            type="button"
            class="w-1/8 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded-lg"
            @click="submit"
          >
            Submit
          </button>
        </template>
      </Modal>
    </TransitionRoot>

    <TransitionRoot
      :show="isEditPrivacyModalVisible"
      enter="transition duration-100"
      enter-from="opacity-0"
      enter-to="opacity-100 z-index-50"
      leave="transition duration-100"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <Modal @closed="closeEditPrivacyModal">
        <template #header>
          <h1 class="font-extrabold text-3xl dark:text-gray-200">
            Privacy Settings
          </h1>
        </template>
        <template #body>
          <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col items-center gap-2">
                <label for="privacy" class="font-bold dark:text-gray-200"
                  >Track My Data</label
                >
                <Switch
                  v-model="privacy"
                  :class="privacy ? 'bg-indigo-600' : 'bg-gray-200'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                >
                  <span
                    :class="privacy ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                  />
                </Switch>
              </div>
              <div class="flex flex-col items-center gap-2">
                <label for="pairs" class="font-bold dark:text-gray-200"
                  >Show Me To Other Users</label
                >
                <Switch
                  v-model="pairs"
                  :class="pairs ? 'bg-indigo-600' : 'bg-gray-200'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                >
                  <span
                    :class="pairs ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                  />
                </Switch>
              </div>
            </div>
            <!--Get All User Data Button-->
            <button
              type="button"
              class="w-1/8 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg -mb-4"
              @click="history"
            >
              Get All User Data
            </button>
          </div>
        </template>
        <template #footer>
          <button
            type="button"
            class="w-1/8 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded-lg"
            @click="submit"
          >
            Submit
          </button>
        </template>
      </Modal>
    </TransitionRoot>

    <!--Profile Card-->
    <div
      class="mx-auto max-w-6xl p-4 md:p-8 bg-white dark:bg-neutral-700 border dark:border-black rounded-lg shadow-lg grid grid-flow-row"
    >
      <!--Flex grouping for profile info content-->
      <div class="flex flex-col md:flex-row gap-4">
        <!--Profile Picture-->
        <div
          class="rounded-full h-24 w-24 text-white bg-yellow-500 flex items-center justify-center place-self-center md:place-self-start text-4xl font-extrabold"
        >
          <h1>{{ firstname[0] }}{{ lastname[0] }}</h1>
        </div>
        <!--Profile Info-->
        <div
          class="flex flex-col md:flex-col place-self-center items-center md:items-start"
        >
          <h1 class="font-extrabold text-4xl dark:text-gray-200">
            {{ firstname }} {{ lastname }}
          </h1>
          <h1 class="font-light text-md dark:text-gray-200">
            {{ gradMonth }} {{ gradYear }}
          </h1>
          <h1 class="font-light text-md dark:text-gray-200 italic">
            {{ isGradStudent ? "Graduate" : "Undergraduate" }}
          </h1>
        </div>
      </div>
      <div class="flex flex-row gap-4 justify-center md:justify-start mt-4">
        <button
          type="button"
          class="w-1/8 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-lg"
          @click="showModal"
        >
          Edit Profile
        </button>
        <button
          type="button"
          class="w=1/8 bg-indigo-100 text-indigo-600 hover:text-white hover:bg-indigo-700 font-bold dark:bg-indigo-100 dark:text-indigo-600 dark:hover:bg-indigo-700 dark:hover:text-white py-2 px-2 rounded-lg"
          @click="showEditPrivacyModal"
        >
          Privacy Settings
        </button>
      </div>
      <!--Flex grouping for user ratings-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl dark:text-gray-200">User Ratings</h1>
      </div>
      <div>
        <TabGroup>
          <TabList class="flex space-x-1 rounded-xl bg-neutral-200 dark:bg-neutral-400 p-1 items-cente justify-between gap-4 h-16 mt-4">
            <Tab :class="[
              'w-full rounded-lg py-2.5 text-md leading-5 font-bold',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white shadow'
                : '',
            ]"> Courses </Tab>
            <Tab :class="[
              'w-full rounded-lg py-2.5 text-md font-bold leading-5',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white shadow'
                : '',
            ]"> Classrooms </Tab>
            <Tab :class="[
              'w-full rounded-lg py-2.5 text-lg font-bold leading-5',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white shadow'
                : '',
            ]"> TAs </Tab>
          </TabList>
          <TabPanels>
            <TabPanel
              class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 mt-5 p-4 max-h-96 overflow-y-scroll"
            >
              <ul
                class="list-inside list-item mb-6"
                v-for="(course, index) in courses"
                :key="index"
                v-if="isDataLoaded"
              >
                <li class="font-bold text-lg">{{ course.course }}</li>
                <li class="font-light italic text-sm mb-2">
                  Submitted at: {{ course.timestamp }}
                </li>
                <li>
                  How strict are the prerequisite requirements?
                  {{ course.rating[0] }}
                </li>
                <li>
                  How is the pace of the materials covered?
                  {{ course.rating[1] }}
                </li>
                <li>How in-depth is the material? {{ course.rating[2] }}</li>
                <li>Your Review:</li>
                <li>{{ course.explanation }}</li>
                <li class="flex gap-2 place-items-center">
                  <button
                    class="mr-3 bg-indigo-500 hover:bg-indigo-700 font-bold text-white text-sm p-2.5 rounded-lg"
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
                    "
                    >Edit</button
                  ><button
                    class="font-bold text-indigo-500 dark:text-indigo-100 text-sm p-2.5 rounded-lg"
                    @click="deletecourses(course.course)"
                    >Delete</button
                  >
                </li>
              </ul>
              <ul class="list-inside list-item" v-else>
                <li>No ratings yet!</li>
              </ul>
              <EditRating
                :isOpen="isOpen"
                :closeEdit="closeEdit"
                :title="editTitle"
                :q1="editQ1"
                :q2="editQ2"
                :q3="editQ3"
                :expl="editExpl"
                :type="editType"
                :id="user_id"
              />
            </TabPanel>
            <TabPanel
              class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 mt-5 p-4 max-h-96 overflow-y-scroll"
            >
              <ul
                class="list-inside list-item mb-6"
                v-for="classroom in classrooms"
                v-if="isDataLoaded"
              >
                <li class="font-bold text-lg">
                  {{ classroom["classroom"] }}
                </li>
                <li class="font-light text-sm mb-2 italic">
                  Submitted at: {{ classroom.timestamp }}
                </li>
                <li>
                  How strict are the prerequisite requirements?
                  {{ classroom.rating[0] }}
                </li>
                <li>
                  How is the pace of the materials covered?
                  {{ classroom.rating[1] }}
                </li>
                <li>How in-depth is the material? {{ classroom.rating[2] }}</li>
                <li>Your Review:</li>
                <li>{{ classroom.explanation }}</li>
                <li class="flex gap-2 place-items-center">
                  <button
                    class="mr-3 bg-indigo-500 hover:bg-indigo-700 font-bold text-white text-sm p-2.5 rounded-lg"
                    @click="
                      edit(
                        classroom.classroom,
                        classroom.rating[0],
                        classroom.rating[1],
                        classroom.rating[2],
                        classroom.explanation,
                        'classroom',
                        userStore.user_id
                      )
                    "
                    >Edit</button
                  ><button
                    class="text-indigo-500 dark:text-indigo-100 font-bold text-sm p-2.5 rounded-lg"
                    @click="deleteclassrooms(classroom.classroom)"
                    >Delete</button
                  >
                </li>
              </ul>
              <ul class="list-inside list-item" v-else>
                <li>No ratings yet!</li>
              </ul>
              <EditRating
                :isOpen="isOpen"
                :closeEdit="closeEdit"
                :title="editTitle"
                :q1="editQ1"
                :q2="editQ2"
                :q3="editQ3"
                :expl="editExpl"
                :type="editType"
                :id="user_id"
              />
            </TabPanel>
            <TabPanel
              class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 mt-5 p-4 max-h-96 overflow-y-scroll"
            >
              <ul
                class="list-inside list-item mb-2"
                v-for="ta in tas"
                v-if="isDataLoaded"
              >
                <li class="font-bold text-lg">{{ ta["ta"] }}</li>
                <li class="font-light text-sm mb-2 italic">
                  Submitted at: {{ ta.timestamp }}
                </li>
                <li>
                  How strict are the prerequisite requirements?
                  {{ ta.rating[0] }}
                </li>
                <li>
                  How is the pace of the materials covered? {{ ta.rating[1] }}
                </li>
                <li>How in-depth is the material? {{ ta.rating[2] }}</li>
                <li>Your Review:</li>
                <li>{{ ta.explanation }}</li>
                <li class="flex gap-2 place-item-center">
                  <button
                    class="mr-3 bg-indigo-500 hover:bg-indigo-700 font-bold text-white text-sm p-2.5 mt-2 mb-2 rounded-lg"
                    @click="
                      edit(
                        ta.ta,
                        ta.rating[0],
                        ta.rating[1],
                        ta.rating[2],
                        ta.explanation,
                        'ta'
                      )
                    "
                    >Edit</button
                  ><button
                    class="font-bold text-indigo-500 dark:text-indigo-100 text-sm p-2.5 mt-2 mb-2 rounded-lg"
                    @click="deleteta(ta.ta)"
                    >Delete</button
                  >
                </li>
              </ul>
              <ul class="list-inside list-item" v-else>
                <li>No ratings yet!</li>
              </ul>
              <EditRating
                :isOpen="isOpen"
                :closeEdit="closeEdit"
                :title="editTitle"
                :q1="editQ1"
                :q2="editQ2"
                :q3="editQ3"
                :expl="editExpl"
                :type="editType"
                :id="user_id"
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
      <div class="grid justify-end">
        <!--Go home-->
        <button
          class="w-1/8 font-bold text-yellow-700 dark:text-yellow-200 py-2 px-2 rounded-lg"
        >
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
import {
  Switch,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@headlessui/vue";
//import { encrypt } from "iron-webcrypto";
//import test from "node:test";

var userStore = useUserStore();
var isMobile = ref(false);
var isModalVisible = ref(false);
var isEditPrivacyModalVisible = ref(false);
var isCourseModalVisible = ref(false);
var isClassroomModalVisible = ref(false);
var isTAModalVisible = ref(false);
var firstname = ref("");
var lastname = ref("");
var gradMonth = ref("");
var email = ref("");
var gradYear = ref();
var isGradStudent = ref(false);
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

var DeleteAccountDiv = ref(false);
function showDeleteAccount() {
  if (DeleteAccountDiv.value == true) {
    DeleteAccountDiv.value = false;
  } else {
    DeleteAccountDiv.value = true;
  }
}

async function history() {
  var blob = new Blob(
    [
      "User Info\n",
      "User ID: ",
      user_id,
      "\nEmail: ",
      email.value,
      "\nFirst Name: ",
      firstname.value,
      "\nLast Name: ",
      lastname.value,
      "\nGrad Month: ",
      gradMonth.value,
      "\nGrad Year: ",
      gradYear.value,
      "\nIs Grad Student: ",
      isGradStudent.value,
      "\nRequired Courses\n",
      JSON.stringify(selectedRequiredCourses.value, null, 2),
      "\nOptional Courses\n",
      JSON.stringify(selectedOptionalCourses.value, null, 2),
      "\nBookmarks\n",
      JSON.stringify(bookmarkedClasses.value, null, 2),
      "\nClassroom Ratings\n",
      JSON.stringify(classrooms, null, 2),
      "\nTA Ratings\n",
      JSON.stringify(tas, null, 2),
      "\nCourse Ratings\n",
      JSON.stringify(courses, null, 2),
      "\nGroups\n",
      JSON.stringify(groups.value, null, 2),
    ],
    { type: "text/plain;charset=utf-8" }
  );
  // create a link element
    const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);

  // set the file name
  const date = new Date().toISOString().substring(0, 10);
  link.download = `history_${date}.txt`;

  // trigger a download when the link is clicked
  link.click();
}

async function deleteAccount() {
  try {
    var pwd = sha256(password.value);
    const res = await axios
      .post(
        "https://api.boilerti.me/api/deleteuser",
        {
            user_id: user_id,
            password: pwd,
          },
        config
      )
      .then(() => {
          userStore.logOut();
          alert("Account deleted");
          navigateTo("/");
        });
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

function showModal() {
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}

function showEditPrivacyModal() {
  isEditPrivacyModalVisible.value = true;
}

function closeEditPrivacyModal() {
  isEditPrivacyModalVisible.value = false;
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

/** THIS IS FOR EDIT MODAL */

const isOpen = ref(false);

function closeEdit() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

var editTitle = ref("");
var editQ1 = ref("");
var editQ2 = ref("");
var editQ3 = ref("");
var editExpl = ref("");
var editType = ref("");

async function edit(title, q1, q2, q3, expl, type) {
  editTitle.value = title;
  editQ1.value = q1;
  editQ2.value = q2;
  editQ3.value = q3;
  editExpl.value = expl;
  editType.value = type;
  openModal();
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
  axios
    .post(
      "https://api.boilerti.me/api/groups",
      {
        user_id: user_id,
      },
      config
    )
    .then((res) => {
      groups.value = res.data.groups;
    })
    .catch(function (error) {
      console.error(error);
      alert(error);
    });
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
  axios
    .post(
      "https://api.boilerti.me/api/getclasses",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      selectedRequiredCourses.value = response.data.required_classes;
    });
  axios
    .post(
      "https://api.boilerti.me/api/getclasses",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      selectedOptionalCourses.value = response.data.optional_classes;
    });
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

async function submit() {
  console.log(isGradStudent.value + ' this is the value');
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
      closeEditPrivacyModal();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function checkWindowSize() {
  isMobile = window.innerWidth <= 768;
}

onMounted(async () => {
  getUserInfo();
  getBookmarks();
  getGroups();
  getratings();
  getSchedule();
  checkWindowSize();
  window.addEventListener("resize", checkWindowSize);
  setTimeout(() => {
    console.log(courses);
    console.log(classrooms);
    console.log(tas);
    isDataLoaded.value = true;
  }, 1000);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkWindowSize);
});
</script>
