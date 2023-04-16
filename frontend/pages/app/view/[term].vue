<template>
  <main>
    <div v-if="friend_id==undefined">
      <NavBar />
    </div>
    <div id="capture" class="flex items-stretch h-full p-3 bg-gray-200 dark:bg-neutral-500">
      <div class="p-12" v-if="isDataLoaded">
        <LazyClassList v-for="course in scheduleData" :key="course.name" :data="course" />
      </div>
      <div v-else class="h-screen p-12 bg-gray-200 dark:bg-neutral-500">
        <h1>Loading...</h1>
      </div>
      <div id="calendar" v-if="result.length > 0">
          <button class="rounded-lg bg-yellow-500 hover:bg-yellow-700 px-4 py-2 text-sm font-bold border dark:border-black text-white" @click="screenie">
            Screenie
          </button>
          <FullCalendar :options="calendarOptions" />
        </div>
        <div v-else class="h-screen p-12 bg-gray-200 dark:bg-neutral-500">
        <h1>Loading...</h1>
      </div>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useUserStore } from '../../../store/user'
import { POSITION, useToast } from "vue-toastification";
const toast = useToast();

const scheduleData = ref([]);
const isDataLoaded = ref(false);
const userStore = useUserStore();
const route = useRoute()
let result = [];
async function convertSchedule(schedule) {
  console.log(schedule)
  for (const course of schedule) {
    for (const meeting of course.meetings) {
      const startDateTime = new Date(meeting.startTime);
      const easternStartTime = startDateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
      const duration = meeting.duration.slice(2).toLowerCase();
      const durationParts = duration.split(/h|m/).map(part => parseInt(part));
      const easternEndTimeDateTime = new Date(startDateTime.getTime() + (durationParts[0] * 60 + durationParts[1]) * 60 * 1000);
      const easternEndTime = easternEndTimeDateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
      const daysOfWeek = meeting.daysOfWeek.map(day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day));
      const id = `${course.subject}${course.number}`;
      async function getgpa(prof_name, class_name) {
        const response = await axios.post('http://localhost:3001/api/getgpa', {
          "prof_name": prof_name,
          "class_name": class_name
        }, config)
        return response?.data?.averageGPA || 0.0
      }
      async function getrmp(prof_name) {
        const response = await axios.post('http://localhost:3001/api/ratemyprofessor', {
          "prof_name": prof_name
        }, config)
        return response?.data?.avgRating || 0.0
      }
      result.push({
        startTime: easternStartTime,
        endTime: easternEndTime,
        title: course.subject+" "+course.number,
        id: id,
        expandRows: true,
        daysOfWeek: daysOfWeek,
      });
    }
  }
}
async function addTitle(schedule) {
  for (const course of schedule) {
    for (const meeting of course.meetings) {
      const id = `${course.subject}${course.number}`;
      const title = `${course.subject} ${course.number} ${meeting.type} ${meeting.section} ${meeting.instructor}`;
      const gpa = await getgpa(meeting.instructor, course.subject + course.number);
      const rmp = await getrmp(meeting.instructor);
    }
  }
}

async function screenie(){
  html2canvas(document.querySelector("#capture")).then(canvas => {
    saveAs(canvas.toDataURL(), 'schedule.png');
  });
}

let click = ''
const calendarOptions = ref({
  plugins: [timeGridPlugin],
  initialView: 'timeGridWeek',
  slotMinTime: "7:00:00",
  slotMaxTime: "21:00:00",
  weekends: false,
  height: "100vh",
  aspectRatio: 10,
  events: result,
  eventClick: function(info) {
    // console.log(info.event.extendedProps.data)
    click = "#" + info.event.id
    // simulate a click of the modal button
    document.querySelector(click).click()
  }
})
var accessToken = userStore.accessToken;
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}

var friend_id = route.query.id;

onBeforeMount(async () => {

  console.log("GroupID:" + friend_id)
  if (friend_id != undefined) {
    await axios.post('http://localhost:3001/api/get/term/optimizedschedule', {
      user_id: friend_id,
      term_id: route.params.term,
    }, config).then((response) => {
      scheduleData.value = response.data.schedule
      convertSchedule(scheduleData.value)
    })
  } else {
    await axios.post('http://localhost:3001/api/get/term/optimizedschedule', {
      user_id: userStore.user_id,
      term_id: route.params.term,
    }, config).then((response) => {

      console.log(response.data + response.data.time);
      showWarning(response.data.time, response.data.rmp)
      scheduleData.value = response.data.schedule
      convertSchedule(scheduleData.value)
    })
  }
});
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isDataLoaded.value = true;
    }, 1000);
  });
})

function showWarning(time, rmp) {
  console.log(time);
  if(rmp.toUpperCase() != "NONE") {
    toast.warning("Warning: Time and RMP May not always be optimized perfectly. We use AI to optimize, meaning that sometimes a sub-optimal solution sneaks through the cracks. ", {
          timeout: 5000,
          position: POSITION.BOTTOM_RIGHT
        });
  } else {
    toast.warning("Warning: Time of Day and RMP may not always be optimized perfectly. We use AI to optimize, meaning that sometimes a sub-optimal solution sneaks through the cracks. ", {
          timeout: 5000,
          position: POSITION.BOTTOM_RIGHT
        });
  }
}
</script>

<style scoped>
  #calendar {
    padding-top: 3rem;
    padding-bottom: 4rem;
    width: 72.5vw;
    display: inline-block;
  }
</style>
