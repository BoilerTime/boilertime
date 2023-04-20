<!--register.vue is a page dedicated to allowing users to create a profile for the website.
    It will ask for an email, password, and then a password confirmation.-->
<template>
  <div class="flex items-center justify-center p-10 overflow-scroll">
    <div
      class="p-8 bg-white border rounded-lg shadow-lg flex flex-col gap-2 md:gap-4 max-h-md"
    >
      <!--Logo-->
      <a href="/">
        <img src="/logo.png" class="h-12 md:h-16" />
      </a>
      <!--Welcome text-->
      <h1 class="text-left text-2xl md:text-4xl font-bold">
        Welcome to
        <span class="text-yellow-500">BoilerTime</span>
      </h1>
      <p class="text-left text-sm font-light md:text-sm text-gray-400">
        Please use your @purdue.edu email address to sign up.
        <br />
        Don't want to make an account?
        <a
          @click="guest()"
          class="text-indigo-500 hover:text-indigo-700 hover:underline font-bold"
          >Sign in as guest →</a
        >
      </p>

      <form @submit.prevent="() => signup()" class="flex flex-col">
        <!--Email text & input box-->
        <label for="email" class="block text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          id="email"
          class="border text-sm rounded-lg block w-full p-3 mb-2"
          placeholder="pete@purdue.edu"
          v-model="email"
          required
        />
        <div>
          <!--First Name text & input box-->
          <label for="firstname" class="block text-sm font-bold mb-2"
            >First Name</label
          >
          <input
            type="firstname"
            id="firstname"
            class="border text-sm rounded-lg block w-full p-3 mb-2"
            v-model="firstname"
            required
          />

          <!--Last Name text & input box-->
          <label for="lastname" class="block mb-2 text-sm font-bold"
            >Last Name</label
          >
          <input
            type="lastname"
            id="lastname"
            aria-describedby="helper-text-explanation"
            class="border text-sm rounded-lg block w-full p-3 mb-2"
            v-model="lastname"
            required
          />
        </div>

        <div>
          <!--Password text & input box-->
          <label for="password" class="block mb-2 text-sm font-bold"
            >Password</label
          >
          <input
            type="password"
            id="password"
            class="border text-sm rounded-lg block w-full p-3 mb-2"
            v-model="password"
            required
          />

          <!--Confirm Password text & input box-->
          <label for="confpassword" class="block mb-2 text-sm font-bold"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confpassword"
            aria-describedby="helper-text-explanation"
            class="border text-sm rounded-lg block w-full p-3"
            v-model="confpassword"
            required
          />
        </div>

        <div class="gap-8 columns-2 mt-2">
          <!--Graduation month-->
          <label for="gradmonth" class="block mb-2 text-sm font-bold"
            >Graduation Month</label
          >
          <select
            id="gradmonth"
            class="border text-sm rounded-lg block w-full p-3"
            v-model="gradmonth"
            required
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          <!--Graduation year-->
          <label for="gradyear" class="block mb-2 text-sm font-bold"
            >Graduation Year</label
          >
          <select
            id="gradyear"
            class="border text-sm rounded-lg block w-full p-3"
            v-model="gradyear"
            required
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
            <option value="2031">2031</option>
            <option value="2032">2032</option>
            <option value="2033">2033</option>
            <option value="2034">2034</option>
            <option value="2035">2035</option>
            <option value="2036">2036</option>
            <option value="2037">2037</option>
            <option value="2038">2038</option>
            <option value="2039">2039</option>
            <option value="2040">2040</option>
          </select>
        </div>

        <!--Grad/Undergrad checkbox-->
        <label for="gradstatus" class="mt-2 block mb-2 text-sm font-bold"
          >Student Status</label
        >
        <ul
          class="items-center text-sm font-bold bg-white border border-gray-200 rounded-lg sm:flex"
        >
          <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
            <div class="flex items-center pl-3">
              <input
                id="isGraduateStudent"
                type="radio"
                value=false
                name="isGraduateStudent"
                class="w-4 h-4"
                v-model="isGraduateStudent"
                required
              />
              <label
                for="isGraduateStudent"
                class="w-full py-3 ml-2 text-sm font-bold"
                >Undergraduate</label
              >
            </div>
          </li>
          <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
            <div class="flex items-center pl-3">
              <input
                id="isGraduateStudent"
                type="radio"
                value=true
                name="isGraduateStudent"
                class="w-4 h-4"
                v-model="isGraduateStudent"
                required
              />
              <label for="gradstatus" class="w-full py-3 ml-2 text-sm font-bold"
                >Graduate</label
              >
            </div>
          </li>
        </ul>

        <!--Attempts to register-->
        <div class="flex items-center pt-5 flex-col">
          <button
            type="submit"
            class="bg-black hover:bg-gray-800 text-white font-bold p-3 text-lg rounded-lg"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import sha256 from "js-sha256";
import { useUserStore } from "../../store/user";
const email = ref("");
const firstname = ref("");
const lastname = ref("");
const password = ref("");
const confpassword = ref("");
const isGraduateStudent = ref(false);
const gradmonth = ref("");
const gradyear = ref("");
const { $toast } = useNuxtApp();
const userStore = useUserStore();

/**
 * This function will take inputted data and create an account.
 * It will also check to see if the passwords match.
 */
async function signup() {
  var newpassword = sha256(password.value);
  var newconfpassword = sha256(confpassword.value);
  if (newpassword === newconfpassword) {
    await axios
      .post("https://api.boilerti.me/api/createuser", {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: newpassword,
        gradmonth: gradmonth.value,
        gradyear: gradyear.value,
        isGraduateStudent: isGraduateStudent.value,
      })
      .then(function () {
        $toast.info("Please check your email to verify your account!", {
          timeout: 5000,
        });
      })
      .catch(function (error) {
        $toast.error("Email Invalid or it already exists!", {
          timeout: 5000,
        });
      });
  } else {
    $toast.error("Passwords do not match!", {
      timeout: 5000,
    });
  }
}

async function guest() {
  try {
    await userStore.createGuest();
    if (!userStore.isLoggedIn) {
      navigateTo("/auth/register");
    } else {
      // start temp fix, this is janky
      const el = document.getElementById("__nuxt");
      el.innerHTML = "";
      // end temp fix
        $toast.error(
        "Warning: Guest mode has access to limited functionality!",
        {
          timeout: 5000,
        }
      );
      navigateTo("/app/home");
    }
  } catch (error) {
    // temp alert
    alert("Failed to create guest session");
  }
}
</script>
