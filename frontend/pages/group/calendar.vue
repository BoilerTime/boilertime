<!--calendar.vue is a page for viewing the calendars of a specific group.-->
<template>
  <NavBar />
  <div class="h-screen p-16 bg-gray-200 overflow-auto dark:bg-neutral-500">
    <div v-if="group_size===1" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row">
        <h1 class="font-bold text-2xl mb-5 text-center">
          You are the only member in {{ group_name }}. Invite your friends to see your schedules.
        </h1>
        <center>
          <qrcode-vue :value="group" :size="300" level="H" />
        </center>
        <h2 class="mt-4 pb-4 text-center text-2x1">http:localhost:3001/group/join/?group_id={{ group }}</h2>
      </div>
    </div>
    <div v-else class="bg-neutral-100 dark:bg-neutral-400 rounded-lg max-w-1/2 mb-5 p-4 content-center text-center">
      <h1 class="font-bold text-2xl mb-3">Group: {{ group_name }}</h1>
      <ul class="list-inside list-item mb-6 items-center text-center">
        <li class="font-bold text-lg" v-for="(item, index) in member_names" :key="index">{{ item }}'s schedule</li>
        <li v-for="(item, index) in schedules" :key="index">
          {{ convertSchedule(item) }}
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from 'axios'
import { useUserStore } from "../../store/user";
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import QrcodeVue from "qrcode.vue";

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
const group = route.query.group_id;
var group_size = 0;

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
    group_size = member_ids.value.length;
}

async function getCalendars() {
  for (var id in member_ids) {
    axios.post('https://api.boilerti.me/api/groupschedules', {
      user_id: user_id,
      group_id: group,
      friend_id: member_ids[group_id]
    }, config)
      .then((res) => {
        schedules.push(res.data)
      })
      .catch(function (error) {
        console.error(error);
        alert(error);
      })
  }
}
/**
 * This function loads the groups a user is when the page loads.
 */
onMounted(async () => {
  await getGroup().then(() => {
    getCalendars();
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