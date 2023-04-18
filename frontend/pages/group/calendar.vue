<!--calendar.vue is a page for viewing the calendars of a specific group.-->
<template>
  <NavBar />
  <div class="h-screen p-16 bg-gray-200 overflow-auto dark:bg-neutral-500">

  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from 'axios'
import { useUserStore } from "../../store/user";
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
var owner = false;
const route = useRoute()
const group = route.query.id

/**
 * This function is used to get the information of groups a user is in.
 */
async function getGroup() {
  await axios.post('http://localhost:3001/api/group', {
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
}

async function getCalendars() {
  for (var id in member_ids) {
    axios.post('http://localhost:3001/api/groupschedules', {
      user_id: user_id,
      group_id: group,
      friend_id: member_ids[id]
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
  await getGroups().then(() => {
    getCalendars();
  });
});
</script>