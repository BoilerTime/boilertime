<template>
    <main>
        <NavBar />
        <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
            <br />
            <div class="mx-auto my-10 max-w-sm p-3 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">
                <div class="mt-5 items-center">
                    <!--Review type text-->
                    <h1 class="font-bold text-2xl mb-5">Review Type</h1>
                    <!--Review Type dropdown-->
                    <select id="reviewtype"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                                            p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        v-model="reviewtype" required>
                        <option value="course">Course</option>
                        <option value="classroom">Classroom</option>
                        <option value="ta">TA</option>
                    </select>
                    <br />
                    <!--Reviews text-->
                    <h1 class="font-bold text-2xl mb-5">Reviews</h1>
                    <!--Showing course reviews-->
                    <div class="bg-gray-300 rounded-lg max-w-full mb-5 mt-5 p-4">
                        <ul class="list-inside list-item">
                            <div v-if="reviewtype === 'course'">
                                <li class="mb-2 font-bold" v-for="(item, index) in getCourseRatings" :key="index">
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Course: {{ item.course }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Prereq. Strictness: {{ item.prequisite_strictness }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Pace: {{ item.pace }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Depth of Material: {{ item.depth }}</h1>
                                    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                                                <!-- Modal toggle -->
                                                                                <button data-modal-target="defaultModal" data-modal-toggle="defaultModal"
                                            class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            type="button">
                                            Flag
                                        </button>
                                        <!-- Main modal -->
                                        <div id="defaultModal" tabindex="-1" aria-hidden="true"
                                            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
                                            <div class="relative w-full h-full max-w-2xl md:h-auto">
                                                <!-- Modal content -->
                                                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                    <!-- Modal header -->
                                                    <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                                            Flagging this Review
                                                        </h3>
                                                        <button type="button"
                                                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                            data-modal-hide="defaultModal">
                                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd"
                                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                            <span class="sr-only">Close modal</span>
                                                        </button>
                                                    </div>
                                                    <!-- Modal body -->
                                                    <div class="p-6 space-y-6">
                                                        <form @submit.prevent="() => flag()">
                                                        <!-- Modal footer -->
                                                        <!--Reason for report dropdown-->
                                                        <label for="reportreason" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Why are you reporting this review?</label>
                                                            <select id="reportreason"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                                                                p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="reportreason" required>
                                                                <option value="harmful">Harmful Review</option>
                                                                <option value="unjustified">Unjustified Review</option>
                                                                <option value="trolling">Trolling</option>
                                                            </select>
                                                        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                            <!--CAPTCHA title and insert-->
                                                            <label for="enterval" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">CAPTCHA:
                                                                {{ randval1 }} + {{ randval2 }} =</label>
                                                            <input type="enterval" id="enterval" aria-describedby="helper-text-explanation"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="enterval" required>
                                                            <!--Attempts to send review-->
                                                            <div class="container pt-5 px-5 min-w-full flex flex-col">
                                                                <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
                                                                    Flag Review
                                                                </button>
                                                            </div>
                                                        </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </div>
                            <!--Showing classroom reviews-->
                            <div v-else-if="reviewtype === 'classroom'">
                                <li class="mb-2 font-bold" v-for="(item, index) in getClassroomRatings" :key="index">
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Classroom: {{ item.index[0] }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Convenience: {{ item.index[1] }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Seating Quality: {{ item.index[2] }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Tech. Availability: {{ item.index[3] }}</h1>
                                    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <!-- Modal toggle -->
                                        <button data-modal-target="defaultModal" data-modal-toggle="defaultModal"
                                            class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            type="button">
                                            Flag
                                        </button>
                                        <!-- Main modal -->
                                        <div id="defaultModal" tabindex="-1" aria-hidden="true"
                                            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
                                            <div class="relative w-full h-full max-w-2xl md:h-auto">
                                                <!-- Modal content -->
                                                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                    <!-- Modal header -->
                                                    <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                                            Flagging this Review
                                                        </h3>
                                                        <button type="button"
                                                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                            data-modal-hide="defaultModal">
                                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd"
                                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                            <span class="sr-only">Close modal</span>
                                                        </button>
                                                    </div>
                                                    <!-- Modal body -->
                                                    <div class="p-6 space-y-6">
                                                        <form @submit.prevent="() => flag()">
                                                        <!-- Modal footer -->
                                                        <!--Reason for report dropdown-->
                                                        <label for="reportreason" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Why are you reporting this review?</label>
                                                            <select id="reportreason"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                                                                p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="reportreason" required>
                                                                <option value="harmful">Harmful Review</option>
                                                                <option value="unjustified">Unjustified Review</option>
                                                                <option value="trolling">Trolling</option>
                                                            </select>
                                                        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                            <!--CAPTCHA title and insert-->
                                                            <label for="enterval" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">CAPTCHA:
                                                                {{ randval1 }} + {{ randval2 }} =</label>
                                                            <input type="enterval" id="enterval" aria-describedby="helper-text-explanation"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="enterval" required>
                                                            <!--Attempts to send review-->
                                                            <div class="container pt-5 px-5 min-w-full flex flex-col">
                                                                <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
                                                                    Flag Review
                                                                </button>
                                                            </div>
                                                        </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </div>
                            <!--Showing TA reviews-->
                            <div v-else-if="reviewtype === 'ta'">
                                <li class="mb-2 font-bold" v-for="(item, index) in getTaRatings" :key="index">
                                    <h1 class="pb-2 text-center text-2x1 font-bold">TA: {{ item[0] }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Helpfulness: {{ item[1] }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Grading: {{ item[2] }}</h1>
                                    <h1 class="pb-2 text-center text-2x1 font-bold">Responsiveness: {{ item[3] }}</h1>
                                    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                                                <!-- Modal toggle -->
                                                                                <button data-modal-target="defaultModal" data-modal-toggle="defaultModal"
                                            class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            type="button">
                                            Flag
                                        </button>
                                        <!-- Main modal -->
                                        <div id="defaultModal" tabindex="-1" aria-hidden="true"
                                            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
                                            <div class="relative w-full h-full max-w-2xl md:h-auto">
                                                <!-- Modal content -->
                                                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                    <!-- Modal header -->
                                                    <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                                            Flagging this Review
                                                        </h3>
                                                        <button type="button"
                                                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                            data-modal-hide="defaultModal">
                                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor"
                                                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd"
                                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                    clip-rule="evenodd"></path>
                                                            </svg>
                                                            <span class="sr-only">Close modal</span>
                                                        </button>
                                                    </div>
                                                    <!-- Modal body -->
                                                    <div class="p-6 space-y-6">
                                                        <form @submit.prevent="() => flag()">
                                                        <!-- Modal footer -->
                                                        <!--Reason for report dropdown-->
                                                        <label for="reportreason" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">Why are you reporting this review?</label>
                                                            <select id="reportreason"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                                                                p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="reportreason" required>
                                                                <option value="harmful">Harmful Review</option>
                                                                <option value="unjustified">Unjustified Review</option>
                                                                <option value="trolling">Trolling</option>
                                                            </select>
                                                        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                            <!--CAPTCHA title and insert-->
                                                            <label for="enterval" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">CAPTCHA:
                                                                {{ randval1 }} + {{ randval2 }} =</label>
                                                            <input type="enterval" id="enterval" aria-describedby="helper-text-explanation"
                                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500" v-model="enterval" required>
                                                            <!--Attempts to send review-->
                                                            <div class="container pt-5 px-5 min-w-full flex flex-col">
                                                                <button type="submit" class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-10 rounded">
                                                                    Flag Review
                                                                </button>
                                                            </div>
                                                        </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from "../../store/user"

const randval1 = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1))
const randval2 = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1)) + Math.ceil(1))
const actualval = randval1 + randval2
const enterval = ref('')

var userstore = useUserStore();
var name = ref("")
const reviewtype = ref('');

var courseRatings = ref([3]);
var classroomRatings = ref([3]);
var taRatings = ref([3]);

async function getCourseRatings() {
    axios.post("https://api.boilerti.me/api/get/user_ratings/courses", {
        user_id: userstore.user_id,
    })
        .then(function (response) {
            courseRatings.value.course = response.data.course;
            courseRatings.value.prequisite_strictness = response.data.prequisite_strictness;
            courseRatings.value.pace = response.data.pace;
            courseRatings.value.depth = response.data.depth;
        })
        .catch(function (error) {
            console.error(error)
        });
}

async function getClassroomRatings() {
    axios.post("https://api.boilerti.me/api/get/user_ratings/classroom", {
        user_id: userstore.user_id,
    })
        .then(function (response) {
            classroomRatings.value = response.data.rating[3];
        })
        .catch(function (error) {
            console.error(error)
        });
}

async function getTaRatings() {
    axios.post("https://api.boilerti.me/api/get/user_ratings/tas", {
        user_id: userstore.user_id,
    })
        .then(function (response) {
            taRatings.value = response.data.rating[3];
        })
        .catch(function (error) {
            console.error(error)
        });
}

async function flag() {
    if (actualval == enterval.value) {
        await axios.post("https://api.boilerti.me/api/add/flag", {
            user_id: userstore.user_id,
            type: reviewtype.value,
            name: name.value
        })
            .then(function () {
                alert("Review has been flagged and Stakeholders have been notified.")
            })
            .catch(function (error) {
                console.error(error);
            });
    } else {
        alert("CAPTCHA entered incorrectly. Please try again.")
    }
}

async function getName() {
    axios.post("https://api.boilerti.me/api/get/profile/", {
        user_id: userstore.user_id
    })
        .then(function (response) {
            name.value = response.data.firstname;
        })
        .catch(function (error) {
            console.error(error);
        });
}

onMounted(() => {
    getName();
})

onMounted(() => {
    getCourseRatings();
});

onMounted(() => {
    getClassroomRatings();
});

onMounted(() => {
    getTaRatings();
});

</script>