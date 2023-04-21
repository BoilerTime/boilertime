<template>
  <header class="bg-white dark:bg-neutral-500">
    <nav class="flex items-center justify-between py-8 px-10">
      <div class="flex">
        <!-- Logo -->
        <a href="/app">
          <img class="w-auto h-10" src="/logo.png" />
        </a>
      </div>
      <!-- Menu for logged in User -->
      <div v-if="isLoggedIn" class="flex items-center dark:text-gray-200">
        <!-- Dark Mode Toggle -->
        <div>
          <Menu as="div" class="relative inline-block mr-8 text-left">
            <div>
              <MenuButton
                class="w-8 h-8 mt-1 hover:bg-gray-100 hover:rounded-full dark:hover:bg-neutral-600 dark:hover:rounded-full"
              >
                <sun v-if="!isDarkMode" class="h-7 w-7 ml-0.5 text-yellow-500">
                </sun>
                <moon v-else class="h-7 w-7 ml-0.5 text-indigo-500 dark:text-indigo-700"></moon>
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="opacity-0 transform scale-95"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transform duration-75 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-95"
            >
              <MenuItems
                class="z-50 absolute -left-1.5 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-600"
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
                        class="w-5 h-5 mr-2 text-yellow-500"
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
                        class="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-700"
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
                        class="w-5 h-5 mr-2 text-teal-500"
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
          href="/app"
          v-if="isVerified"
          class="relative inline-flex rounded-md mr-8 text-sm font-semibold text-black mt-0.5"
          >Dashboard</a
        >
        <a
          href="/app/profile"
          v-if="isVerified"
          class="relative inline-flex rounded-md mr-8 text-sm font-semibold text-black mt-0.5"
          >Profile</a
        >
        <Menu as="div" class="relative">
          <div>
            <MenuButton
              class="inline-flex rounded-md mr-8 text-sm font-semibold text-black"
            >
              Groups
              <ChevronDownIcon
                class="-mr-1 h-5 w-5 text-black"
                aria-hidden="true"
              />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute right-0 z-20 mt-2 w-36 p-1 origin-top-right rounded-md bg-white dark:bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <a
                    href="/group/view"
                    :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-neutral-500 dark:text-gray-100'
                          : 'text-gray-900 dark:text-gray-200',
                        'flex rounded-md px-2 py-2 text-sm',
                      ]"
                    >My Groups</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="/group/create"
                    :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-neutral-500 dark:text-gray-100'
                          : 'text-gray-900 dark:text-gray-200',
                        'flex rounded-md px-2 py-2 text-sm',
                      ]"
                    >Create a Group</a
                  >
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <a
          href="/app"
          @click="logout"
          class="relative inline-flex rounded-md mr-8 text-sm font-semibold text-black mt-0.5"
          >Log out</a
        >
        <span v-if="!isVerified"> Logged in as: Guest </span>
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
          class="px-3 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-md shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-yellow-600"
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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { defineProps } from "vue";
let isLoggedIn = false;
let isVerified = false;
var firstname = ref("");
var lastname = ref("");
var firstname = ref("");
var lastname = ref("");
var isDarkMode = ref();
const userStore = useUserStore();
var accessToken = userStore.accessToken;
const { $isDarkMode } = useNuxtApp();
var user_id = ref("");
try {
} catch (err) {
  console.log(err);
}
const props = defineProps({
  bgColor: {
    type: String,
    required: true,
  },
});
isLoggedIn = userStore.user.accessToken != null;
isVerified = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
};
async function logout() {
  console.log("logout");
  userStore.logOut();
}
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
    .post(
      "https://api.boilerti.me/api/get/profile/",
      {
        user_id: userStore.user_id,
      },
      config
    )
    .then((response) => {
      firstname.value = response.data.firstname;
      lastname.value = response.data.lastname;
    })
    .catch((error) => {
      console.error(error);
    });
  axios
    .post(
      "https://api.boilerti.me/api/get/darkmode/",
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
    .post(
      "https://api.boilerti.me/api/set/darkmode/",
      {
        user_id: userStore.user_id,
        dark_mode: isDarkMode.value,
      },
      config
    )
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
    .post(
      "https://api.boilerti.me/api/set/darkmode/",
      {
        user_id: userStore.user_id,
        dark_mode: isDarkMode.value,
      },
      config
    )
    .catch((error) => {
      console.error(error);
    });
  location.reload();
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
