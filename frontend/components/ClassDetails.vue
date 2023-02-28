<template>
  <main>
    <div class="mb-2">
      <h1 class="text-2xl font-bold"><span>{{ data.subject }}&nbsp;</span>{{ data.number }}</h1>
      <h1 class="font-bold">{{ data.name }}</h1>
      <ul v-for="meeting in data.meetings">
        <li>{{ meeting.instructorName }}</li>
        <li>{{ meeting.type }}</li>
      </ul>
    </div>
  </main>
</template>

<script setup>
  const props = defineProps({
    data: {
      type: Object,
      require: true
    }
  })

</script>