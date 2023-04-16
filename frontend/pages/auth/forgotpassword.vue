<!--forgotpassword.vue is a page dedicated to allowing users to begin the password reset process.
    It will ask for the user's email, then sending an email that they will-->
<template>
  <div class="h-screen bg-gray-300 flex items-center p-6">
    <div class="mx-auto p-6 bg-white border rounded-lg shadow">
      <!--Reset Password Text-->
      <h1 class="pb-2 text-center text-2xl font-bold">Reset Password</h1>
      <h2 class="pb-2 text-center text-md font-normal">
        Tell us your email, and we'll send you a link to reset your password.
      </h2>

      <form @submit.prevent="() => sendemail()">
        <!--Email text & input box-->
        <label
          for="email"
          class="block py-2 text-sm font-bold"
          >Email</label
        >
        <input
          type="email"
          id="email"
          class="border border-black text-sm rounded-lg block w-full p-2.5"
          placeholder="pete@purdue.edu"
          v-model="email"
          required
        />

        <!--Attempts to login-->
        <div class="py-4 flex flex-col items-center">
          <button
            type="submit"
            class="bg-black hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { POSITION, useToast } from "vue-toastification";
const email = ref("");
const toast = useToast();

/**
 * A function to call the resetPassword function
 */
async function sendemail() {
  await axios
    .post("http://localhost:3001/api/forgotpassword", {
      email: email.value,
    })
    .then(function () {
      //alert("Email has been sent")
      toast.success("Email has been sent", {
        position: POSITION.BOTTOM_LEFT,
      });
      navigateTo("/auth/login");
    })
    .catch(function (error) {
      //console.error(error);
      //alert("User does not exist.")
      toast.error("User does not exist.", {
        position: POSITION.BOTTOM_LEFT,
      });
    });
}
</script>
