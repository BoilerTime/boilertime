<template>
  <main>
    <NavBar />
    <section class="flex p-24 bg-gray-200 dark:bg-neutral-600 h-screen justify-center align-center items-center">
    <div class="grid grid-cols-5 gap-x-20">
      <div class="col-span-2">
        <div class="text-4xl font-bold text-black dark:text-gray-200">
          Get started with
        </div>
        <div class="text-4xl font-bold text-yellow-500">
          building your schedule
        </div>
        <h2 class="text-lg font-semibold mt-8 mb-4 dark:text-gray-200">What is the difference between these two?</h2>
        <p class="text-md leading-relaxed dark:text-gray-200">Classes you have to take are your required classes for the semester.
          It's classes that are up next on your major's degree plan. We will prioritize this when generating your
          optimized
          schedule.
          <br /><br />
          Classes you want to take are your optional classes for the semester. It's classes that you are interested
          in for electives or just for fun. We will fit these classes in where we can in generating your optimized
          schedule.
        </p>
      </div>
      <div class="rounded-lg bg-white dark:bg-neutral-700 p-12 shadow-2xl col-span-3">
        <div class="relative">
          <div class="mb-8">
            <label class="text-md font-semibold dark:text-gray-200">Select your time of day preference:</label>
            <fieldset class="mt-2">
              <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <div v-for="time in timePreference" :key="time.id" class="flex items-center">
                  <input :id="time.id" type="radio" :checked="time.id === 'none'" :value="time.id" v-model="time_pref" class="h-4 w-4" />
                  <label :for="time.id" class="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">{{ time.title }}</label>
                </div>
              </div>
            </fieldset>
          </div>
          <label class="text-md font-semibold dark:text-gray-200">Add classes you have to take:</label>
          <input v-model="searchTerm"
            class="w-full px-4 py-2 mt-3 rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 border dark:border-black"
            placeholder="Search for classes..." @keyup.enter="addSingleResultToSelected">
          <ul v-if="isSearchActive && filteredResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-600 dark:text-gray-200 outline-black rounded-lg shadow-lg max-h-48 overflow-scroll">
            <li v-for="result in filteredResults" :key="result"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white" @click="addToSelected(result)">
              <span class="bg-yellow-500 flex items-center" v-if="bookmarked_classes.includes(result)">
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
            <label class="text-md font-semibold dark:text-gray-200">Add classes you want to take:</label>
            <input v-model="optionalSearchTerm"
              class="w-full px-4 py-2 mt-3 rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 border dark:border-black"
              placeholder="Search for classes..." @keyup.enter="addSingleOptionalToSelected">
            <ul v-if="isOptionalSearchActive && filteredOptionalResults.length > 0"
              class="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-600 dark:text-gray-200 outline-black rounded-lg shadow-lg max-h-48 overflow-scroll">
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
            <label class="text-md font-semibold dark:text-gray-200">Drag classes here to bookmark them for later:</label>
            <draggable v-model="bookmarked_classes" group="classes" item-key="id"
              class="relative flex rounded-lg border-2 border-dashed border-gray-300 p-3 mt-3">
              <template #item="{ element, index }">
                <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 hover:bg-red-500"
                  @click="removeFromBookmarked(index)">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="mt-8">
            <button @click="submit" class="bg-yellow-500 hover:bg-yellow-700 text-white p-2 text-md font-bold border dark:border-black rounded-md">
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
          class="flex min-h-full items-center justify-center p-4 text-center"
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-700 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium leading-6 text-gray-900 text-center dark:text-gray-200"
              >
                Optimizing Your Schedule!
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-200">
                  Hang tight, our algorithm is hard at work finding you the perfect schedule!
                </p>
                <br/>
                <p class="text-sm text-gray-500 dark:text-gray-200">
                  Progress: 
                </p>
                <ProgressBar :bgcolor="'#6a1b9a'" :completed="completed"  style="width:100%"/>
              </div><br/>
              <button @click="cancel()" class="bg-yellow-500 hover:bg-yellow-700 text-white p-2 text-md font-bold border dark:border-black rounded-md" style="align: text-center;" >
                Cancel
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
          class="flex min-h-full items-center justify-center p-4 text-center"
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h1"
                class="text-xl font-medium leading-6 text-gray-900 text-center"
              >
                We're Done -- Quick Question
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Which Schedule Looks Good to You?
                </p>
                <p class="text-xs text-gray-500"><i>Note, becuase optimization relies on ML, some options may not look correct. </i></p>
                <v-card text="..."></v-card>
              </div>

            <!-- Data items -->
            <div v-for="(schedule, index) in schedule" :key="schedule" class="p-4 cursor-pointer"
              @click="getScheduleView(index)">
              <div
                class="flex flex-col justify-between w-full h-full overflow-hidden bg-gray-100 border-2 border-gray-400 rounded-lg hover:bg-blue-100 transition duration-300">
                <div class="flex items-center justify-left flex-grow" style="margin-left: 5%; margin-top: 5%; margin-right: 5%;">
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
</template>

<script setup>
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
const toast = useToast();

const data = ref([])
const optionalData = ref([])
const userStore = useUserStore()
const time_pref = ref('')
const rmp = ref('')
const isOpen = ref(false)
const isResultOpen = ref(false);
const completed = ref(0)
const schedule = ref('');
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
  }
  $socket.onmessage = ((data) => {
    console.log("data", JSON.parse(data.data))
    try {
      let response = JSON.parse(data.data);
      console.log("STATUS" + response.status)
      if(response?.message == "schedule") {
        parseCoursesResponse(response.data);
      } else if (response?.message == "Status Update") {
        if(completed.value < 100) {
          //completed.value = (completed.value + response.data)%100;v
          var temp = completed.value + response.data;
          if(temp > 99) {
            completed.value = 99;
          } else {
            completed.value = temp;
          }
        }

      }
      if(response.status === 404) {
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

function submit() {
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
    openModal()
    axios.post('http://localhost:3001/api/createschedule', {
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value,
      time: time_pref.value,
      time: timePrefValue,
      rmp: rmpValue
    }, config).then((response) => {
      sendToOptimizer(response.data.schedule)
      courseList = response.data.schedule;
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

function sendToOptimizer(data) {
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
  $socket.send(data.length)
  //Next, we send the time of day preferences
  $socket.send(timePrefValue)
  //$socket.send(timePreference[time_pref.value]);
  //Next, we send the RMP prefernces
  $socket.send(rmpValue);

  //Next, we can start iterating over the course list
  for(let i = 0; i < data.length; i++) {
    //First, we can send the name of the course
    $socket.send(data[i].name)
    //Next, we can send the number of sections
    $socket.send(data[i].isRequired)

    $socket.send(data[i].startTimes.length);
    //Next, we iterate through each of the options and send the parameters of that option
    for(let j = 0; j < data[i].startTimes.length; j++) {
      //First, we can send the start time
      $socket.send(fixTime(data[i].startTimes[j]));
      //Durations
      $socket.send(data[i].durations[j]);
      //Week days 
      console.log(data[i].daysOfWeek[j]);
      $socket.send(data[i].daysOfWeek[j]);
      //RMP
      $socket.send(data[i].rmp[j]);
      //Section ID
      $socket.send(data[i].sectionIDs[j]);
    }
  }
}

function parseCoursesResponse(data) {
  isResultOpen.value = true; 
  let timePrefValue = time_pref.value;
  let rmpValue = "none"
  if(timePrefValue == '' ){
    timePrefValue = "None";
    rmpValue = "RMP";
  } else if(timePrefValue = "None") {
    rmpValue = "RMP";
  }

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
  navigateTo('/app/home')
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
</script>

<style scoped>
.hover\:bg-red-500:hover {
  background-color: #EF4444;
}

.hover\:bg-red-500:hover::after {
  content: ' ✖';
}
</style>
