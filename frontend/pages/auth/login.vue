<template>
  <section class="bg-white">
    <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
      <div class="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
        <img src="https://stories.purdue.edu/app/uploads/2022/07/TopBuildings-ContentHub-Hero.jpg"
          class="absolute inset-0 h-full w-full object-cover opacity-30">
      </div>
      <div class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6">
        <div class="max-w-xl lg:max-w-3xl">
          <img src="/logo.png" class="h-16" />
          <h1 class="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Welcome back
          </h1>
          <h1 class="text-2xl font-bold text-yellow-500 sm:text-3xl md:text-4xl">
            to BoilerTime
          </h1>
          <p class="mt-4 leading-relaxed text-gray-500">
            Don't have an account?
            <a href="/auth/signup" class="text-yellow-500">Sign up here →</a>
          </p>
          <p class="mt-2 leading-relaxed text-black-500">
            Use your <b>@purdue.edu</b> email address to sign in.
          </p>
          <form @submit.prevent="() => login()">
            <!--Email text & input box-->
            <label for="email" class="pt-3 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
            <input type="email" id="email" aria-describedby="helper-text-explanation"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-yellow-500"
              placeholder="pete@purdue.edu" v-model="email" required />
            <!--Password text & input box-->
            <label for="password"
              class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
            <input type="password" id="password" aria-describedby="helper-text-explanation"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-yellow-500"
              v-model="password" required />
            <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
              <button type="submit"
                class="inline-block shrink-0 bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 mt-5 rounded">
                Log in
              </button>
              <p class="mt-5 text-sm text-gray-500">
                <a href="#" class="text-gray-700">Forgot password?</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from "../../store/user"

const email = ref('')
const password = ref('')

const userStore = useUserStore()

/**
* A function to call the signIn function in the user store helper
*/
async function login() {
  try {
    await userStore.signIn(email.value, password.value)
    if (!userStore.isLoggedIn) {
      navigateTo("/auth/login")
    } else {
      // start temp fix, this is janky
      const el = document.getElementById("__nuxt")
      el.innerHTML = ""
      // end temp fix
      navigateTo("/app/home")
    }
  } catch (error) {
    // temp alert
    alert("Incorrect username or password")
  }
}
</script>
