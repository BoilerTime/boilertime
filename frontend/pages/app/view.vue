<template>
  <NavBar />
  <div v-if="isDataLoaded">
    <ClassDetails v-for="course in scheduleData" :key="course.name" :data="course" />
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const scheduleData = ref([]);
const isDataLoaded = ref(false);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/optimizedschedule');
    scheduleData.value = response.data.schedule;
    isDataLoaded.value = true;
  } catch (error) {
    console.error(error);
  }
});
</script>
