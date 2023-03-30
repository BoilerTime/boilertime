<template>
  <main>
    <NavBar />
    <div class="flex flex-row">
      <div v-for="(schedule, index) in userSchedules" class="w-1/10 bg-green-200 p-60 h-1/4">
        {{schedule.term_id}}
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

if (!userStore.isLoggedIn) {
  navigateTo("/auth/login");
}

async function verifyToken() {
  await userStore.verifyToken(userStore.accessToken, userStore.user_id).then((res) => {
      //console.log(res.accessToken);
  });
}

const userSchedules = ref([])
var numSchedules;

onBeforeMount(async () => {
  await axios.post('http://localhost:3001/api/get/user_schedules', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    userSchedules.value = response.data
  })
  /*
  for (var i = 0; i < userSchedules.value.length; i++) {
    console.log(userSchedules.value[i] + " << Value");
  }
  */
  numSchedules = userSchedules.value[userSchedules.value.length - 1].num_schedules;
  console.log(numSchedules + " this is the num schedules");
  userSchedules.splice(userSchedules.value.length - 1, 1);
})

let interval;
onMounted(() => {
});

onUnmounted(() => {
  clearInterval(interval);
});

</script>
