<template>
  <div>
    <h1 class="text-3xl font-bold underline">
      Welcome, {{ userStore.firstname }}
    </h1>
  </div>
</template>
  
<script setup>
import { useUserStore } from "../../store/user"
const userStore = useUserStore();

if (!userStore.isLoggedIn) {
  navigateTo("/auth/login");
}

</script>