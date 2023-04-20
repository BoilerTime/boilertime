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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </button>
            <button class="rounded-lg bg-yellow-500 hover:bg-yellow-700 px-4 py-2 text-sm font-bold border dark:border-black text-white" @click="exportToPDF">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>            
            </button>
            <button class="rounded-lg bg-yellow-500 hover:bg-yellow-700 px-4 py-2 text-sm font-bold border dark:border-black text-white" @click="copyLink">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>                    
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
//import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useUserStore } from '../../../store/user'
import { jsPDF } from "jspdf";
const { $toast } = useNuxtApp()

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
        const response = await axios.post('https://api.boilerti.me/api/getgpa', {
          "prof_name": prof_name,
          "class_name": class_name
        }, config)
        return response?.data?.averageGPA || 0.0
      }
      async function getrmp(prof_name) {
        const response = await axios.post('https://api.boilerti.me/api/ratemyprofessor', {
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

/**
 * This function will take a screenshot of the calendar and save it in an image format.
 */
async function screenie(){
  html2canvas(document.querySelector("#capture")).then(canvas => {
    saveAs(canvas.toDataURL(), 'schedule.png');
  });
}

/**
 * This function is used to save a schedule in a PDF format
 */
async function exportToPDF() {
  /*
  html2pdf(document.getElementById('capture'), {
    margin: 0,
    filename: "schedule.pdf",
    html2canvas: { scale: 2, letterRendering: true },
    jsPDF: { format: 'A2', orientation: "landscape" }
  });
  */
  html2canvas(document.querySelector("#capture")).then(canvas => {
    var imgData = canvas.toDataURL(
      'image/png');
    var doc = new jsPDF('p', 'mm');
    doc.addImage(imgData, 'PNG', 1000, 1000);
    doc.save('schedule.pdf');
  });
}

/**
 * This function will copy a link when the button is clicked
 */
async function copyLink() {
  try {
    await navigator.clipboard.writeText("localhost:3000/app/view/" + route.params.term + "/?id=" + userStore.user_id);
    console.log("localhost:3000/app/view/" + route.params.term + "/?id=" + userStore.user_id);
    alert("Copied link");
  } catch(error) {
    alert("Cannot copy");
  }
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
    await axios.post('https://api.boilerti.me/api/get/term/optimizedschedule', {
      user_id: friend_id,
      term_id: route.params.term,
    }, config).then((response) => {
      scheduleData.value = response.data.schedule
      convertSchedule(scheduleData.value)
    })
  } else {
    await axios.post('https://api.boilerti.me/api/get/term/optimizedschedule', {
    user_id: userStore.user_id,
    term_id: route.params.term,
  }, config).then((response) => {
    console.log(response.data + response.data.time);
    console.log(response.data)
    showWarning(response.data.configured)
    scheduleData.value = response.data.schedule
    convertSchedule(scheduleData.value)
  }).catch((error) => {
    console.log("THIS IS THE ERROR " + error)
    if (error.response.status == 500) {
      console.log(error);
      $toast.error("You have not optimized this schedule yet!", {
          timeout: 5000,
      });
      navigateTo('/app/create')
    }
  });
  }
});
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isDataLoaded.value = true;
    }, 1000);
  });
})

function showWarning(configured) {
  if(configured) {
    $toast.info("We try to fit your preferences, but sometimes it's difficult to find a schedule that satisfies all of them. ", {
          timeout: 5000,
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
