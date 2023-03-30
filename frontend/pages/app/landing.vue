<template>
  <main>
    <!--Container for the home nav bar-->
    <header class="bg-white">
      <!--Nav Tag-->
      <nav class="mx-auto flex items-center justify-between py-8 px-12">
        <!--Logo-->
        <div class="flex">
          <a href="/app/landing" class="flex items-center gap-4">
            <img class="h-10 w-auto" src="/logo.png" />
            <p class="text-2xl font-bold">BoilerTime</p>
          </a>
        </div>
        <div class="justify-end">
          <a
            href="/auth/login"
            class="justify-end hover:text-yellow-700 text-lg font-bold text-black"
          >
            Already a user?
          </a>
        </div>
      </nav>
    </header>
    <!--Main Body-->
    <div class="bg-white flex-col h-screen overflow-x-auto">
      <!--Hero, Sign up-->
      <div class="flex-col text-center bg-yellow-500 p-36">
        <!--Title-->
        <h1 class="text-5xl font-extrabold text-white">
          Your Purdue GRIT® doesn't have to include a poor schedule
        </h1>
        <h2 class="text-2xl font-bold text-white">
          BoilerTime is your solution to the quarterly fear of a bad schedule.
        </h2>
        <h2 class="text-2xl font-bold text-white outline-black">
          Quickly create perfect schedules that fit your preferences and
          maximize your semester.
        </h2>
        <!--Live counting statistic-->
        <!--Sign up button-->
        <div class="pt-16">
          <a
            href="/auth/register"
            class="justify-center text-2xl font-bold text-black rounded-lg px-5 py-4 bg-white hover:bg-gray-200"
            >Sign Up</a
          >
        </div>
      </div>
      <div class="flex justify-center bg-indigo-500">
        <!--Ending, Second sign up attempt-->
        <h1>
            
        </h1>
      </div>
    </div>
  </main>
</template>
<script setup>
import {} from "@heroicons/vue/24/outline";
import {} from "@heroicons/vue/24/solid";
import { TransitionRoot } from "@headlessui/vue";
</script>
