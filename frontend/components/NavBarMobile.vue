<template>
  <header class="bg-white dark:bg-neutral-500">
    <nav class="flex items-center justify-between mx-auto p-6">
      <div class="flex">
        <!-- Logo -->
        <a href="/app">
          <img class="w-auto h-10" src="/logo.png" />
        </a>
      </div>
      <!--Menu-->
      <div class="flex">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          @click="mobileMenuOpen = true"
        >
          <Bars3Icon class="h-10 w-auto dark:text-white"></Bars3Icon>
        </button>
      </div>
    </nav>
    <Dialog as="div" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10"></div>
      <DialogPanel
        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-neutral-700 px-6 py-6 sm:max-w-sm"
      >
        <div class="flex items-center justify-between">
          <a href="/app">
            <img class="w-auto h-10" src="/logo.png" />
          </a>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5"
            @click="mobileMenuOpen = false"
          >
            <XMarkIcon class="h-10 w-auto dark:text-white" />
          </button>
        </div>
        <div v-if="isLoggedIn && isVerified">
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-neutral-200">
              <div class="space-y-2 py-6">
                <a
                  href="/app"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 dark:text-white"
                  >Dashboard</a
                >
                <a
                  href="/app/profile"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 dark:text-white"
                  >Profile</a
                >
                <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 dark:text-white"
                  >
                    Groups
                    <ChevronUpIcon
                      :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']"
                    />
                  </DisclosureButton>
                  <DisclosurePanel class="mt-2 space-y-2 flex flex-col items-center gap-4">
                    <DisclosureButton
                      v-for="item in [
                        { name: 'My Groups', href: '/group/view' },
                        { name: 'Create a Group', href: '/group/create' },
                      ]"
                      :key="item.name"
                      as="a"
                      :href="item.href"
                      class="block rounded-lg pl-6 pr-3 text-sm font-semibold leading-7 dark:text-white"
                      >{{ item.name }}</DisclosureButton
                    >
                  </DisclosurePanel>
                </Disclosure>
              </div>
              <div class="py-6">
                <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 dark:text-white"
                  >
                    <sun
                      v-if="!isDarkMode"
                      class="h-7 w-7 ml-0.5 text-yellow-500"
                    >
                    </sun>
                    <moon v-else class="h-7 w-7 ml-0.5 text-indigo-500"> </moon>
                    <ChevronUpIcon
                      :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']"
                    />
                  </DisclosureButton>
                  <DisclosurePanel class="mt-2 space-y-2 flex flex-col items-center gap-5 pb-4">
                    <button class="flex items-center" @click="setTheme(false)">
                      <sun
                        class="w-5 h-5 mr-2 text-yellow-500"
                      >
                      </sun>
                      <span class="font-semibold dark:text-white">Light</span>
                    </button>
                    <button class="flex items-center" @click="setTheme(true)">
                      <moon
                        class="w-5 h-5 mr-2 text-indigo-500"
                      >
                      </moon>
                      <span class="font-semibold dark:text-white">Dark</span>
                    </button>
                    <button class="flex items-center" @click="setThemePref()">
                      <computer
                        class="w-5 h-5 mr-2 text-teal-500"
                      >
                      </computer>
                      <span class="font-semibold dark:text-white">System</span>
                    </button>
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="/app"
                  @click="logout"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 dark:text-white"
                  >Log Out</a
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="isLoggedIn && !isVerified">
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-neutral-200">
              <div class="space-y-2 py-6">
                <a
                  href="/app"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 dark:text-white"
                  >Dashboard</a
                >
                <a
                  href="/app/login"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 dark:text-white"
                  >Login</a
                >
                <a
                  href="/app/register"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 dark:text-white"
                  >Register</a
                >
              </div>
              <div class="py-6">
                <a
                  href="/app"
                  @click="logout"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 dark:text-white"
                  >Log Out</a
                >
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
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
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/vue";
import { ChevronUpIcon, Bars3Icon, XMarkIcon } from "@heroicons/vue/20/solid";
import { defineProps } from "vue";
let isLoggedIn = false;
let isVerified = false;
var firstname = ref("");
var lastname = ref("");
var firstname = ref("");
var lastname = ref("");
var isDarkMode = ref();
const mobileMenuOpen = ref(false);
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
      "http://localhost:3001/api/set/darkmode/",
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
