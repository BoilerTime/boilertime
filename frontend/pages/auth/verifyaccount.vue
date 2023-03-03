<!--The purpose of verifyemail.vue is to show the user a page requesting them
    to verify their email after registering for an account.-->
<template>
    <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
        <br />
        <div class="mx-auto my-10 5px max-w-sm p-6 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">
            <!--Verified Email text-->
            <h1 ref="verify" class="pb-4 text-center text-2x1 font-bold">Verifying your account right now. Please wait.</h1>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import axios from 'axios'

const route = useRoute()
const user_id = route.query.id
console.log(user_id + 'this is the user id');

/**
 * A function that will make sure the user's userid matches with the emailed one.
 */
onBeforeMount(async () => {
    await axios.post('http://localhost:3001/api/verifyaccount', {
        userID: user_id
    })
      .then((res) => {
            alert("Verification has been successful.")
            navigateTo("/auth/login")
        })
        .catch((error) => {
            console.log(error + "HERE");
            console.log(error.response.status);
            if (error.response.status == 400) {
            console.log('HERHEHEHRHE')
              alert("You have not provided an account to verify");
              navigateTo('/auth/register');
            }
            else if (error.response.status == 409) {
              console.error(error)
              alert("Account is already verified");
              navigateTo('/auth/login');
            }
            else {
              //alert("Account does not exist");
              alert("Unknown error")
              navigateTo('/auth/register');
            }
        })
})
</script>
