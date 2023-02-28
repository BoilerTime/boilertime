<template>
  <ClassDetails prof="Jeffrey A. Turkstra" class="CS 30700"/>
</template>

<script setup>
import axios from 'axios'

let data = []

async function getOptimized() {
  await axios.get("http://localhost:3001/api/optimizedschedule")
    .then(function (res) {
      data = res.data.schedule
      console.log(data)
    })
    .catch(function (err) {
      console.log(err)
      alert("Failed to retrieve data. Please refresh page")
    })
}

onMounted(() => {
  getOptimized()
})

</script>  
