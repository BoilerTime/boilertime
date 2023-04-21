<!--calendar.vue is a page for viewing the calendars of a specific group.-->
<template>
  <NavBar />
  <div class="h-screen p-16 bg-gray-200 overflow-auto dark:bg-neutral-500">
      <div v-if="group_size" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="mx-auto max-w-3xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row">
          <h1 class="mb-6 font-bold text-2xl text-center">
            You are the only member in {{ group_name }}.
          </h1>
          <center>
            <qrcode-vue :value="qr_value" :size="300" level="H" />
          </center>
          <!--Copy link Button-->
          <button type="copy" class="mt-6 w-1/8 bg-blue-500 hover:bg-blue-700 text-white font-bold border dark:border-black py-2 px-2 rounded-lg"
            @click="copyLink(group_id)">
            Copy Group Invite Link                                
          </button>
        </div>
    </div>
    <div v-else>
      <h1 class="text-6xl">Group: {{group_name}}</h1>
      <FullCalendar :options="calendarOptions" />
      <h1 class="text-4xl text-yellow-600">Group Members</h1>
      <li v-for="(name, index) in member_names">
        {{name}} ( {{colors[index]}} )
      </li>
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
var group_name = ref();
const route = useRoute();
const group = route.params.id;
var group_size = ref(false);
var qr_value = "https://boilerti.me/group/join/?group_id=" + group;

var result=ref([]);
let click = ''
const calendarOptions = ref({
plugins: [timeGridPlugin],
initialView: 'timeGridWeek',
slotMinTime: "7:00:00",
slotMaxTime: "21:00:00",
weekends: false,
height: "100vh",
aspectRatio: 10,
events: result.value, //the array that converts the output of the schedule
overlap: true
})

const colors = ref([ "red", "green", "black", "blue", "orange" ]);
var counter=0
/**
* This function is used to convert a JSON into a calendar.
*/
async function convertSchedule(schedule, blocks, memberID, index) {
console.log(schedule)
console.log(blocks)
console.log("INDEX = " + index)
for (const course of schedule) {
  console.log("IN Course" );
  console.log(course);
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
    console.log("ID = " + memberID);
    counter++;
    result.value.push({
      startTime: easternStartTime,
      endTime: easternEndTime,
      title: course.subject+" "+course.number,
      id: id+''+counter,
      color: colors.value[index],
      expandRows: true,
      daysOfWeek: daysOfWeek,
    });
    console.log(result.value);
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
      group_size.value = true;
  }
}

/**
* This function will get the calendars of all users in the group.
*/
async function getCalendars() {
var index = 0; 
for (var id in member_ids.value) {
  axios.post('https://api.boilerti.me/api/get/term/optimizedschedule', {
    term_id: "spring_2023",
    user_id: member_ids.value[id]
  }, config)
    .then((res) => {
      convertSchedule(res.data.schedule, res.data.blocked_times, member_ids.value[id], index++);
      //schedules.value.push(res.data, member_ids.value[id])
    })
    .catch(function (error) {
      console.error("error");
      alert("A member of your group does not have an optimized schedule.");
    })
}
}

/**
 * This function is used to copy the group invite link when pressing a button.
 */
 async function copyLink(group_id) {
    try {
        await navigator.clipboard.writeText("https://boilerti.me/group/join/?group_id=" + group_id);
        console.log("https://boilerti.me/group/join/?group_id=" + group_id)
        alert("Copied link");
    } catch(error) {
        alert("Cannot copy");
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