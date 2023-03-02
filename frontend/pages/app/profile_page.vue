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
    leave-to="opacity-0">
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
                />
              </div>
              <div class="flex flex-col gap-2">
                <label for="lastname" class="font-bold">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  v-model="lastname"
                  class="border rounded-lg p-2"
                />
              </div>
            </div>
            <div class="flex flex-row gap-4">
              <div class="flex flex-col gap-2">
                <label for="gradMonth" class="font-bold">Graduation Month</label>
                <input
                  type="text"
                  id="gradMonth"
                  v-model="gradMonth"
                  class="border rounded-lg p-2"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label for="gradYear" class="font-bold">Graduation Year</label>
                <input
                  type="text"
                  id="gradYear"
                  v-model="gradYear"
                  class="border rounded-lg p-2"
                />
              </div>
            </div>
            <div class="flex flex-row gap-4 justify-center">
              <div class="flex flex-col gap-2">
                <label for="isGradStudent" class="font-bold">Graduate Student</label>
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
        <h1 class="font-bold text-2xl mb-5">User Ratings</h1>
      </div>
      <!--Flex grouping for bookmarked classes-->
      <div class="mt-5">
        <h1 class="font-bold text-2xl mb-5">Bookmarked Classes</h1>
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

const userStore = useUserStore();
const isModalVisible = ref(false);
const userID = ref("xyz");
const firstname = ref("John");
const lastname = ref("Doe");
const gradMonth = ref("May");
const gradYear = ref("2022");
const isGradStudent = ref(false);

function showModal() {
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}

function return_data() {

  return {

    user_id: this.userID,
    firstname: this.firstname,
    lastname: this.lastname,
    gradMonth: this.gradMonth,
    gradYear: this.gradYear,
    isGradStudent: this.isGradStudent,

  };

}

async function getUserInfo() {
  axios
    .get("http://localhost:3000/api/user/" + userStore.user.id)
    .then((response) => {
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
      gradMonth.value = response.data.gradMonth;
      gradYear.value = response.data.gradYear;
      isGradStudent.value = response.data.isGradStudent;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function submit() {
  axios
    .put("http://localhost:3000/api/user/" + userStore.user.id, return_data())
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>
