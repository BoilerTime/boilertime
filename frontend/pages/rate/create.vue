<!--This page is designed to allow users to create a rating of a classroom, TA, or class.
    For the captcha, this code was used https://vuejsexamples.com/build-simple-recaptcha-for-vuejs-without-server-need/-->
<template>
    <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
        <br />
        <div class="mx-auto my-10 max-w-sm p-3 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">
            <h1 class="pb-2 text-center text-2x1 font-bold">Leave a Review</h1>
            <form @submit.prevent="() => createreview()">
            <div class="gap-8 columns-2">
                <!--Review type text-->
                <label for="reviewtype" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What would
                    you like to review?</label>
                <!--Review Type dropdown-->
                <select id="reviewtype"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                            p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="reviewtype" required>
                    <option value="course">Course</option>
                    <option value="classroom">Classroom</option>
                    <option value="ta">TA</option>
                </select>
                <!--Review Selection text-->
                <label for="reviewselection" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What
                    one would you like to review?</label>
                <!--Review Selection input box-->
                <input type="reviewselection" id="reviewselection" aria-describedby="helper-text-explanation"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:text-black dark:focus:ring-blue-500" v-model="reviewselection" required>
            </div>
            <!--Adds the inputs for reviewing a course-->
            <div v-if="reviewtype === 'course' && reviewselection !== 'null'">
                <!--Prerequisite Requirement Rating aka 'rating1'-->
                <label for="rating1" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">How strict are the prerequisite requirements?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating1" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating1">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
                <!--Pace of Materials Rating aka 'rating2'-->
                <label for="rating2" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">How is the pace of materials covered?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating2" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating2">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
                <!--Depth of Material Rating aka 'rating3'-->
                <label for="rating3" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">How in-depth is the material?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating3" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating3">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
            </div>
            <!--Adds the inputs for reviewing a classroom-->
            <div v-else-if="reviewtype === 'classroom'">
                <!--Convenience of Access Rating aka 'rating1'-->
                <label for="rating1" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">How convenient is it to access this classroom?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating1" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating1">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
                <!--Quality of Seating Rating aka 'rating2'-->
                <label for="rating2" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What is the quality of seating?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating2" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating2">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
                <!--Availability of Technology Rating aka 'rating3'-->
                <label for="rating3" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What is the availability of technology?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating3" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating3">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
            </div>
            <!--Adds the inputs for reviewing a TA-->
            <div v-else-if="reviewtype === 'ta'">
                <!--Helpfulness of Answering Questions Rating aka 'rating1'-->
                <label for="rating1" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">How helpful are they when answering questions?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating1" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating1">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
                <!--Responsiveness Rating aka 'rating2'-->
                <label for="rating2" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">How responsive are they?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating2" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating2">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
                <!--Fairness of Grading Rating aka 'rating3'-->
                <label for="rating3" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">How fair is their grading?</label>
                <span class="text-sm items-center">2.5</span>
                <input id="rating3" type="range" min="0" max="5" step="0.5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" oninput="this.previousElementSibling.innerText=this.value" v-model="rating3">
                <div class="-mt-2 flex w-fill justify-between">
                    <span class="text-sm text-black">0</span>
                    <span class="text-sm text-black">5</span>
                </div>
            </div>

            <!--CAPTCHA title and insert-->
            <label for="enterval" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">CAPTCHA: {{ randval1 }} + {{ randval2 }} =</label>
            <input type="enterval" id="enterval" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
                  v-model="enterval" required>

            <!--Attempts to send review-->
            <div class="container pt-5 px-5 min-w-full flex flex-col">
                <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
                    Send Review
                </button>
            </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from "../../store/user";

const randval1 = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1))
const randval2 = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1))
const actualval = randval1 + randval2
const enterval = ref('')

var userstore = useUserStore();
const reviewtype = ref('')
const reviewselection = ref('')

const rating1 = ref('')
const rating2 = ref('')
const rating3 = ref('')


/**
 * This function will take the review type and review selection and send the inserted
 * information to the database.
 */
async function createreview() {
    console.log(actualval, enterval.value)
    if (actualval == enterval.value) {
        if (reviewtype.value === "course") {
            await axios.post('http://localhost:3001/api/add/ratings/courses', {
                user_id: userstore.user_id,
                course: reviewselection.value,
                prequisite_strictness: rating1.value,
                pace: rating2.value,
                depth: rating3.value
            })
            .then(function() {
                alert("Thank you for submitting your review!")
            })
            .catch(function(error) {
                console.error();
                alert(error);
            })
        } else if (reviewtype.value === "classroom") {
            await axios.post('http://localhost:3001/api/add/ratings/classrooms', {
                user_id: userstore.user_id,
                classroom: reviewselection.value,
                access_conv: rating1.value,
                seating_quality: rating2.value,
                technology_avail: rating3.value
            })
            .then(function() {
                alert("Thank you for submitting your review!")
            })
            .catch(function(error) {
                console.error();
                alert(error);
            })
        } else if (reviewtype.value === "ta") {
            await axios.post('http://localhost:3001/api/add/ratings/tas', {
                user_id: userstore.user_id,
                ta: reviewselection.value,
                question_answering: rating1.value,
                grading_fairness: rating3.value,
                responsiveness: rating2.value
            })
            .then(function() {
                alert("Thank you for submitting your review!")
            })
            .catch(function(error) {
                console.error();
                alert(error);
            })
        }
    } else {
        alert("CAPTCHA entered incorrectly. Please try again.")
    }
}
</script>