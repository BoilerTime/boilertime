<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <h2 class="text-sm font-light italic">
    Tailwind works :)
  </h2>

  <!--Button that takes you to login page-->
  <div class="fixed top-2 right-4">

    <a href="/auth/login">
      <button type="button" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
    </a>
  </div>

  <!--Button that takes you to the register page-->
  <div class="fixed top-115 right-2">
    <a href="/auth/register">
      <button type="button" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
        Sign Up
      </button>
    </a>
  </div>

</template>
  