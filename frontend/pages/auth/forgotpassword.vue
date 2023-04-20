<!--forgotpassword.vue is a page dedicated to allowing users to begin the password reset process.
    It will ask for the user's email, then sending an email that they will-->
<template>
  <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
    <br />
    <div class="mx-auto my-10 5px max-w-sm p-6 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">

      <!--Reset Password Text-->
      <h1 class="pb-4 text-center text-2x1 font-bold">Reset Password</h1>
      <h2 class="pb-4 text-center text 2x1 font-normal">Enter the email you use to sign in, then check your email for
        further instruction.</h2>

      <form @submit.prevent="() => sendemail()">
        <!--Email text & input box-->
        <label for="email" class="pt-3 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
        <input type="email" id="email" aria-describedby="helper-text-explanation"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
          placeholder="username@purdue.edu" v-model="email" required>

        <!--Attempts to login-->
        <div class="container py-7 px-5 min-w-full flex flex-col items-center">
          <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
            Send Email
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
      
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from "../../store/user";
const email = ref('')
const userStore = useUserStore();
const { $toast } = useNuxtApp()
/**
 * A function to call the resetPassword function
 */
async function sendemail() {
  userStore.user.num_fg_clicks = userStore.num_fg_clicks + 1;
  if (userStore.num_fg_clicks < 3) {
    await axios.post('https://api.boilerti.me/api/forgotpassword', {
      email: email.value
    })
      .then(function () {
        $toast.info("Email has been sent")
      })
      .catch(function (error) {
        console.error(error);
        $toast.error("User does not exist.")
      });
  } else {
    $toast.error("You have exceeded the amount of times you can reset passwrod! Please try again later.", {
      timeout: 5000,
    });
  }
}
</script>