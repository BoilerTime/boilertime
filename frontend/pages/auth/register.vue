<!--register.vue is a page dedicated to allowing users to create a profile for the website.
    It will ask for an email, password, and then a password confirmation.-->
<template>
  <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
    <br />
    <div class="mx-auto w-5/12 p-3 bg-white border rounded-lg shadow sm:p-7 md:p-8 dark:bg-white">
      <!--Welcome back text-->
      <h1 class="pb-2 text-center text-2x1 font-bold">Welcome to BoilerTime</h1>

      <form @submit.prevent="() => signup()">
        <!--Email text & input box-->
        <label for="email" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
        <input type="email" id="email" aria-describedby="helper-text-explanation"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" placeholder="username@purdue.edu"
          v-model="email" required>
        <div class="gap-8 columns-2">
          <!--First Name text & input box-->
          <label for="firstname" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">First
            Name</label>
          <input type="firstname" id="firstname" aria-describedby="helper-text-explanation"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="firstname" required>

          <!--Last Name text & input box-->
          <label for="lastname" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Last
            Name</label>
          <input type="lastname" id="lastname" aria-describedby="helper-text-explanation"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="lastname" required>
        </div>

        <div class="gap-8 columns-2">
          <!--Password text & input box-->
          <label for="password" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
          <input type="password" id="password" aria-describedby="helper-text-explanation"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="password" required>

          <!--Confirm Password text & input box-->
          <label for="confpassword" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Confirm
            Password</label>
          <input type="password" id="confpassword" aria-describedby="helper-text-explanation"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="confpassword" required>
        </div>

        <div class="gap-8 columns-2">
          <!--Graduation month-->
          <label for="gradmonth" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Graduation
            Month</label>
          <select id="gradmonth"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="gradmonth" required>
            <option value="january">January</option>
            <option value="february">February</option>
            <option value="march">March</option>
            <option value="april">April</option>
            <option value="may">May</option>
            <option value="june">June</option>
            <option value="july">July</option>
            <option value="august">August</option>
            <option value="september">September</option>
            <option value="october">October</option>
            <option value="november">November</option>
            <option value="december">December</option>
          </select>
          <!--Graduation year-->
          <label for="gradyear" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Graduation
            Year</label>
          <select id="gradyear"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="gradyear" required>
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
        <label for="gradstatus" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Student
          Status</label>
        <ul
          class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div class="flex items-center pl-3">
              <input id="isGraduateStudent" type="radio" value="false" name="isGraduateStudent"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600
                      dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" v-model="isGraduateStudent" required>
              <label for="isGraduateStudent"
                class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Undergraduate</label>
            </div>
          </li>
          <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div class="flex items-center pl-3">
              <input id="isGraduateStudent" type="radio" value="true" name="isGraduateStudent"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600
                      dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" v-model="isGraduateStudent" required>
              <label for="gradstatus"
                class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Graduate</label>
            </div>
          </li>
        </ul>

        <!--Attempts to register-->
        <div class="container pt-5 px-5 min-w-full flex flex-col items-center">
          <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>

</template>
        
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import sha256 from 'js-sha256'


const email = ref('')
const firstname = ref('')
const lastname = ref('')
const password = ref('')
const confpassword = ref('')
const isGraduateStudent = ref('')


/**
 * This function will take inputted data and create an account.
 * It will also check to see if the passwords match.
 */
async function signup() {
  var newpassword = sha256(password.value);
  var newconfpassword = sha256(confpassword.value);
  //console.log(newpassword);
  //console.log(newconfpassword);
  if (newpassword===newconfpassword) {

    await axios.post('http://localhost:3001/api/createuser', {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: newpassword,
      gradmonth: gradmonth.value,
      gradyear: gradyear.value,
      isGraduateStudent: isGraduateStudent.value
    })
      .catch(function (error) {
        console.error();

      });
  } else {
    alert("Passwords do not match")
  }
}
</script>
