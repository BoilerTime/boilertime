<template>
  <div class="h-screen p-16 bg-gray-200">
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
          <h1 class="font-extrabold text-3xl">Edit Profile</h1>
        </template>
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="flex flex-row gap-4">
              <div class="flex flex-col gap-2">
                <label for="firstname" class="font-bold">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  v-model="firstname"
                  class="border rounded-lg p-2"
                  placeholder="First Name"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label for="lastname" class="font-bold">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  v-model="lastname"
                  class="border rounded-lg p-2"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div class="flex flex-row gap-4 place-content-center">
              <div class="flex flex-col gap-4">
                <label for="gradMonth" class="font-bold"
                  >Graduation Month</label
                >
                <select
                  id="gradMonth"
                  v-model="gradMonth"
                  class="border rounded-lg p-2"
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
                <label for="gradYear" class="font-bold">Graduation Year</label>
                <select
                  id="gradYear"
                  v-model="gradYear"
                  class="border rounded-lg p-2"
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
                <label for="isGradStudent" class="font-bold justify-end"
                  >Graduate Student</label
                >
                <button
                  id="isGradStudent"
                  @click="isGradStudent = !isGradStudent"
                  class="border rounded-lg p-2 bg-blue-500 hover:bg-blue-700 text-white"
                >
                  {{ isGradStudent ? "Yes" : "No" }}
                </button>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <button
            type="button"
            class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-lg"
            @click="submit"
          >
            Submit
          </button>
        </template>
      </Modal>
    </TransitionRoot>

    <!--Profile Card-->
    <div
      class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row"
    >
      <!--Flex grouping for profile info content-->
      <div class="flex flex-auto gap-4">
        <!--Profile Picture-->
        <div
          class="rounded-full h-24 w-24 text-white bg-yellow-500 flex items-center justify-center text-4xl font-extrabold"
        >
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
      <!--Flex grouping for bookmarked classes-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl mb-5">Bookmarked Classes ❗️</h1>
        <div
          class="bg-gray-300 rounded-lg max-w-full mb-5 mt-5 p-4"
        >
          <ul class="list-inside list-item">
            <li
              class="mb-2 font-bold"
              v-for="(item, index) in bookmarkedClasses"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <!--Edit Profile Button-->
      <div class="grid grid-flow-col gap-4 justify-end mb-5">
        <button
          type="button"
          class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-lg"
          @click="showModal"
        >
          Edit Profile
        </button>
        <!--Go home-->
        <button
          class="w-1/8 bg-gray-400 hover:bg-gray-700 text-white py-2 px-2 rounded-lg"
        >
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

var userStore = useUserStore();
var isModalVisible = ref(false);
var firstname = ref("");
var lastname = ref("");
var gradMonth = ref("");
var gradYear = ref();
var isGradStudent = ref();
var bookmarkedClasses = ref([]);

function showModal() {
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}

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

onMounted(() => {
  getUserInfo();
});

onMounted(() => {
  getBookmarks();
});

</script>
