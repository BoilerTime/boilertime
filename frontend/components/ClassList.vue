<template>
  <main>
    <div class="mb-6 bg-gray-400 p-6 rounded-lg" v-if="isDataLoaded" @click="open = true">
      <h1 class="text-2xl font-bold"><span>{{ data.subject }}&nbsp;</span>{{ data.number }}</h1>
      <h1 class="font-bold">{{ data.name }}</h1>
      <ul class="mt-3 mb-3">
        <li class="mb-3">{{ data.meetings[0].instructorName }}</li>
        <li class="font-bold">Avg Class GPA</li>
        <li v-if="stats[0] != undefined">{{ stats[0] }}</li>
        <li v-else>No data</li>
        <li class="font-bold mt-2">Professor's Rating</li>
        <li v-if="rmp[0] != undefined">{{ rmp[0] }} out of 5</li>
        <li v-else>a</li>
      </ul>
      <a class="mt-6 font-bold"><button @click="open = true">View class details →</button></a>
      <ClassDetails :open="open" :header="[data.subject, data.number].join('')" :data="data" @update:open="open = $event" />
    </div>
    <div class="mb-6" v-else>
      Retrieving data...
    </div>
  </main>
</template>
  
<script setup>
  import { ref } from 'vue'
  import axios from 'axios';

  let stats = []
  let rmp = []
  const isDataLoaded = ref(false);
  
  const props = defineProps({
    data: {
      type: Object,
      require: true
    }
  })

  async function getgpa(prof_name, class_name) {
    const response = await axios.post('http://localhost:3001/api/getgpa', {
      "prof_name": prof_name,
      "class_name": class_name
    })
    stats.push(response.data.averageGPA)
  }

  async function getrmp(prof_name) {
    const response = await axios.post('http://localhost:3001/api/ratemyprofessor', {
      "prof_name": prof_name
    })
    rmp.push(response.data.avgRating)
  }
  
  const open = ref(false)
  const handleSlideoverClose = () => {
    open.value = false
  }

  onMounted(() => {
    // props.data is accessible here
    for (let i = 0; i < 1; i++) {
      getgpa(props.data.meetings[i].instructorName, props.data.subject+props.data.number)
      getrmp(props.data.meetings[i].instructorName)
    }
    nextTick(() => {
      setTimeout(() => {
        isDataLoaded.value = true;
      }, 1000);
    });
  })
</script>
  