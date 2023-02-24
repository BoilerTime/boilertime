<!--resetpassword.vue is a page dedicated to allowing users to begin the password reset process.
    It will ask for the user's email, then sending an email that they will-->
<template>
  <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
    <br />
    <div class="mx-auto my-10 5px max-w-sm p-6 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">

      <!--Reset Password Text-->
      <h1 class="pb-4 text-center text-2x1 font-bold">Reset Password</h1>

      <form @submit.prevent="() => resetpassword()">
        <!--Password text & input box-->
        <label for="password" class="pt-3 block mb-2 text-sm font-medium text-gray-900 dark:text-black">New
          Password</label>
        <input type="password" id="password" aria-describedby="helper-text-explanation"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="password" required>
        <!--Confirm Passord text & input box-->
        <label for="confpassword" class="pt-3 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Confirm
          Password</label>
        <input type="password" id="confpassword" aria-describedby="helper-text-explanation"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="confpassword" required>

        <!--Attempts to login-->
        <div class="container py-7 px-5 min-w-full flex flex-col items-center">
          <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const route = useRoute()

const user_id = route.query.user_id
const password = ref('')
const confpassword = ref('')

async function resetpassword() {
  if (password.value === confpassword.value) {
    await axios.post('http://localhost:3001/api/resetpassword', {
      user_id: user_id,
      password: password.value
    })
      .then(function () {
        alert("Password has been reset.")
        navigateTo("/auth/login")
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    alert("Passwords do not match")
  }
}
</script>