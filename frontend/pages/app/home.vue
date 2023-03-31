<template>
  <main>
    <NavBar />
    <div class="flex flex-wrap" v-if="userSchedules.length !== 0">
      <!-- Add button -->
      <div class="w-1/4 p-4 cursor-pointer" @click="navigateToCreateSchedule()">
        <div
          class="flex items-center justify-center w-full h-full text-gray-400 bg-white border-2 border-gray-400 border-dashed hover:text-gray-500 hover:bg-gray-100 transition duration-300">
          <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 0 1 1 1v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H6a1 1 0 0 1 0-2h4V4a1 1 0 0 1 1-1z" />
          </svg>
        </div>
      </div>

      <!-- Data items -->
      <div v-for="(schedule, index) in userSchedules" :key="index" class="w-1/4 p-4 cursor-pointer h-96"
        @click="getScheduleView(schedule.term_id)">
        <div
          class="flex flex-col justify-between w-full h-full overflow-hidden bg-gray-100 border-2 border-gray-400 rounded-lg hover:bg-blue-100 transition duration-300">
          <div class="px-4 py-2 bg-blue-500">
            <h2 class="text-lg font-bold text-white">{{ formatTitle(schedule.term_id) }}</h2>
          </div>
          <div class="flex items-center justify-center flex-grow">
            <div class="text-left -center">
              Required: <span class="text-sm text-black" 
                >{{ schedule.required_classes.join(", ").trim() }}
              </span>
              <br/>
              Optional: <span class="text-sm text-black" 
                >{{ schedule.optional_classes.join(", ").trim() }}
              </span>
            </div>
          </div>
          <div class="px-4 py-2 mt-auto bg-white">
            <span class="text-sm text-gray-500">{{ schedule.timestamp }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex items-center justify-center h-screen">
        <div class="flex items-center justify-center px-8 py-6 border border-black rounded rounded-lg shadow-lg bg-white-500 hover:bg-blue-100" @click="navigateToCreateSchedule()">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-400 " viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 9a.5.5 0 01.5-.5h3V5a.5.5 0 011 0v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 01-.5-.5z" />
          </svg>
          <span class="ml-4 text-lg text-black-400">Create a new schedule</span>
        </div>
      </div>
    </div>
  </main>
</template>
  
<script setup>
import { onMounted, onUnmounted } from "vue";

import { useUserStore } from "../../store/user"
import axios from "axios";
const userStore = useUserStore();

var user_id = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}

const userSchedules = ref([])
const optimizedSchedule = ref([])
var numSchedules;

async function navigateToCreateSchedule() {
  navigateTo('/app/create')
}

async function getScheduleView(term_id) {
  navigateTo('/app/view/' + term_id)
}

function formatTitle(title) {
  return title.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

onBeforeMount(async () => {
  await axios.post('http://localhost:3001/api/get/user_schedules', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    userSchedules.value = response.data
  });
  /*
  for (var i = 0; i < userSchedules.value.length; i++) {
    console.log(userSchedules.value[i] + " << Value");
  }
  */
  numSchedules = userSchedules.value[userSchedules.value.length - 1].num_schedules;
  console.log(numSchedules + " this is the num schedules");
  //userSchedules.splice(userSchedules.value.length - 1, 1);
  userSchedules.value.pop();
})

let interval;
onMounted(() => {
});

onUnmounted(() => {
  clearInterval(interval);
});

</script>
