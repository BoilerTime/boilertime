<!--resetpassword.vue is a page dedicated to allowing users to begin the password reset process.
    It will ask for the user's email, then sending an email that they will-->
<template>
  <div class="h-screen bg-gray-300 flex items-center">
    <div class="mx-auto w-72 p-6 bg-white border rounded-lg shadow">
      <!--Reset Password Text-->
      <h1 class="pb-2 text-center text-2xl font-bold">Reset Password</h1>

      <form @submit.prevent="() => resetpassword()">
        <!--Password text & input box-->
        <label
          for="password"
          class="block py-2 text-sm font-bold"
          >New Password</label
        >
        <input
          type="password"
          id="password"
          class="bg-gray-50 border border-black text-sm rounded-lg block w-full p-2.5"
          placeholder="Enter your new password"
          v-model="password"
          required
        />
        <!--Confirm Passord text & input box-->
        <label
          for="confpassword"
          class="block py-2 text-sm font-bold"
          >Confirm Password</label
        >
        <input
          type="password"
          id="confpassword"
          class="bg-gray-50 border border-black text-sm rounded-lg block w-full p-2.5"
          placeholder="Confirm your new password"
          v-model="confpassword"
          required
        />

        <!--Attempts to login-->
        <div class="py-4 flex flex-col items-center">
          <button
            type="submit"
            class="bg-black hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import sha256 from "js-sha256";
import { POSITION, useToast } from "vue-toastification";

const route = useRoute();
const user_id = route.query.user_id;
const password = ref("");
const confpassword = ref("");
const toast = useToast();

/**
 * A function that will make sure the user_id is correct and will then
 * change the newly inputted password.
 */
async function resetpassword() {
  var newpassword = sha256(password.value);
  var newconfpassword = sha256(confpassword.value);
  if (newpassword === newconfpassword) {
    await axios
      .post("http://localhost:3001/api/resetpassword", {
        user_id: user_id,
        password: newpassword,
      })
      .then(function () {
        //alert("Password has been reset.")
        toast.success("Password has been reset.", {
          position: POSITION.BOTTOM_LEFT,
        });
        navigateTo("/auth/login");
      })
      .catch(function (error) {
        //console.error(error)
        //alert("Email does not exist. Please re-enter.")
        toast.error("Email does not exist. Please re-enter.", {
          position: POSITION.BOTTOM_LEFT,
        });
      });
  } else {
    //alert("Passwords do not match")
    toast.error("Passwords do not match", {
      position: POSITION.BOTTOM_LEFT,
    });
  }
}
</script>
