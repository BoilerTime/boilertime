<!--The purpose of verifyemail.vue is to show the user a page requesting them
    to verify their email after registering for an account.-->
<template>
  <div class="h-screen bg-gray-300 flex items-center">
    <div class="mx-auto p-6 bg-white rounded-lg shadow-lg">
      <!--Verified Email text-->
      <h1 ref="verify" class="text-center text-xl font-bold">
        Verifying your account...
      </h1>
      <div class="mt-8 flex justify-center items-center">
        <div
          class="w-24 h-24 bg-gradient-to-r from-indigo-200 to-indigo-500 rounded-full animate-spin"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { POSITION, useToast } from "vue-toastification";

const route = useRoute();
const user_id = route.query.id;
const toast = useToast();
//console.log(user_id + 'this is the user id');

/**
 * A function that will make sure the user's userid matches with the emailed one.
 */
onBeforeMount(async () => {
  await axios
    .post("http://localhost:3001/api/verifyaccount", {
      userID: user_id,
    })
    .then((res) => {
      //alert("Verification has been successful.");
      toast.success("Verification has been successful!", {
        position: POSITION.BOTTOM_LEFT,
      });
      navigateTo("/auth/login");
    })
    .catch((error) => {
      console.log(error + "HERE");
      console.log(error.response.status);
      if (error.response.status == 400) {
        //console.log('HERHEHEHRHE')
        //alert("You have not provided an account to verify");
        toast.error("You have not provided an account to verify!", {
          position: POSITION.BOTTOM_LEFT,
        });
        navigateTo("/auth/register");
      } else if (error.response.status == 409) {
        console.error(error);
        //alert("Account is already verified");
        toast.error("Account is already verified!", {
          position: POSITION.BOTTOM_LEFT,
        });
        navigateTo("/auth/login");
      } else {
        //alert("Account does not exist");
        //alert("Unknown error")
        toast.error("Unknown error!", {
          position: POSITION.BOTTOM_LEFT,
        });
        navigateTo("/auth/register");
      }
    });
});
</script>
