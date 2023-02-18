<!--register.vue is a page dedicated to allowing users to create a profile for the website.
    It will ask for an email, password, and then a password confirmation.-->
<template>
  <body class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
    <br />
    <div class="mx-auto w-5/12 p-3 bg-white border rounded-lg shadow sm:p-7 md:p-8 dark:bg-white">
      <!--Welcome back text-->
      <h1 class="pb-2 text-center text-2x1 font-bold">Welcome to BoilerTime</h1>

      <!--Email text & input box-->
      <label for="email" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
      <input type="email" id="email" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
        placeholder="username@purdue.edu">

      <div class="gap-8 columns-2">
        <!--First Name text & input box-->
        <label for="firstname" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">First Name</label>
        <input type="firstname" id="firstname" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
          placeholder="John">

        <!--Last Name text & input box-->
        <label for="lastname" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Last Name</label>
        <input type="lastname" id="lastname" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
          placeholder="Doe">
      </div>

      <div class="gap-8 columns-2">
        <!--Password text & input box-->
        <label for="password" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
        <input type="password" id="password" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500">

        <!--Confirm Password text & input box-->
        <label for="confPassword" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Confirm Password</label>
        <input type="password" id="confPassword" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500">
      </div>
      <!--Attempts to register-->
      <div class="container pt-5 px-5 min-w-full flex flex-col items-center">
        <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
          Sign Up
        </button>
      </div>
    </div>
  </body>
</template>

<script setup>
  export default {
    data() {
      return {
        email: '',
        firstname: '',
        lastname: '',
        password: '',
      };
    }
  }
</script>