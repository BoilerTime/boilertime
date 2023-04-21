<!--calendar.vue is a page for viewing the calendars of a specific group.-->
<template>
    <NavBar />
    <div class="h-screen p-16 bg-gray-200 overflow-auto dark:bg-neutral-500">
        <div v-if="group_size" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row">
                <h1 class="font-bold text-2xl mb-5 text-center">
                    You are the only member in {{ group_name }}. Invite your friends to see your schedules.
                </h1>
                <center>
                    <qrcode-vue :value="qr_value" :size="300" level="H" />
                </center>
                <h2 class="mt-4 pb-4 text-center text-2x1">https://boilerti.me/group/join/?group_id={{ group }}</h2>
            </div>
        </div>
        <div v-else class="bg-neutral-100 dark:bg-neutral-400 rounded-lg max-w-1/2 mb-5 p-4 content-center text-center">
            <h1 class="font-bold text-2xl mb-3">Group: {{ group_name }}</h1>
            <ul class="list-inside list-item mb-6 items-center text-center">
                <li v-for="(item, index) in schedules" :key="index">
                    <div class="font-bold text-lg">{{ member_names[index] }}'s schedule</div>
                    <!--Check to see if user has a schedule-->
                    <div v-if="item.value=='empty'">This user has not created a schedule yet.</div>
                    <!--Present calendar-->
                    <div id="calendar" v-if="result.length > 0">
                        <FullCalendar :options="calendarOptions" />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
  
  
<script setup>
import { ref } from "vue";
import axios from 'axios'
import { useUserStore } from "../../store/user";
import QrcodeVue from "qrcode.vue";
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';

var userStore = useUserStore();
var user_id = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
    headers: {
        'authorization': `Bearer ${accessToken}`
    }
}
var member_names = ref([]);
var member_ids = ref([]);
var schedules = ref([]);
var group_name = ref();
const route = useRoute();
const group = route.params.id;
var group_size = ref(false);
var qr_value = "https://boilerti.me/group/join/?group_id=" + group;

let result=[];
let click = ''
const calendarOptions = ref({
  plugins: [timeGridPlugin],
  initialView: 'timeGridWeek',
  slotMinTime: "7:00:00",
  slotMaxTime: "21:00:00",
  weekends: false,
  height: "100vh",
  aspectRatio: 10,
  events: result, //the array that converts the output of the schedule
  eventClick: function(info) {
    // console.log(info.event.extendedProps.data)
    console.log(info.event.id)
    if(info.event.id != "block") {
      click = "#" + info.event.id
      // simulate a click of the modal button
      document.querySelector(click).click()
    }
  }
})

/**
 * This function is used to convert a JSON into a calendar.
 */
async function convertSchedule(schedule, blocks) {
  console.log(schedule)
  console.log(blocks)
  for (const course of schedule) {
    for (const meeting of course.meetings) {
      console.log(meeting.startTime)
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

/**
 * This function is used to get the information of groups a user is in.
 */
 async function getGroup() {
  await axios.post('https://api.boilerti.me/api/group', {
    user_id: user_id,
    group_id: group
  }, config)
    .then((res) => {
      member_names.value = res.data.member_names;
      member_ids.value = res.data.member_ids;
      group_name.value = res.data.group_name;
    })
    .catch(function (error) {
      console.error(error);
      alert(error);
    })
    if (member_ids.value.length <= 1) {
        group_size = true;
    }
}

/**
 * This function will get the calendars of all users in the group.
 */
 async function getCalendars() {
  for (var id in member_ids.value) {
    axios.post('https://api.boilerti.me/api/get/term/optimizedschedule', {
      term_id: "spring_2023",
      user_id: member_ids.value[id]
    }, config)
      .then((res) => {
        schedules.value.push(res.data)
      })
      .catch(function (error) {
        schedules.value.push("empty");
        console.error("error");
        alert("A member of your group does not have an optimized schedule.");
      })
  }
}

/**
 * This function loads the groups a user is when the page loads.
 */
onMounted(async () => {
    await getGroup().then(() => {
        getCalendars();
        //convert schedule here
        for (let i = 0; i < schedules.length; i++) {
          console.log(schedules[i].schedule);
          console.log(schedules[i].blocked_times);
          convertSchedule(schedules[i].schedule, schedules[i].blocked_times);
          console.log(result[i]);
        }
    });
});
</script>

<style scoped>
  #calendar {
    padding-top: 3rem;
    padding-bottom: 4rem;
    width: 72.5vw;
    display: inline-block;
  }
</style>