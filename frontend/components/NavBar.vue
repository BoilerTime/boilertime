<template>
  <header class="bg-white">
    <nav class="mx-auto flex items-center justify-between py-8 px-12">
      <div class="flex">
        <a href="/" class="-m-1.5 p-1.5">
          <img class="h-10 w-auto" src="/logo.png" />
        </a>
      </div>
      <div v-if="isLoggedIn" class="flex items-center justify-end">
        <a href="/app/profile_page" class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8">Your Profile</a>
        <a href="/app/create" class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8">Create Schedule</a>
        Logged in as: {{ (userStore.user.user_id).slice(0,10) }}...
      </div>
      <div v-else class="flex items-center justify-end">
        <a href="/auth/login" class="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 lg:mr-8">Log in</a>
        <a href="/auth/register" class="rounded-md bg-yellow-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-yellow-600">Sign up</a>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useUserStore } from "../store/user"
import { ref } from "vue"

let isLoggedIn = false;
var firstname = ref("")
var lastname = ref("")

const userStore = useUserStore()

try {
} catch (err) {
  console.log(err)
}

isLoggedIn = userStore.isLoggedIn

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

onMounted(() => {
  getUserInfo();
});

</script>