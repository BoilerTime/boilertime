<template>
  <div>
    <h1>Course Picker</h1>
    <h2>Required Classes</h2>
    <div v-for="(classObj, index) in requiredClasses" :key="index">
      <label>Class {{ index + 1 }}:</label>
      <input type="text" v-model="classObj.searchTerm" @input="handleSearch(index, true)">
      <ul>
        <li v-for="classItem in classObj.classes" :key="classItem.id">{{ classItem.name }}</li>
      </ul>
    </div>
    <h2>Optional Classes</h2>
    <div v-for="(classObj, index) in optionalClasses" :key="index">
      <label>Class {{ index + 1 }}:</label>
      <input type="text" v-model="classObj.searchTerm" @input="handleSearch(index, false)">
      <ul>
        <li v-for="classItem in classObj.classes" :key="classItem.id">{{ classItem.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const requiredClasses = ref(Array(5).fill({ searchTerm: '', classes: [] }))
const optionalClasses = ref(Array(5).fill({ searchTerm: '', classes: [] }))

const handleSearch = async (index, isRequired) => {
  const dept = isRequired ? 'required' : 'optional'
  const searchTerm = isRequired ? requiredClasses.value[index].searchTerm : optionalClasses.value[index].searchTerm
  const res = await fetch('https://api.boilerti.me/api/search', {
    method: 'POST',
    body: JSON.stringify({ dept, searchTerm }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const { classes } = await res.json()
  if (isRequired) {
    requiredClasses.value[index].classes = classes
  } else {
    optionalClasses.value[index].classes = classes
  }
}

onMounted(async () => {
  await Promise.all(
    requiredClasses.value.map((classObj, index) => handleSearch(index, true)),
    optionalClasses.value.map((classObj, index) => handleSearch(index, false))
  )
})
</script>