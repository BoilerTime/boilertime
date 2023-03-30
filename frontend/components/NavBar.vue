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
        class="flex items-center justify-end dark:text-gray-200"
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
                <moon v-else class="h-7 w-7 ml-0.5 text-indigo-500"> </moon>
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
                          : 'text-gray-900 dark:text-gray-200',
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
                          : 'text-gray-900 dark:text-gray-200',
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
                  <!--Not entirely working, system preference is not constant, and it only works on page refresh.-->
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-neutral-500 dark:text-gray-100'
                          : 'text-gray-900 dark:text-gray-200',
                        'flex w-full rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="setThemePref()"
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
        <a href="/app/profile" v-if="isVerified" class="hidden hover:underline lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 dark:text-gray-200 lg:mr-8">Your Profile</a>
        <a href="/app/create" v-if="isVerified" class="hidden hover:underline lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 dark:text-gray-200 lg:mr-8">Create Schedule</a>
        <a href="/app/home" @click="logout" class="hidden hover:underline lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 dark:text-gray-200 lg:mr-8">Log Out</a>
        Logged in as: {{ (user_id).slice(0,10) }}...
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
let isVerified = false;
var firstname = ref("")
var lastname = ref("")
var firstname = ref("");
var lastname = ref("");
var isDarkMode = ref();

const userStore = useUserStore();
var accessToken = userStore.accessToken;
const { $isDarkMode } = useNuxtApp();
var user_id = ref("")

try {
} catch (err) {
  console.log(err);
}

isLoggedIn = userStore.user.accessToken != null;
isVerified = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}

async function logout() {
  console.log("logout")
  userStore.logOut()
};

async function verifyToken() {
  await userStore
    .verifyToken(userStore.accessToken, userStore.user_id)
    .then((res) => {
      //console.log(res.accessToken);
    });
}

async function getUserInfo() {
  try {
    if (userStore.user.user_id == null) {
      user_id.value = "guest";
    }
  } catch (err) {
    return;
  }
  user_id.value = userStore.user.user_id;
  axios
    .post("http://localhost:3001/api/get/profile/", {
      user_id: userStore.user_id,
    }, config)
    .then((response) => {
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
    })
    .catch((error) => {
      console.error(error);
    });
  axios
    .post(
      "http://localhost:3001/api/get/darkmode/",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      userStore.user.dark_mode = response.data.dark_mode;
      //console.log(userStore.user.dark_mode + "hello");
    })
    .catch((error) => {
      console.error(error);
    });
}

async function setTheme(darkMode) {
  isDarkMode.value = darkMode;
  userStore.user.dark_mode = darkMode;
  changePageTheme();
  axios
    .post("http://localhost:3001/api/set/darkmode/", {
      user_id: userStore.user_id,
      dark_mode: isDarkMode.value,
    }, config)
    .catch((error) => {
      console.error(error);
    });
}

async function changePageTheme() {
  if (isDarkMode.value == true) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

//not entirely working
async function setThemePref() {
  isDarkMode.value = $isDarkMode;
  userStore.user.dark_mode = $isDarkMode;
  axios
    .post("http://localhost:3001/api/set/darkmode/", {
      user_id: userStore.user_id,
      dark_mode: isDarkMode.value,
    }, config)
    .catch((error) => {
      console.error(error);
    });
}

onMounted(() => {
  changePageTheme();
  getUserInfo().then(() => {
    if (userStore.user.dark_mode == undefined) {
      isDarkMode.value = $isDarkMode;
      changePageTheme();
      //console.log(isDarkMode.value);
      //console.log("system");
    } else {
      isDarkMode.value = userStore.user.dark_mode;
      changePageTheme();
      //console.log(isDarkMode.value);
    }
  });
  verifyToken();
});

</script>
