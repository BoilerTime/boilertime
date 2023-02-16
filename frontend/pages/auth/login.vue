<template>
  <body class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
    <br />
    <div class="mx-auto my-10 5px max-w-sm p-6 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">
      
      <!--Welcome back text-->
      <h1 class="pb-4 text-center text-2x1 font-bold">Welcome Back</h1>
      
      <!--Incorrect email/password combo-->
      <div class="pt-3 bg-red-500 w-full p-4 rounded text-white mb-3">
        Wrong email/password combination
      </div>

      <!--Email text & input box-->
      <label for="email" class="pt-3 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
      <input type="email" id="email" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
        placeholder="username@purdue.edu" required>

      <!--Password text & input box-->
      <label for="password" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
      <input type="password" id="password" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
        placeholder="•••••••••" required>

      <!--Attempts to login-->
      <div class="container py-7 px-5 min-w-full flex flex-col items-center">
        <button type="button" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
          Login
        </button>
      </div>
      <!--Currently redirects to index.vue, needs to be updated-->
      <div class="container py-0 px-10 mx-0 min-w-full flex flex-col items-center">
        <a href="../">
        <button type="button" class="bg-white hover:bg-gray-200 text-gray-400 font-bold py-1 px-2 rounded text-xs">
          Forgot Password?
        </button>
        </a>
      </div>
    </div>
  </body>
</template>
  
<script>
export default {
  name:'Login'
}
</script>