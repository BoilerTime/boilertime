<template>
  <main>
    <NavBar />
    <section class="flex items-center justify-center h-screen p-24 bg-gray-200 dark:bg-neutral-600 align-center">
    <div class="grid grid-cols-5 gap-x-20">
      <div class="col-span-2">
        <div class="text-4xl font-bold text-black dark:text-gray-200">
          Get started with
        </div>
        <div class="text-4xl font-bold text-yellow-500">
          building your schedule
        </div>
        <h2 class="mt-8 mb-4 text-lg font-semibold dark:text-gray-200">What is the difference between these two?</h2>
        <p class="leading-relaxed text-md dark:text-gray-200">Classes you have to take are your required classes for the semester.
          It's classes that are up next on your major's degree plan. We will prioritize this when generating your
          optimized
          schedule.
          <br /><br />
          Classes you want to take are your optional classes for the semester. It's classes that you are interested
          in for electives or just for fun. We will fit these classes in where we can in generating your optimized
          schedule.
        </p>
      </div>
      <div class="p-12 bg-white rounded-lg shadow-2xl dark:bg-neutral-700 col-span-3">
        <div class="relative">
          <div class="mb-8">
            <label class="font-semibold text-md dark:text-gray-200">Select your time of day preference:</label>
            <fieldset class="mt-2">
              <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <div v-for="time in timePreference" :key="time.id" class="flex items-center">
                  <input :id="time.id" type="radio" :checked="time.id === 'none'" :value="time.id" v-model="time_pref" class="w-4 h-4" />
                  <label :for="time.id" class="block ml-3 text-sm font-medium text-gray-900 leading-6 dark:text-gray-200">{{ time.title }}</label>
                </div>
              </div>
            </fieldset>
          </div>
        <div class="relative mb-8">
          <label class="font-semibold text-md dark:text-gray-200">Add time restrictions:</label>
          <!--Radio button for selecting day of week-->
          <div class="mt-2 grid w-[13rem] grid-cols-5 space-x-2 rounded-xl bg-gray-200 p-2" x-data="app">
            <div>
              <input type="radio" name="dayofweek" id="Monday" class="peer hidden"/>
              <label for="Monday" class="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">M</label>
            </div>
            <div>
              <input type="radio" name="dayofweek" id="Tuesday" class="peer hidden"/>
              <label for="Tuesday" class="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">T</label>
            </div>
            <div>
              <input type="radio" name="dayofweek" id="Wednesday" class="peer hidden"/>
              <label for="Wednesday" class="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">W</label>
            </div>
            <div>
              <input type="radio" name="dayofweek" id="Thursday" class="peer hidden"/>
              <label for="Thursday" class="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">R</label>
            </div>
            <div>
              <input type="radio" name="dayofweek" id="Friday" class="peer hidden"/>
              <label for="Friday" class="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">F</label>
            </div>
          </div>
          <!--Time of day inputs-->
          <div class="flex mt-2">
            <div class="mt-2 p-2 bg-gray-200 rounded-lg">
                <select name="hours" class="bg-transparent text-x0.5 appearance-none outline-none">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <span class="text-x0.5 mr-2">:</span>
                <select name="minutes" class="bg-transparent text-x0.5 appearance-none outline-none mr-4">
                  <option value="0">00</option>
                  <option value="30">30</option>
                </select>
                <select name="ampm" class="bg-transparent text-x0.5 appearance-none outline-none">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
            </div>
            <div class="font-bold mr-4 ml-4 mt-3.5">-</div>
            <div class="mt-2 p-2 bg-gray-200 rounded-lg">
                <select name="hours" class="bg-transparent text-x0.5 appearance-none outline-none">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <span class="text-x0.5 mr-2">:</span>
                <select name="minutes" class="bg-transparent text-x0.5 appearance-none outline-none mr-4">
                  <option value="0">00</option>
                  <option value="30">30</option>
                </select>
                <select name="ampm" class="bg-transparent text-x0.5 appearance-none outline-none">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
            </div>
          </div>
          <!--Button for adding time restrictions-->
            <button type="leave" class="mt-2 w-1/8 bg-gray-300 hover:bg-gray-400 text-black font-bold border dark:border-black py-2 px-2 rounded-lg"
              @click="addRestriction">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>    
            </button>
            <fieldset class="mt-2">
              <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <div v-for="timeRestr in timeRestrictions" :key="timeRestr.id" class="flex items-center">
                  <input :id="timeRestr.id" type="checkbox" :checked="timeRestr.id === 'none'" :value="timeRestr.id" v-model="time_restr" class="w-4 h-4" />
                  <label :for="timeRestr.id" class="block ml-3 text-sm font-medium text-gray-900 leading-6 dark:text-gray-200">{{ timeRestr }}</label>
                </div>
              </div>
            </fieldset>
            <!--Below is an example, not for final use-->
            <li class="font-bold text-lg">
              <input id="timeRestr-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="timeRest-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">M 1:30-2:30 PM</label>
            </li>
          </div>
          <label class="font-semibold text-md dark:text-gray-200">Add classes you have to take:</label>
          <input v-model="searchTerm"
            class="w-full px-4 py-2 mt-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 dark:border-black"
            placeholder="Search for classes..." @keyup.enter="addSingleResultToSelected">
          <ul v-if="isSearchActive && filteredResults.length > 0"
            class="absolute z-10 w-full mt-1 overflow-scroll bg-white rounded-lg shadow-lg dark:bg-neutral-600 dark:text-gray-200 outline-black max-h-48">
            <li v-for="result in filteredResults" :key="result"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white" @click="addToSelected(result)">
              <span class="flex items-center bg-yellow-500" v-if="bookmarked_classes.includes(result)">
                <BookmarkIcon class="w-4 mr-2" />
                <span>{{ result }}</span>
              </span>
              <span v-else>{{ result }}</span>
            </li>
          </ul>
          <draggable v-model="selectedRequiredCourses" group="classes" item-key="id" class="flex flex-wrap">
            <template #item="{ element, index }">
              <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 mt-3 hover:bg-red-500"
                @click="removeFromSelected(index)">
                {{ element }}
              </div>
            </template>
          </draggable>
          <div class="relative mt-8">
            <label class="font-semibold text-md dark:text-gray-200">Add classes you want to take:</label>
            <input v-model="optionalSearchTerm"
              class="w-full px-4 py-2 mt-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 dark:border-black"
              placeholder="Search for classes..." @keyup.enter="addSingleOptionalToSelected">
            <ul v-if="isOptionalSearchActive && filteredOptionalResults.length > 0"
              class="absolute z-10 w-full mt-1 overflow-scroll bg-white rounded-lg shadow-lg dark:bg-neutral-600 dark:text-gray-200 outline-black max-h-48">
              <li v-for="result in filteredOptionalResults" :key="result"
                class="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
                @click="addToSelectedOptional(result)">
                {{ result }}
              </li>
            </ul>
            <draggable v-model="selectedOptionalCourses" group="classes" item-key="id" class="flex flex-wrap">
              <template #item="{ element, index }">
                <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 mt-3 hover:bg-red-500"
                  @click="removeOptional(index)">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="relative mt-8">
            <label class="font-semibold text-md dark:text-gray-200">Drag classes here to bookmark them for later:</label>
            <draggable v-model="bookmarked_classes" group="classes" item-key="id"
              class="relative flex p-3 mt-3 border-2 border-gray-300 border-dashed rounded-lg">
              <template #item="{ element, index }">
                <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 hover:bg-red-500"
                  @click="removeFromBookmarked(index)">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="mt-8">
            <button @click="submit" class="p-2 font-bold text-white bg-yellow-500 border hover:bg-yellow-700 text-md dark:border-black rounded-md">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  </main>

  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl dark:bg-neutral-700 transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-large text-center leading-6 dark:text-gray-200"
                style="font-size: 30px;"
              >
                <b>{{status}}</b><span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span>
              </DialogTitle>
              <div class="mt-2">
                <p v-if="!inLine" class="text-sm text-gray-500 dark:text-gray-200 text-center">
                  We're building your perfect schedule. This might take a bit
                </p>
                <p v-else class="text-sm text-gray-500 dark:text-gray-200 text-center">
                  Waiting in line: Position {{posInLine}} of {{totalPos}}
                </p>

                <p v-if="inLine" class="text-sm text-gray-500 dark:text-gray-200 text-center">
                  Expected wait: {{mins}}
                </p>
                <!--div class="content-center animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-600" style="text-align: center;"></div-->
                <br/>
                <div v-if="multiLoader" class="justify-center items-center">
                  <div class="flex items-center justify-center">
                    <div class="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-500 to-gray-500 animate-spin">
                    <div class="h-20 w-20 rounded-full bg-white dark:bg-neutral-700"></div>
                  </div>
                </div>
              </div>
                <div class="mt-2" v-if="algorithmProgress">
                  <p class="text-sm text-gray-500 dark:text-gray-200">Progress:</p>
                  <ProgressBar :bgcolor="'#6a1b9a'" :completed="completed"  style="width:100%"/>
                </div>
              </div><br/>
              <button @click="cancel()" class="bg-yellow-500 hover:bg-yellow-700 text-white p-2 text-md font-bold border dark:border-black rounded-md" style="align: text-center;" >
                Cancel
              </button>
              <button @click="displayTips = true" class="float-right bg-yellow-500 hover:bg-yellow-700 text-white p-2 text-md font-bold border dark:border-black rounded-md" style="align: text-right;" >
                Tips
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot :show="isResultOpen" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium text-center text-gray-900 leading-6"
              >
                We're Done -- Quick Question
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Which Schedule Looks Good to You?
                </p>
                <p class="text-xs text-gray-500"><i>Note, becuase optimization relies on ML, some options may not look correct. </i></p>
              </div>

            <!-- Data items -->
            <div v-for="(schedule, index) in schedule" :key="schedule" class="p-4 cursor-pointer"
              @click="getScheduleView(index)">
              <div
                class="flex flex-col justify-between w-full h-full overflow-hidden bg-gray-100 border-2 border-gray-400 rounded-lg hover:bg-blue-100 transition duration-300">
                <div class="flex items-center flex-grow justify-left" style="margin-left: 5%; margin-top: 5%; margin-right: 5%;">
                  <div>
                   <span class="text-sm text-black" 
                      >{{ schedule }} <br/>
                    </span><br/>
                  </div>
                </div>
                </div>
            </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot :show="displayTips" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-l p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium text-center text-black leading-6"
                style="font-size: 36px;"
              >
                <b>About BoilerTime</b>
              </DialogTitle>
              <div>
                <p class="text-xl">
                  How it Works
                </p>
                <ul class="list-disc list-inside text-sm">
                  <li>We use an advanced algorithm that uses data like coure times and RMP ratings then combine it with your preferences</li>
                  <li>After generating literally thousands of options, we select the best couple of options and make those your schedules</li>
                  <li>Becuase the algorithm uses a lot of processing power, we can only let a limited number of devices use it at once</li>
                </ul>
              </div>
              <br/>
              <div>
                <p class="text-xl">
                  How to Use It
                </p>
                <ul class="list-disc list-inside text-sm">
                  <li>It looks like you're already an expert! Congrats on making a schedule</li>
                  <li>Next time, look at our hub first to discover classes you might want to take and see a bit of info first
                  <ul class="list-none list-inside text-sm" style="margin-left: 1%">
                    <li> - That way, you can see if the right professors, times of day, or locations are there for you</li>
                    <li> - You can always bookmark a course to come back later if you're not satisfied</li>
                  </ul></li>
                  <li>Becuase the algorithm uses a lot of processing power, we can only let a limited number of devices use it at once</li>
                  <ul class="list-none list-inside text-sm" style="margin-left: 1%">
                    <li> - To save everyone time and money, take a look over the class options before optimizing</li>
                    <li> - Never re-optimize the same schedule unless you don't like any of the results</li>
                    <li> - If you've inputted optional classes that don't show up in any of the options, remove another class before re-optimizing</li>
                  </ul>
                  <li>Be realistic about the number of classes you'd like to take, the number of classes inputted will be filled</li>
                </ul>
              </div>
              <button @click="closeTips()" class="float-middle bg-yellow-500 hover:bg-red-700 text-white p-2 text-md font-bold border dark:border-black rounded-md" style="align: text-center;" >
                Close
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
/*
 * Status Possibilities
 * 1) Getting data for schedule from backend
 * 2) Sending schedule data to algorithm
 * 3) Waiting in line for optimization 
 * 4) Optimizing
 */
import { ref, computed, watchEffect, watch } from 'vue'
import axios from 'axios'
import { useUserStore } from "../../store/user";
import ProgressBar from "../../components/ProgressBar.vue";
import { POSITION, useToast } from "vue-toastification";

import draggable from 'vuedraggable'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

import { BookmarkIcon } from "@heroicons/vue/24/outline"
const { $socket } = useNuxtApp()

const data = ref([])
const optionalData = ref([])
const userStore = useUserStore()
const time_pref = ref('')
const rmp = ref('')
const isOpen = ref(false)
const isResultOpen = ref(false);
const completed = ref(0)
const schedule = ref('');
const toast = useToast();
const isAlgoActive = ref(false);
const status = ref('');
const algorithmProgress = ref(true)
const inLine = ref(false)
const posInLine = ref('');
const totalPos = ref('');
const multiLoader = ref(false)
const displayTips = ref(false)
const mins = ref('');
const restrMax = ref(true);
var totalSum;

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}

var courseList; 
var resultsList = [];

var accessToken = userStore.accessToken;
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}

const timePreference = [
  { id: 'none', title: 'No preference' },
  { id: 'morning', title: 'Before 12 noon' },
  { id: 'afternoon', title: 'After 12 noon' },
]

onBeforeMount(() => {
  axios.get('http://localhost:3001/api/searchnew', config).then((response) => {
    data.value = response.data
  })
  axios.get('http://localhost:3001/api/searchnew', config).then((response) => {
    optionalData.value = response.data
  })
  axios.post('http://localhost:3001/api/getclasses', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    selectedRequiredCourses.value = response.data.required_classes
  })
  axios.post('http://localhost:3001/api/getclasses', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    selectedOptionalCourses.value = response.data.optional_classes
  })
  axios.post('http://localhost:3001/api/getbookmarks', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    bookmarked_classes.value = response.data.bookmarks
  })
})
const searchTerm = ref('')
const filteredResults = computed(() => {
  if (!searchTerm.value) {
    return []
  }

  return data.value.filter((item) => {
    return item.toLowerCase().startsWith(searchTerm.value.toLowerCase())
  })
})

onMounted(() => {
  $socket.onopen = () => {
    console.log("Connected")
    console.log("Are we open? " + isOpen.value)
    //algorithmProgress.show = true
  }
  $socket.onmessage = ((data) => {
    console.log("data", (data.data))
    try {
      let response = JSON.parse(data.data);
      console.log("STATUS" + response.status)
      if(response?.message == "schedule") {
        parseCoursesResponse(response.data);
      } else if (response?.message == "Status Update") {
        //isAlgoActive.value = true;
        optimizing(response.data);
      } else if (response?.status == 102 && response?.message == "Position in Queue Update") {
        inQueue(response.data.currentPos, response.data.totalWaiting);
      } else if(response.status === 404) {
          console.log("ERROR!!")
          toast.error("No Schedule Found!! Please try again ", {
            timeout: 5000,
            position: POSITION.BOTTOM_RIGHT
          });
          
        }
    } catch (e) {
      console.log("Wasnt JSON!!" + e)
    }
})

  $socket.onclose = function () {
    console.log("disconnected")
  }

})

const selectedRequiredCourses = ref([])
const isSearchActive = ref(false)

function addToSelected(item) {
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }
  if (selectedRequiredCourses.value.length < 5 && !selectedRequiredCourses.value.includes(item)
    && !selectedOptionalCourses.value.includes(item)) {
    selectedRequiredCourses.value.push(item)
    isSearchActive.value = false
    searchTerm.value = ''
    axios.post('http://localhost:3001/api/saveschedule', {
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value, 
      time: timePrefValue,
      rmp: rmpValue
    }, config).then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id
        }
        accessToken = userStore.accessToken;
        config.headers['authorization'] = `Bearer ${accessToken}`;
      }
    })
  }
  if (selectedRequiredCourses.value.length > 5) {
    alert('You can only select 5 required courses')
    searchTerm.value = ''
  }
  if (selectedOptionalCourses.value.includes(item)) {
    alert('You cannot select the same course twice')
    searchTerm.value = ''
  }
}

function addSingleResultToSelected() {
  if (filteredResults.value.length >= 1) {
    addToSelected(filteredResults.value[0])
  }
}

function addSingleOptionalToSelected() {
  if (filteredOptionalResults.value.length >= 1) {
    addToSelectedOptional(filteredOptionalResults.value[0])
  }
}

const optionalSearchTerm = ref('')
const filteredOptionalResults = computed(() => {
  if (!optionalSearchTerm.value) {
    return []
  }

  return optionalData.value.filter((item) => {
    return item.toLowerCase().startsWith(optionalSearchTerm.value.toLowerCase())
  })
})


const selectedOptionalCourses = ref([])
const isOptionalSearchActive = ref(false)

function addToSelectedOptional(item) {
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }
  if (selectedOptionalCourses.value.length < 5 && !selectedOptionalCourses.value.includes(item)
    && !selectedRequiredCourses.value.includes(item)) {
    selectedOptionalCourses.value.push(item)
    isOptionalSearchActive.value = false
    optionalSearchTerm.value = ''
    axios.post('http://localhost:3001/api/saveschedule', {
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value,
      time: timePrefValue,
      rmp: rmpValue
    }, config).then((response) => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id
        }
        accessToken = userStore.accessToken;
        config.headers['authorization'] = `Bearer ${accessToken}`;
      }
    })
  }
  if (selectedOptionalCourses.value.length > 5) {
    alert('You can only select 5 optional courses')
    optionalSearchTerm.value = ''
  }
  if (selectedRequiredCourses.value.includes(item)) {
    alert('You cannot select the same course twice')
    optionalSearchTerm.value = ''
  }
}

function removeFromSelected(index) {
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }

  selectedRequiredCourses.value.splice(index, 1)
  axios.post('http://localhost:3001/api/saveschedule', {
    user_id: userStore.user_id,
    required_classes: selectedRequiredCourses.value,
    optional_classes: selectedOptionalCourses.value,
    time: timePrefValue,
    rmp: rmpValue
  }, config).then((response) => {
    if (response.data["accessToken"] != undefined) {
      userStore.user = {
        accessToken: response.data["accessToken"],
        //refreshToken: response.data["refreshToken"],
        user_id: user_id
      }
      accessToken = userStore.accessToken;
      config.headers['authorization'] = `Bearer ${accessToken}`;
    }
  })
}

function removeOptional(index) {
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }
  selectedOptionalCourses.value.splice(index, 1)
  axios.post('http://localhost:3001/api/saveschedule', {
    user_id: userStore.user_id,
    required_classes: selectedRequiredCourses.value,
    optional_classes: selectedOptionalCourses.value,
    time: timePrefValue,
    rmp: rmpValue
  }, config).then((response) => {
    if (response.data["accessToken"] != undefined) {
      userStore.user = {
        accessToken: response.data["accessToken"],
        //refreshToken: response.data["refreshToken"],
        user_id: user_id
      }
      accessToken = userStore.accessToken;
      config.headers['authorization'] = `Bearer ${accessToken}`;
    }
  })
}

function removeFromBookmarked(index) {
  bookmarked_classes.value.splice(index, 1);
  axios.post('http://localhost:3001/api/removebookmark', {
    user_id: userStore.user_id,
    class_name: bookmarked_classes.value
  }, config).then(() => {
    console.log('Bookmark removed')
  })
}

const bookmarked_classes = ref([])
function addToBookmarked(item) {
  if (!this.bookmarked_classes.includes(item)) {
    this.bookmarked_classes.push(item);
  }
}

watchEffect(() => {
  if (searchTerm.value.length > 0) {
    isSearchActive.value = true
  } else {
    isSearchActive.value = false
  }
})

watchEffect(() => {
  if (optionalSearchTerm.value.length > 0) {
    isOptionalSearchActive.value = true
  } else {
    isOptionalSearchActive.value = false
  }
})

watch(bookmarked_classes, (newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    const newBookmark = newVal[newVal.length - 1]
    console.log(`New bookmark added: ${newBookmark}`)
    console.log(bookmarked_classes.value)
    axios.post('http://localhost:3001/api/addbookmark', {
      user_id: userStore.user_id,
      class_name: bookmarked_classes.value
    }, config).then(() => {
      console.log('Bookmark added')
    })
  }
  if (newVal.length < oldVal.length) {
    const removedBookmark = oldVal[oldVal.length - 1]
    console.log(`Bookmark removed: ${removedBookmark}`)
    console.log(bookmarked_classes.value)
    axios.post('http://localhost:3001/api/removebookmark', {
      user_id: userStore.user_id,
      class_name: bookmarked_classes.value
    }, config).then(() => {
      console.log('Bookmark removed')
    })
  }
})

var isAGuest = ref(true)

onMounted(async () => {
  if (userStore.user_id) {
    isAGuest.value = false
  }
})

function submit() {
   if (isAGuest.value) {
    toast.error("You must be logged in to use the optimizer!", {
      timeout: 5000,
      position: POSITION.TOP_CENTER
    });
    return
  }
  console.log("time pref = " + time_pref.value);
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }
  if (selectedRequiredCourses.value.length > 0) {
    openModal();
    waitingForData();
    axios.post('http://localhost:3001/api/createschedule', {
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value,
      time: time_pref.value,
      time: timePrefValue,
      rmp: rmpValue,
      blocked_times: [{start_time: "0830", duration: 50, days_of_week: "Monday", name: "breakfast"}, {start_time: "1230", duration: 60, days_of_week: "Monday, Tuesday, Wednesday, Thursday, Friday", name: "lunch"}]
    }, config).then((response) => {
      sendToOptimizer(response.data.schedule, response.data.blocked_times)
      courseList = response.data.schedule;
      isAlgoActive.value = false;

      console.log("TWT")
      console.log(courseList)
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id
        }
        accessToken = userStore.accessToken;
        config.headers['authorization'] = `Bearer ${accessToken}`;
      }
      //navigateTo('/app/view')
    })
  } else {
    console.log("Error: No classes!")
  }
  console.log("List: ")

  
}

function sendToOptimizer(courses, blocks) {
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }

  if(!isOpen.value) {
    console.log("Critical Error: WS isn't open ")
  }
  //We first need to send them number of classes we will be optimzing by
  $socket.send(courses.length)
  $socket.send(blocks.length);
  //Next, we send the time of day preferences
  $socket.send(timePrefValue)
  //$socket.send(timePreference[time_pref.value]);
  //Next, we send the RMP prefernces
  $socket.send(rmpValue);

  /*
    * Take care of the courses that the user has entered
  */
  for(let i = 0; i < courses.length; i++) {
    //First, we can send the name of the course
    $socket.send(courses[i].name)
    //Next, we can send the number of sections
    $socket.send(courses[i].isRequired)

    $socket.send(courses[i].startTimes.length);
    //Next, we iterate through each of the options and send the parameters of that option
    for(let j = 0; j < courses[i].startTimes.length; j++) {
      //First, we can send the start time
      $socket.send(fixTime(courses[i].startTimes[j]));
      //Durations
      $socket.send(courses[i].durations[j]);
      //Week days 
      console.log(courses[i].daysOfWeek[j]);
      $socket.send(courses[i].daysOfWeek[j]);
      //RMP
      $socket.send(courses[i].rmp[j]);
      //Section ID
      $socket.send(courses[i].sectionIDs[j]);
    }
  }
  /*
    * Take care of the blocks that the user has entered
  */
  for(let i = 0; i < blocks.length; i++) {
    $socket.send(blocks[i].name);
    $socket.send(blocks[i].start_time);
    $socket.send(blocks[i].duration);
    $socket.send(blocks[i].days_of_week);
  }
}

function parseCoursesResponse(data) {
  console.log("Parsing Response!!!!!");
  displayingResults();
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }
  data = data.lectures;
  const formatString = "course_name at course_time on course_week_days"
  var courses = [];
  console.log(data)
  for(let i = 0; i < data.length; i++) {
    
    //let thisFormat = [];
    let thisFormat = "";
    for(let j = 0; j < data[i].length; j++) {
      let string = "";
      if(j == data[i].length - 1) {
        console.log("TWT")
        string += "and "
      }
      let tempForm = new String(formatString);
      string+= tempForm;
      console.log(data[i][j]);
      string = string.replace("course_name", data[i][j].courseID);
      string = string.replace("course_time", fto2(data[i][j].courseStartTime));
      string = string.replace("course_week_days", (data[i][j].daysOfWeek));
      if(j != data[i].length - 1) {
        string += ", "
      }
      thisFormat += (string)
    }
    courses.push(thisFormat)
  }

  schedule.value = courses;
  console.log("Temp Form = " + courses);
  
  let serverFormat = {"subject": "", "number": "", "userSections": {"meetings": [], "sectionID": ""}};
  for(let j = 0; j < data.length; j++) {
    let serverOutput = {"rmp": rmpValue, "time": timePrefValue, "schedule": []};

    for(let i = 0; i < data[j].length; i++) {
      let name = data[j][i].courseID;
      let thisFormat = JSON.parse(JSON.stringify(serverFormat));
      let indexForTarget = findCourse(name);
      //console.log("index = " + indexForTarget)
      //console.log("Data = " + JSON.stringify(data[i]))
      let indexIn = findIDIndex(indexForTarget, data[j][i].sectionId);
      thisFormat.subject = name.split(' ')[0];
      thisFormat.number = name.split(' ')[1];

      thisFormat.userSections.sectionID = (courseList[indexForTarget].collectionIDs[indexIn])
      thisFormat.userSections.meetings.push(data[j][i].sectionId);
      serverOutput.schedule.push(thisFormat)
    }
    resultsList.push(serverOutput);
  }
} 


function findCourse(target) {
  for(let i = 0; i < courseList.length; i++) {
    if(courseList[i].name == target) {
      return i;
    }
  }
}

function findIDIndex(position, target) {
  for(let i = 0; i < courseList[position].sectionIDs.length; i++) {
    if(courseList[position].sectionIDs[i] == target) {
      return i;
    }
  }
}

function saveOptimizedSchedule(schedule) {
  axios.post('http://localhost:3001/api/saveoptimizedschedule', {
    data: schedule,
    user_id: userStore.user_id
  }).then(() => {
    console.log("Schedule Saved!");
  }).catch((exception) => {
    console.log("Couldn't save schedule because of " + exception);
  })
  console.log("Done!")
}

function fto2(time) {
  if(time.length == 3) {
    let hours = parseInt(time.substring(0, 1));
    let minutes = parseInt(time.substring(1, 3));
    let amPM = " am";
    if(hours >= 12) {
      amPM = " pm"
    }
    hours = parseInt(hours);
    hours = ((hours + 11) % 12 + 1);
    minutes = parseInt(minutes);
    return hours + ":" + minutes + amPM;
  } else if (time.length == 4) {
    let hours = parseInt(time.substring(0, 2));
    let minutes = parseInt(time.substring(2, 4));
    let amPM = " am";
    if(hours >= 12) {
      amPM = " pm"
    }
    console.log(hours + " " + minutes)
    if(hours > 12) {
      hours = hours - 12;
    }
    console.log(hours)
  
    return hours + ":" + minutes + amPM;
  }
}
function cancel() {
  //$socket.close()
  console.log("CLOSING!!!")
  $socket.close();
  navigateTo('/app')
}

function getScheduleView(index) {
  saveOptimizedSchedule(resultsList[index]);
  navigateTo('/app/view/spring_2023')
}

function fixTime(time) {
  let hours = time.substring(0, 2)
  hours = parseInt(hours - 5);
  return new String(hours) + time.substring(2, 4);
}

function waitingForData() {
  const messages = ["Getting Course Data", "Talking to Sever", "Getting Schedules", "Loading Options"]; 
  status.value = messages[randInt(messages.length - 1)];//"Getting Course Data"
  algorithmProgress.value = false;
  inLine.value = false;
  multiLoader.value = true;
}

function inQueue(position, size) {
  const messages = ["Waiting to Optimize", "Optimizing Soon", "Waiting", "Ready to Optimize"];
  if(!inLine.value)
    status.value = messages[randInt(messages.length - 1)];//"Getting Course Data"
  inLine.value = true;
  algorithmProgress.value = false;
  posInLine.value = position;
  totalPos.value = size;
  multiLoader.value = true;
  mins.value = (position / 2).toPrecision(2) + " Minute" + pluralize((position / 2).toPrecision(1))
}

function optimizing(progress) {
  const messages = ["Optimizing", "Loading Perfection", "Generating Schedule", "Maximizing Schedule"];
  if(!algorithmProgress.value)
    status.value = messages[randInt(messages.length - 1)];//"Getting Course Data" 

  algorithmProgress.value = true;
  inLine.value = false;
  multiLoader.value = false;
  if(completed.value < 100) {
    //completed.value = (completed.value + response.data)%100;v
    var temp = completed.value + progress;
    if(temp > 99) {
      completed.value = 99;
    } else {
      completed.value = temp;
    }
  }
}

function displayingResults() {
  closeModal();
  if(displayTips.value) {
    toast.info("Your optimize schedule is ready! Close this to take a look", {
          timeout: 5000,
          position: POSITION.BOTTOM_RIGHT
        });
  } else {
    isResultOpen.value = true;
  }
}

function closeTips() {
  displayTips.value = false;
  if(!isOpen.value) {
    isResultOpen.value = true;
  }
}
function randInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function pluralize(value) {
  if(value == 1) {
    return ""
  }
  return "s";
}
</script>

<style scoped>
.hover\:bg-red-500:hover {
  background-color: #EF4444;
}

.hover\:bg-red-500:hover::after {
  content: ' ✖';
}

@keyframes blink {50% { color: transparent }}
.loader__dot { animation: 1s blink infinite }
.loader__dot:nth-child(2) { animation-delay: 250ms }
.loader__dot:nth-child(3) { animation-delay: 500ms }
</style>
