<template>
  <h1 class="text-3xl font-bold underline">
    View optimized final schedule here - list and calendar view - auth protected
  </h1>
</template>

<script setup>
import axios from 'axios'

const data = []

async function getOptimized() {
  await axios.get("http://localhost:3001/api/optimizedschedule")
    .then(function (res) {
      data = res.data.schedule
    })
    .catch(function (err) {
      alert("Failed to retrieve data. Please refresh page")
    })
}

onMounted(() => {
  getOptimized()
  console.log(data)
})

</script>  
