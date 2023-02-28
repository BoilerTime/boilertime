<!--The purpose of verifyemail.vue is to show the user a page requesting them
    to verify their email after registering for an account.-->
<template>
    <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
        <br />
        <div class="mx-auto my-10 5px max-w-sm p-6 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">
            <!--Verified Email text-->
            <h1 class="pb-4 text-center text-2x1 font-bold">Thank you for verifying your account. Redirecting you to the Login Page.</h1>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'

const user_id = route.query.user_id

/**
 * A function that will make sure the user's userid matches with the emailed one.
 */
window.onload = function() {
    axios.post('http://localhost:3001/api/verifyaccount', {
        user_id: user_id
    })
    .then(function () {
        navigateTo("/auth/login")
    })
    .catch(function (error) {
        console.error(error)
    })
}
</script>