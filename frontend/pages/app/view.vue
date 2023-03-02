<template>
  <main>
    <NavBar />
    <div class="p-3 bg-gray-200 h-full flex items-stretch">
      <div class="p-12" v-if="isDataLoaded">
        <LazyClassList v-for="course in scheduleData" :key="course.name" :data="course" />
      </div>
      <div v-else class="p-12 h-screen bg-gray-200">
        <h1>Loading...</h1>
      </div>
      <div v-if="isDataLoaded">
        <LazyCalendar :data="scheduleData" />
      </div>
      <div v-else class="p-12 h-screen bg-gray-200">
        <h1>Loading...</h1>
      </div>
    </div>
  </main>
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
    nextTick(() => {
      setTimeout(() => {
        isDataLoaded.value = true;
      }, 1000);
    });
  } catch (error) {
    console.error(error);
  }
});
</script>
