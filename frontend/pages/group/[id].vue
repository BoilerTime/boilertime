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
      //alert(error);
    })
    if (member_ids.value.length <= 1) {
        group_size = true;
    }
}

/**
 * This function will get the calendars of all users in the group.
 */
 async function getCalendars() {
  for (var id in member_ids) {
    axios.post('https://api.boilerti.me/api/groupschedules', {
      user_id: user_id,
      group_id: group,
      friend_id: member_ids[id]
    }, config)
      .then((res) => {
        schedules.push(res.data)
      })
      .catch(function (error) {
        console.error(error);
        //alert(error);
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
    console.log(schedules.value);
    console.log("member ids:", member_ids)
});
</script>