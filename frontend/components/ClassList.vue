<template>
  <main>
    <div class="mb-6">
      <h1 class="text-2xl font-bold"><span>{{ data.subject }}&nbsp;</span>{{ data.number }}</h1>
      <h1 class="font-bold">{{ data.name }}</h1>
      <span class="mt-3 font-bold"><button @click="open = true">View class details →</button></span>
      <ClassDetails :open="open" :header="[data.subject, data.number].join('')" :data="data" @update:open="open = $event" />
      <ul class="mt-3" v-for="meeting in data.meetings">
        <li>{{ meeting.instructorName }}</li>
        <li>{{ meeting.type }}</li>
      </ul>
    </div>
  </main>
</template>
  
<script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    data: {
      type: Object,
      require: true
    }
  })
  
  const open = ref(false)
  const handleSlideoverClose = () => {
    open.value = false
  }
</script>
  