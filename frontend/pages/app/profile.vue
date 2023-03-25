<template>
  <NavBar />
  <div class="h-screen p-16 bg-gray-200">
    <!--Transition Container-->
    <TransitionRoot :show="isModalVisible" enter="transition duration-100" enter-from="opacity-0"
      enter-to="opacity-100 z-index-50" leave="transition duration-100" leave-from="opacity-100" leave-to="opacity-0">
      <!--Edit Profile Modal-->
      <Modal @closed="closeModal">
        <template #header>
          <h1 class="font-extrabold text-3xl">Edit Profile</h1>
        </template>
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="flex flex-row gap-4">
              <div class="flex flex-col gap-2">
                <label for="firstname" class="font-bold">First Name</label>
                <input type="text" id="firstname" v-model="firstname" class="border rounded-lg p-2"
                  placeholder="First Name" />
              </div>
              <div class="flex flex-col gap-2">
                <label for="lastname" class="font-bold">Last Name</label>
                <input type="text" id="lastname" v-model="lastname" class="border rounded-lg p-2"
                  placeholder="Last Name" />
              </div>
            </div>
            <div class="flex flex-row gap-4 place-content-center">
              <div class="flex flex-col gap-4">
                <label for="gradMonth" class="font-bold">Graduation Month</label>
                <select id="gradMonth" v-model="gradMonth" class="border rounded-lg p-2" placeholder="Month">
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
                <label for="gradYear" class="font-bold">Graduation Year</label>
                <select id="gradYear" v-model="gradYear" class="border rounded-lg p-2" placeholder="Year">
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
                <label for="isGradStudent" class="font-bold justify-end">Graduate Student</label>
                <button id="isGradStudent" @click="isGradStudent = !isGradStudent"
                  class="border rounded-lg p-2 bg-blue-500 hover:bg-blue-700 text-white">
                  {{ isGradStudent ? "Yes" : "No" }}
                </button>
              </div>
            </div>
            <button @click="showPasswordChange" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-3 rounded">Change Password</button>
            <div v-if="TestsDiv">
              <form @submit.prevent="() => changePassword()">
                <!--Password text & input box-->
                <label for="password" class="pt-3 block mb-2 text-sm font-medium text-gray-900 dark:text-black">New
                  Password</label>
                <input type="password" id="password" aria-describedby="helper-text-explanation"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="password" required>
                <!--Confirm Password text & input box-->
                <label for="confpassword" class="pt-1 text-sm font-medium text-gray-900 dark:text-black">Confirm
                  Password</label>
                <input type="password" id="confpassword" aria-describedby="helper-text-explanation"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="confpassword" required>

                <!--Confirms the password change-->
                <div class="container py-3 px-5 min-w-full flex flex-col items-center">
                  <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
                    Confirm Change
                  </button>
                </div>
              </form>
            </div>
          </div>
        </template>
        <template #footer>
          <button type="button" class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-lg"
            @click="submit">
            Submit
          </button>
        </template>
      </Modal>
    </TransitionRoot>

    <!--Profile Card-->
    <div class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row">
      <!--Flex grouping for profile info content-->
      <div class="flex flex-auto gap-4">
        <!--Profile Picture-->
        <div
          class="rounded-full h-24 w-24 text-white bg-yellow-500 flex items-center justify-center text-4xl font-extrabold">
          <h1>{{ firstname[0] }}{{ lastname[0] }}</h1>
        </div>
        <!--Profile Info-->
        <div class="place-self-center">
          <h1 class="font-extrabold text-2xl">
            {{ firstname }} {{ lastname }}
          </h1>
          <h1 class="font-light text-md">{{ gradMonth }} {{ gradYear }}</h1>
          <h1 class="font-light text-md">
            {{ isGradStudent ? "Graduate" : "Undergraduate" }}
          </h1>
        </div>
      </div>
      <!--Flex grouping for user ratings-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl mb-5">User Ratings ⭐️</h1>
      </div>
      <div class="bg-gray-300 rounded-lg max-w-full mb-5 mt-5 p-4">
        <h1 class="font-bold text-2xl mt-3 mb-3">Courses</h1>
        <ul class="list-inside list-item mb-6" v-for="(course, index) in courses" :key="index" v-if="isDataLoaded">
          <li class="font-bold text-lg">{{ course.course }}</li>
          <li class="font-light text-sm mb-2">Submitted at: {{ course.timestamp }}</li>
          <li class="font-light text-sm mb-2 text-red-500" v-if="course.flag_count >= 3">This review has been flagged for
            review by the content moderators</li>
          <li>How strict are the prerequisite requirements: {{ course.rating[0] }}</li>
          <li>How is the pace of the materials covered: {{ course.rating[1] }}</li>
          <li>How in-depth is the material: {{ course.rating[2] }}</li>
          <li class="mt-6"><a class="mr-3 bg-yellow-500 p-3 rounded-md"
              @click="edit(course.course, course.rating[0], course.rating[1], course.rating[2], 'course', userStore.user_id)">Edit</a><a
              class="bg-red-500 p-3 rounded-md" @click="deletecourses(course.course)">Delete</a>
            <a class="ml-3 bg-blue-500 p-3 rounded-md" @click="flag">Flag</a>
          </li>
        </ul>
        <h1 class="font-bold text-2xl mt-3 mb-3">Classrooms</h1>
        <ul class="list-inside list-item mb-6" v-for="classroom in classrooms" v-if="isDataLoaded">
          <li class="font-bold text-lg">{{ classroom["classroom"] }}</li>
          <li class="font-light text-sm mb-2">Submitted at: {{ classroom.timestamp }}</li>
          <li class="font-light text-sm mb-2 text-red-500" v-if="classroom.flag_count >= 3">This review has been flagged
            for review by the content moderators</li>
          <li>How strict are the prerequisite requirements: {{ classroom.rating[0] }}</li>
          <li>How is the pace of the materials covered: {{ classroom.rating[1] }}</li>
          <li>How in-depth is the material: {{ classroom.rating[2] }}</li>
          <li class="mt-6"><a class="mr-3 bg-yellow-500 p-3 rounded-md"
              @click="edit(classroom.classroom, classroom.rating[0], classroom.rating[1], classroom.rating[2], 'classroom', userStore.user_id)">Edit</a><a
              class="bg-red-500 p-3 rounded-md" @click="deleteclassrooms(classroom.classroom)">Delete</a>
            <a class="ml-3 bg-blue-500 p-3 rounded-md" @click="flag">Flag</a>
          </li>
        </ul>
        <h1 class="font-bold text-2xl mt-3 mb-3">TAs</h1>
        <ul class="list-inside list-item mb-6" v-for="ta in tas" v-if="isDataLoaded">
          <li class="font-bold text-lg">{{ ta["ta"] }}</li>
          <li class="font-light text-sm mb-2">Submitted at: {{ ta.timestamp }}</li>
          <li class="font-light text-sm mb-2 text-red-500" v-if="ta.flag_count >= 3">This review has been flagged for
            review by the content moderators</li>
          <li>How strict are the prerequisite requirements: {{ ta.rating[0] }}</li>
          <li>How is the pace of the materials covered: {{ ta.rating[1] }}</li>
          <li>How in-depth is the material: {{ ta.rating[2] }}</li>
          <li class="mt-6"><a class="mr-3 bg-yellow-500 p-3 rounded-md"
              @click="edit(ta.ta, ta.rating[0], ta.rating[1], ta.rating[2], 'ta')">Edit</a><a
              class="bg-red-500 p-3 rounded-md" @click="deleteta(ta.ta)">Delete</a>
            <a class="ml-3 bg-blue-500 p-3 rounded-md" @click="flag">Flag</a>
          </li>
        </ul>
        <ul class="list-inside list-item" v-else>
          <li>No ratings yet!</li>
        </ul>
        <EditRating :isOpen="isOpen" :closeEdit="closeEdit" :title="editTitle" :q1="editQ1" :q2="editQ2" :q3="editQ3"
          :type="editType" :id="user_id" />
      </div>
      <!--Flex grouping for bookmarked classes-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl mb-5">Bookmarked Classes ❗️</h1>
        <div class="bg-gray-300 rounded-lg max-w-full mb-5 mt-5 p-4">
          <ul class="list-inside list-item">
            <li class="mb-2 font-bold" v-for="(item, index) in bookmarkedClasses" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <!--Edit Profile Button-->
      <div class="grid grid-flow-col gap-4 justify-end mb-5">
        <button type="button" class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-lg"
          @click="showModal">
          Edit Profile
        </button>
        <!--Go home-->
        <button class="w-1/8 bg-gray-400 hover:bg-gray-700 text-white py-2 px-2 rounded-lg">
          <a href="/app/home">Home</a>
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
import sha256 from 'js-sha256'
import { encrypt } from "iron-webcrypto";

var userStore = useUserStore();
var isModalVisible = ref(false);
var isCourseModalVisible = ref(false);
var isClassroomModalVisible = ref(false);
var isTAModalVisible = ref(false);
var firstname = ref("");
var lastname = ref("");
var gradMonth = ref("");
var gradYear = ref();
var isGradStudent = ref();
var bookmarkedClasses = ref([]);

var user_id = userStore.user_id

const password = ref('')
const confpassword = ref('')
var TestsDiv=ref(false);
function showPasswordChange() {
  TestsDiv.value = true;
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
  await axios.post('http://localhost:3001/api/encryptuserid', {
    user_id: user_id
  })
  .then((res) => {
    encrypteduserid = res.data.user_id;
  })
  .catch(function (error) {
    console.error(error)
    alert("Error: " + error)
  });
  // Resetting the password
  if (newpassword === newconfpassword) {
    await axios.post('http://localhost:3001/api/resetpassword', {
      user_id: encrypteduserid,
      password: newpassword
    })
      .then(function () {
        alert("Password has been changed.")
        navigateTo("/app/profile")
      })
      .catch(function (error) {
        console.error(error)
        alert("Error: " + error)
      });
  } else {
    alert("Passwords do not match.")
  }
}

/* CAPTCHA variables */
const randval1 = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1))
const randval2 = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1))
const actualval = randval1 + randval2
const enterval = ref('')

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

const isOpen = ref(false)

function closeEdit() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}

var editTitle = ref("")
var editQ1 = ref("")
var editQ2 = ref("")
var editQ3 = ref("")
var editType = ref("")

async function edit(title, q1, q2, q3, type) {
  editTitle.value = title
  editQ1.value = q1
  editQ2.value = q2
  editQ3.value = q3
  editType.value = type
  openModal()
}

/** THE ABOVE IS FOR EDIT MODAL */

async function getBookmarks() {
  axios
    .post("http://localhost:3001/api/getbookmarks", {
      user_id: userStore.user_id,
    })
    .then((response) => {
      console.log(response.data.bookmarks);
      bookmarkedClasses.value = response.data.bookmarks;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function deletecourses(course) {
  axios
    .post("http://localhost:3001/api/delete/ratings/courses", {
      user_id: userStore.user_id,
      course: course,
    })
    .then((response) => {
      console.log(response.data);
      alert("Successfully deleted request")
      location.reload()
    })
    .catch((error) => {
      console.error(error);
    });
}

async function deleteclassrooms(classroom) {
  axios
    .post("http://localhost:3001/api/delete/ratings/classrooms", {
      user_id: userStore.user_id,
      classroom: classroom,
    })
    .then((response) => {
      console.log(response.data);
      alert("Successfully deleted request")
      location.reload()
    })
    .catch((error) => {
      console.error(error);
    });
}

async function deleteta(ta) {
  axios
    .post("http://localhost:3001/api/delete/ratings/tas", {
      user_id: userStore.user_id,
      ta: ta,
    })
    .then((response) => {
      console.log(response.data);
      alert("Successfully deleted request")
      location.reload()
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getUserInfo() {
  axios
    .post("http://localhost:3001/api/get/profile/", {
      user_id: userStore.user_id,
    })
    .then((response) => {
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
      gradMonth.value = response.data.grad_month;
      gradYear.value = response.data.grad_year;
      isGradStudent.value = response.data.is_grad_student;
    })
    .catch((error) => {
      console.error(error);
    });
}

let courses = []
let classrooms = []
let tas = []

async function getratings() {
  await axios.post("http://localhost:3001/api/get/user_ratings/courses", {
    user_id: userStore.user_id
  }).then((response) => {
    courses = response.data
  }).catch((error) => {
    console.error(error)
  })
  await axios.post("http://localhost:3001/api/get/user_ratings/classrooms", {
    user_id: userStore.user_id
  }).then((response) => {
    classrooms = response.data
  }).catch((error) => {
    console.error(error)
  })
  await axios.post("http://localhost:3001/api/get/user_ratings/tas", {
    user_id: userStore.user_id
  }).then((response) => {
    tas = response.data
  }).catch((error) => {
    console.error(error)
  })
}

async function flagCourse(course) {
  if (actualval == enterval.value) {
    await axios.post("http://localhost:3001/api/add/flag", {
      type: 'course',
      user_id: userStore.user_id,
      name: course.name.value
    })
      .then(function () {
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
    .post("http://localhost:3001/api/update/profile", {
      user_id: userStore.user_id,
      firstname: firstname.value,
      lastname: lastname.value,
      classification_year: "Freshman",
      grad_month: gradMonth.value,
      grad_year: gradYear.value,
      is_grad_student: isGradStudent.value,
    })
    .then((response) => {
      isModalVisible.value = false;
    })
    .catch((error) => {
      console.error(error);
    });
}

onMounted(async () => {
  getUserInfo();
  getBookmarks();
  await getratings();
  setTimeout(() => {
    console.log(courses)
    console.log(classrooms)
    console.log(tas)
    isDataLoaded.value = true;
  }, 1000)
});

</script>