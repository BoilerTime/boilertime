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
          <h1 class="text-2xl font-bold sm:text-3xl md:text-4xl">
            Hello again!
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
              class="block pt-3 mb-2 text-sm font-bold"
              >Email</label
            >
            <input
              type="email"
              id="email"
              aria-describedby="helper-text-explanation"
              class="border text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
              placeholder="pete@purdue.edu"
              v-model="email"
              required
            />
            <!--Password text & input box-->
            <label
              for="password"
              class="pt-5 block mb-2 text-sm font-bold text-gray-900 dark:text-black"
              >Password</label
            >
            <input
              type="password"
              id="password"
              class="border text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
              v-model="password"
              required
            />
            <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
              <button
                type="submit"
                class="inline-block p-2 text-md font-bold mt-5 text-white bg-black rounded shrink-0 hover:bg-gray-700"
              >
                Log in
              </button>
              <button
                type="register"
                @click="() => navigateTo('/auth/register')"
                class="inline-block p-2 font-bold text-md mt-5 ml-4 md:ml-0 text-white bg-yellow-500 hover:bg-yellow-700 rounded shrink-0 "
              >
                Sign up
              </button>
              <p class="mt-5 lg:ml-2">
                <button class=" text-gray-400 text-md hover:text-gray-500" @click.prevent="addCounterToFGPassword()">
                  Forgot password?
                </button>
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
const route = useRoute();
const userStore = useUserStore();
var isMobile = ref(false);

async function checkWindowSize() {
  isMobile = window.innerWidth <= 768;
}

/**
 * A function to call the signIn function in the user store helper
 */
async function login() {
  try {
    await userStore.signIn(email.value, sha256(password.value));
    if (!userStore.isLoggedIn) {
      navigateTo(`/auth/login?verified=${route.query.verified}`);
    } else {
      // start temp fix, this is janky
      const el = document.getElementById("__nuxt");
      el.innerHTML = "";
      // end temp fix
      navigateTo(`/app?verified=${route.query.verified}`);
      if (isMobile) {
        $toast.error("Warning: Mobile view has access to limited functionality. BoilerTime is better viewed on larger screens!", {
          timeout: 5000,
        });
      }
    }
  } catch (error) {
    // temp alert
    $toast.error("Incorrect username or password", {
      timeout: 5000,
    });
    password.value = null;
  }
}

async function addCounterToFGPassword() {
  navigateTo('/auth/forgotpassword');
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
    $toast.error("Failed to create guest session", {
      timeout: 5000,
    });
  }
}

onMounted(async () => {
  checkWindowSize();
});

</script>
