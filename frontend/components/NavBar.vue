<template>
  <header class="bg-white">
    <nav class="flex items-center justify-between px-12 py-8 mx-auto">
      <div class="flex">
        <a href="/" class="-m-1.5 p-1.5">
          <img class="w-auto h-10" src="/logo.png" />
        </a>
      </div>
      <div v-if="isLoggedIn" class="flex items-center justify-end">
        <a href="/app/profile" class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8">Your Profile</a>
        <a href="/app/create" class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8">Create Schedule</a>
        Logged in as: {{ firstname + ' ' + lastname }}
      </div>
      <div v-else class="flex items-center justify-end">
        <a href="/auth/login" class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8">Log in</a>
        <a href="/auth/register" class="px-3 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-md shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-yellow-600">Sign up</a>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "../store/user"
import { ref } from "vue"

let isLoggedIn = false;
var firstname = ref("")
var lastname = ref("")

const userStore = useUserStore()

const accessToken = userStore.accessToken;
console.log('ACCESS TOKEN ' + accessToken);
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}



try {
} catch (err) {
  console.log(err)
}


isLoggedIn = userStore.isLoggedIn

async function getUserInfo() {
  axios
    .post("http://localhost:3001/api/get/profile/", {
      user_id: userStore.user_id,
    }, config)
    .then((response) => {
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
    })
    .catch((error) => {
      console.error(error);
    });
}

onMounted(() => {
  getUserInfo();
});

</script>
