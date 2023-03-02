<template>
  <TransitionRoot :show="open">
    <Dialog class="z-50" @close="$emit('update:open', false)">
      <TransitionChild 
        enter="duration-500"
        leave="duration-700"
        enter-from="opacity-0"
        leave-from="opacity-100"
        enter-to="opacity-100"
        leave-to="opacity-0"
        class="bg-black fixed inset-0 bg-opacity-75"
      />
      <div class="fixed absolute inset-0 right-0 max-w-full">
          <div class="fixed right-0 max-w-full">
            <TransitionChild 
              enter="duration-500"
              leave="duration-700"
              enter-from="translate-x-full"
              leave-from="translate-x-0"
              enter-to="translate-x-0"
              leave-to="translate-x-full"
             >
              <DialogPanel class="bg-white h-screen w-screen max-w-xl flex-col overflow-y-scroll pb-12">
                <div class="bg-yellow-500 p-6 mb-4">
                  <span class="text-3xl font-semibold text-white">{{ data.subject }} {{ data.number }}</span>
                  <p class="text-xl text-white mt-1">{{ data.name }}</p>
                </div>
                <div v-for="(meeting, index) in data.meetings" :key="index" class="relative">
                  <div class="relative px-6 pt-4">
                    <h1 class="text-2xl font-bold">{{ meeting.type }}</h1>
                    <h1 class="text-lg font-bold mb-4">{{ meeting.instructorName }}</h1>
                  </div>
                  <iframe
                    width="600"
                    height="250"
                    style="border:0"
                    loading="lazy"
                    scrolling="no"
                    gestureHandling="none"
                    referrerpolicy="no-referrer-when-downgrade"
                    :src="'https://www.google.com/maps/embed/v1/place?key=AIzaSyDZSvQc9nGqbNtJ66CTu1IGrBl-9RHllIU&q=' + meeting.buildingName + 'Purdue+University,West+Lafayette+IN'">
                  </iframe>
                  <div class="relative px-6 pt-4 pb-6">
                      <div>
                        <h1 class="text-lg font-bold">Avg GPA</h1>
                        <h1 v-if="stats[index] != undefined" class="text-lg mb-4">{{ stats[index] }}</h1>
                        <h1 v-else class="text-lg mb-4">No data</h1>
                      </div>
                      <div>
                        <h1 class="text-lg font-bold">Rate My Professors</h1>
                        <h1 class="text-md">Average rating</h1>
                        <h1 v-if="rmp_rating[index] != undefined" class="text-lg mb-4">{{ rmp_rating[index] }} out of 5</h1>
                        <h1 v-else class="text-lg mb-4">No data</h1>
                        <h1 class="text-md">Average difficulty</h1>
                        <h1 v-if="rmp_difficulty[index] != undefined" class="text-lg mb-4">{{ rmp_difficulty[index] }} out of 5</h1>
                        <h1 v-else class="text-lg mb-4">No data</h1>
                        <h1 class="text-md">Would take again</h1>
                        <h1 v-if="rmp_again[index] != undefined" class="text-lg">{{ rmp_again[index] }}%</h1>
                        <h1 v-else class="text-lg">No data</h1>
                      </div>
                  </div>
                </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

import axios from 'axios';

const props = defineProps({
  header: {
    type: String,
    require: true
  },
  data: {
    type: Object,
    require: true
  },
  open: {
    type: Boolean,
    require: true
  }
})

let stats = []

let rmp_rating = []
let rmp_difficulty = []
let rmp_again = []

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
  rmp_rating.push(response.data.avgRating)
  rmp_difficulty.push(response.data.avgDifficulty)
  rmp_again.push(response.data.wouldTakeAgainPercent)
}

onMounted(() => {
  // props.data is accessible here
  for (let i = 0; i < props.data.meetings.length; i++) {
    getgpa(props.data.meetings[i].instructorName, props.data.subject+props.data.number)
    getrmp(props.data.meetings[i].instructorName)
  }
  nextTick(() => {
  //  document.getElementById('gpa').click()
  })
  
})

</script>