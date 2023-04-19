<template>
  <section class="h-screen overflow-hidden bg-white">
    <div class="lg:grid lg:grid-cols-12">
      <div
        class="flex items-center justify-center p-8 sm:px-12 lg:col-span-8 lg:p-14 xl:col-span-12"
      >
        <div class="z-50 max-w-xl p-8 bg-white rounded-lg">
          <a href="/">
            <img src="/logo.png" class="h-16 mb-6" />
          </a>
          <h1 class="text-2xl font-bold text-black sm:text-3xl md:text-4xl">
            Welcome to
          </h1>
          <h1
            class="text-2xl font-bold text-yellow-500 sm:text-3xl md:text-4xl"
          >
            to BoilerTime
          </h1>
          <p class="mt-4 text-gray-400">
            Use your @purdue.edu email address to sign in
            <a
              class="text-yellow-500 hover:text-yellow-700 hover:underline"
              @click="guest()"
              ><br />or continue as guest →</a
            >
          </p>
          <form @submit.prevent="() => login()" class="mt-3">
            <!--Email text & input box-->
            <label
              for="email"
              class="block pt-3 mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >Email</label
            >
            <input
              type="email"
              id="email"
              aria-describedby="helper-text-explanation"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-yellow-500"
              placeholder="pete@purdue.edu"
              v-model="email"
              required
            />
            <!--Password text & input box-->
            <label
              for="password"
              class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >Password</label
            >
            <input
              type="password"
              id="password"
              aria-describedby="helper-text-explanation"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-yellow-500"
              v-model="password"
              required
            />
            <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
              <button
                type="submit"
                class="inline-block px-10 py-2 mt-5 font-bold text-white bg-black rounded shrink-0 hover:bg-gray-800"
              >
                Log in
              </button>
              <p class="mt-5 lg:ml-2">
                <a href="/auth/forgotpassword" class="text-gray-400 text-md"
                  >Forgot password?</a
                >
              </p>
            </div>
          </form>
        </div>
      </div>
      <div class="block h-screen lg:col-span-5 lg:h-full">
        <img
          src="https://stories.purdue.edu/app/uploads/2022/07/TopBuildings-ContentHub-Hero.jpg"
          class="absolute inset-0 object-cover w-full h-full opacity-50"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../../store/user";
import sha256 from "js-sha256";
const { $toast } = useNuxtApp()

const email = ref("");
const password = ref("");

const userStore = useUserStore();

/**
 * A function to call the signIn function in the user store helper
 */
async function login() {
  try {
    await userStore.signIn(email.value, sha256(password.value));
    if (!userStore.isLoggedIn) {
      navigateTo("/auth/login");
    } else {
      // start temp fix, this is janky
      const el = document.getElementById("__nuxt");
      el.innerHTML = "";
      // end temp fix
      navigateTo("/app");
    }
  } catch (error) {
    // temp alert
    alert("Incorrect username or password");
    password.value = null;
  }
}

async function guest() {
  try {
    await userStore.createGuest();
    if (!userStore.isLoggedIn) {
      navigateTo("/auth/login");
    } else {
      // start temp fix, this is janky
      const el = document.getElementById("__nuxt");
      el.innerHTML = "";
      // end temp fix
      $toast.error("Warning: Guest mode has access to limited functionality!", {
        timeout: 5000,
      });
      navigateTo("/app");
    }
  } catch (error) {
    // temp alert
    alert("Failed to create guest session");
  }
}
</script>
