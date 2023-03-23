<template>
  <div class="grid grid-cols-2 gap-8">
    <div class="relative">
      <input
        v-model="searchTerm"
        class="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search..."
      >
      <ul v-if="isSearchActive && filteredResults.length > 0" class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
        <li
          v-for="result in filteredResults"
          :key="result"
          class="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
          @click="addToSelected(result)"
        >
          {{ result }}
        </li>
      </ul>
      <div>
        <h2>Required Courses (Choose up to 5)</h2>
        <ul>
          <li v-for="item in selectedRequiredCourses" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
    <div class="relative">
      <input
        v-model="optionalSearchTerm"
        class="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search for Optional Courses..."
      >
      <ul v-if="isOptionalSearchActive && filteredOptionalResults.length > 0" class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
        <li
          v-for="result in filteredOptionalResults"
          :key="result"
          class="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
          @click="addToSelectedOptional(result)"
        >
          {{ result }}
        </li>
      </ul>
      <div>
        <h2>Optional Courses (Choose up to 5)</h2>
        <ul>
          <li v-for="item in selectedOptionalCourses" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import axios from 'axios'

const data = ref([])
const optionalData = ref([])

onBeforeMount(() => {
  axios.get('http://localhost:3001/api/searchnew').then((response) => {
    data.value = response.data
  })
  axios.get('http://localhost:3001/api/searchnew').then((response) => {
    optionalData.value = response.data
  })
})

const searchTerm = ref('')
const filteredResults = computed(() => {
  if (!searchTerm.value) {
    return []
  }

  return data.value.filter((item) => {
    return item.toLowerCase().startsWith(searchTerm.value.toLowerCase())
  })
})

const selectedRequiredCourses = ref([])
const isSearchActive = ref(false)

function addToSelected(item) {
  if (selectedRequiredCourses.value.length < 5 && !selectedRequiredCourses.value.includes(item)) {
    selectedRequiredCourses.value.push(item)
    isSearchActive.value = false
  }
}

const optionalSearchTerm = ref('')
const filteredOptionalResults = computed(() => {
  if (!optionalSearchTerm.value) {
    return []
  }

  return optionalData.value.filter((item) => {
    return item.toLowerCase().includes(optionalSearchTerm.value.toLowerCase())
  })
})

const selectedOptionalCourses = ref([])
const isOptionalSearchActive = ref(false)

function addToSelectedOptional(item) {
  if (selectedOptionalCourses.value.length < 5 && !selectedOptionalCourses.value.includes(item)) {
    selectedOptionalCourses.value.push(item)
    isOptionalSearchActive.value = false
  }
}

watchEffect(() => {
  console.log(filteredResults.value)
  console.log(filteredOptionalResults.value)
  console.log(selectedRequiredCourses.value)
  console.log(selectedOptionalCourses.value)
})

watchEffect(() => {
  if (searchTerm.value.length > 0) {
    isSearchActive.value = true
  } else {
    isSearchActive.value = false
  }
})

watchEffect(() => {
  if (optionalSearchTerm.value.length > 0) {
    isOptionalSearchActive.value = true
  } else {
    isOptionalSearchActive.value = false
  }
})
</script>

<style scoped>
  ul li:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
</style>