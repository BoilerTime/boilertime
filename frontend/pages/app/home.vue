<template>
  <main>
    <NavBar />
    <Search />
  </main>
</template>
  
<script setup>
import { onMounted, onUnmounted } from "vue";

import { useUserStore } from "../../store/user"
const userStore = useUserStore();

if (!userStore.isLoggedIn) {
  navigateTo("/auth/login");
}

async function verifyToken() {
  await userStore.verifyToken(userStore.accessToken, userStore.user_id).then((res) => {
      //console.log(res.accessToken);
  });
}

let interval;
onMounted(() => {
  verifyToken();
});

onUnmounted(() => {
  clearInterval(interval);
});

</script>
