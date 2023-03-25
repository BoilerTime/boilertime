<template>
  <header class="bg-white dark:bg-neutral-700">
    <nav class="mx-auto flex items-center justify-between py-8 px-12">
      <div class="flex">
        <!-- Logo -->
        <a href="/app/home" class="-m-1.5 p-1.5">
          <img class="h-10 w-auto" src="/logo.png" />
        </a>
      </div>
      <!-- Menu for logged in User -->
      <div
        v-if="isLoggedIn"
        class="flex items-center justify-end dark:text-gray-100"
      >
        <!-- Dark Mode Toggle -->
        <div>
          <Menu as="div" class="relative inline-block text-left mr-8">
            <div>
              <MenuButton
                class="h-8 w-8 mt-1 hover:bg-gray-100 hover:rounded-full dark:hover:bg-neutral-600 dark:hover:rounded-full"
              >
                <sun v-if="!isDarkMode" class="h-7 w-7 ml-0.5 text-yellow-500">
                </sun>
                <moon v-else class="h-7 w-7 ml-0.5 text-purple-500"> </moon>
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transform duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems
                class="absolute -left-1.5 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-600"
              >
                <div class="p-1">
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-neutral-500 dark:text-gray-100'
                          : 'text-gray-900 dark:text-white',
                        'flex w-full rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="setTheme(false)"
                    >
                      <sun
                        :active="active"
                        class="mr-2 h-5 w-5 text-yellow-500"
                      >
                      </sun>
                      Light
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-neutral-500 dark:text-gray-100'
                          : 'text-gray-900 dark:text-white',
                        'flex w-full rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="setTheme(true)"
                    >
                      <moon
                        :active="active"
                        class="mr-2 h-5 w-5 text-purple-500"
                      >
                      </moon>
                      Dark
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-neutral-500 dark:text-gray-100'
                          : 'text-gray-900 dark:text-white',
                        'flex w-full rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="setTheme()"
                    >
                      <computer
                        :active="active"
                        class="mr-2 h-5 w-5 text-teal-500"
                      >
                      </computer>
                      System
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <!-- Profile Button -->
        <a
          href="/app/profile"
          class="lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8 dark: dark:lg:text-gray-100"
          >Your Profile</a
        >
        <!-- Create Schedule Button -->
        <a
          href="/app/create"
          class="lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8 dark: dark:lg:text-gray-100"
          >Create Schedule</a
        >
        Logged in as: {{ userStore.user.user_id.slice(0, 10) }}...
      </div>
      <!-- Menu for not logged in User -->
      <div v-else class="flex items-center justify-end">
        <!-- Login Button -->
        <a
          href="/auth/login"
          class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8"
          >Log in</a
        >
        <!-- Sign Up Button -->
        <a
          href="/auth/register"
          class="rounded-md bg-yellow-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-yellow-600"
          >Sign up</a
        >
      </div>
    </nav>
  </header>
</template>

<script setup>
//import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "../store/user";
import { ref } from "vue";
import {
  MoonIcon as moon,
  SunIcon as sun,
  ComputerDesktopIcon as computer,
} from "@heroicons/vue/24/outline";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

let isLoggedIn = false;
var firstname = ref("");
var lastname = ref("");
var isDarkMode = ref();

const userStore = useUserStore();
const { $isDarkMode } = useNuxtApp();

try {
} catch (err) {
  console.log(err);
}

isLoggedIn = userStore.isLoggedIn;
//isDarkMode = userStore.isDarkMode;

async function verifyToken() {
  await userStore
    .verifyToken(userStore.accessToken, userStore.user_id)
    .then((res) => {
      //console.log(res.accessToken);
    });
}

async function getUserInfo() {
  axios
    .post("http://localhost:3001/api/get/profile/", {
      user_id: userStore.user_id,
    })
    .then((response) => {
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function setTheme(darkMode) {
  isDarkMode.value = darkMode;
  axios
    .post("http://localhost:3001/api/set/darkmode/", {
      user_id: userStore.user_id,
      dark_mode: isDarkMode.value,
    })
    .catch((error) => {
      console.error(error);
    });
}

onMounted(() => {
  getUserInfo();
  verifyToken();
  if (userStore.dark_mode == undefined) {
    isDarkMode.value = $isDarkMode;
    console.log(isDarkMode.value);
    console.log("system")
  } else {
    isDarkMode.value = userStore.dark_mode;
    console.log(isDarkMode.value);
  }

});
</script>
