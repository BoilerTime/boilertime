<template>
  <NavBar />
  <section class="flex p-24 bg-gray-200 dark:bg-neutral-600 h-screen justify-center align-center items-center">
    <div class="grid grid-cols-5 gap-x-20">
      <div class="col-span-2">
        <div class="text-4xl font-bold text-black dark:text-gray-200">
          Get started with
        </div>
        <div class="text-4xl font-bold text-yellow-500">
          building your schedule
        </div>
        <h2 class="text-lg font-semibold mt-8 mb-4 dark:text-gray-200">What is the difference between these two?</h2>
        <p class="text-md leading-relaxed dark:text-gray-200">Classes you have to take are your required classes for the semester.
          It's classes that are up next on your major's degree plan. We will prioritize this when generating your
          optimized
          schedule.
          <br /><br />
          Classes you want to take are your optional classes for the semester. It's classes that you are interested
          in for electives or just for fun. We will fit these classes in where we can in generating your optimized
          schedule.
        </p>
      </div>
      <div class="rounded-lg bg-white dark:bg-neutral-700 p-12 shadow-2xl col-span-3">
        <div class="relative">
          <label class="text-md font-semibold dark:text-gray-200">Add classes you have to take:</label>
          <input v-model="searchTerm"
            class="w-full px-4 py-2 mt-3 rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 border dark:border-black"
            placeholder="Search for classes..." @keyup.enter="addSingleResultToSelected">
          <ul v-if="isSearchActive && filteredResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-600 dark:text-gray-200 outline-black rounded-lg shadow-lg max-h-48 overflow-scroll">
            <li v-for="result in filteredResults" :key="result"
              class="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white" @click="addToSelected(result)">
              <span class="bg-yellow-500 flex items-center" v-if="bookmarked_classes.includes(result)">
                <BookmarkIcon class="w-4 mr-2" />
                <span>{{ result }}</span>
              </span>
              <span v-else>{{ result }}</span>
            </li>
          </ul>
          <draggable v-model="selectedRequiredCourses" group="classes" item-key="id" class="flex flex-wrap">
            <template #item="{ element, index }">
              <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 mt-3 hover:bg-red-500"
                @click="removeFromSelected(index)">
                {{ element }}
              </div>
            </template>
          </draggable>
          <div class="relative mt-8">
            <label class="text-md font-semibold dark:text-gray-200">Add classes you want to take:</label>
            <input v-model="optionalSearchTerm"
              class="w-full px-4 py-2 mt-3 rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-500 dark:placeholder-neutral-600 focus:ring-indigo-500 focus:border-indigo-500 border dark:border-black"
              placeholder="Search for classes..." @keyup.enter="addSingleOptionalToSelected">
            <ul v-if="isOptionalSearchActive && filteredOptionalResults.length > 0"
              class="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-600 dark:text-gray-200 outline-black rounded-lg shadow-lg max-h-48 overflow-scroll">
              <li v-for="result in filteredOptionalResults" :key="result"
                class="px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
                @click="addToSelectedOptional(result)">
                {{ result }}
              </li>
            </ul>
            <draggable v-model="selectedOptionalCourses" group="classes" item-key="id" class="flex flex-wrap">
              <template #item="{ element, index }">
                <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 mt-3 hover:bg-red-500"
                  @click="removeOptional(index)">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="relative mt-8">
            <label class="text-md font-semibold dark:text-gray-200">Drag classes here to bookmark them for later:</label>
            <draggable v-model="bookmarked_classes" group="classes" item-key="id"
              class="relative flex rounded-lg border-2 border-dashed border-gray-300 p-3 mt-3">
              <template #item="{ element, index }">
                <div class="text-sm font-bold border dark:border-black p-1.5 bg-indigo-500 text-white rounded-md mr-3 hover:bg-red-500"
                  @click="removeFromBookmarked(index)">
                  {{ element }}
                </div>
              </template>
            </draggable>
          </div>
          <div class="mt-4">
            <button @click="submit" class="bg-yellow-500 hover:bg-yellow-700 text-white p-2 text-md font-bold border dark:border-black rounded-md">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect, watch } from 'vue'
import axios from 'axios'
import { useUserStore } from "../../store/user";
import draggable from 'vuedraggable'

import { BookmarkIcon } from "@heroicons/vue/24/outline"

const data = ref([])
const optionalData = ref([])
const userStore = useUserStore()

var accessToken = userStore.accessToken;
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}

onBeforeMount(() => {
  axios.get('http://localhost:3001/api/searchnew', config).then((response) => {
    data.value = response.data
  })
  axios.get('http://localhost:3001/api/searchnew', config).then((response) => {
    optionalData.value = response.data
  })
  axios.post('http://localhost:3001/api/getclasses', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    selectedRequiredCourses.value = response.data.required_classes
  })
  axios.post('http://localhost:3001/api/getclasses', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    selectedOptionalCourses.value = response.data.optional_classes
  })
  axios.post('http://localhost:3001/api/getbookmarks', {
    user_id: userStore.user_id,
  }, config).then((response) => {
    bookmarked_classes.value = response.data.bookmarks
  })
  console.log(bookmarked_classes.value)
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
  if (selectedRequiredCourses.value.length < 5 && !selectedRequiredCourses.value.includes(item)
    && !selectedOptionalCourses.value.includes(item)) {
    selectedRequiredCourses.value.push(item)
    isSearchActive.value = false
    searchTerm.value = ''
  }
  if (selectedRequiredCourses.value.length > 5) {
    alert('You can only select 5 required courses')
    searchTerm.value = ''
  }
  if (selectedOptionalCourses.value.includes(item)) {
    alert('You cannot select the same course twice')
    searchTerm.value = ''
  }
}

function addSingleResultToSelected() {
  if (filteredResults.value.length >= 1) {
    addToSelected(filteredResults.value[0])
  }
}

function addSingleOptionalToSelected() {
  if (filteredOptionalResults.value.length >= 1) {
    addToSelectedOptional(filteredOptionalResults.value[0])
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
  if (selectedOptionalCourses.value.length < 5 && !selectedOptionalCourses.value.includes(item)
    && !selectedRequiredCourses.value.includes(item)) {
    selectedOptionalCourses.value.push(item)
    isOptionalSearchActive.value = false
    optionalSearchTerm.value = ''
  }
  if (selectedOptionalCourses.value.length > 5) {
    alert('You can only select 5 optional courses')
    optionalSearchTerm.value = ''
  }
  if (selectedRequiredCourses.value.includes(item)) {
    alert('You cannot select the same course twice')
    optionalSearchTerm.value = ''
  }
}

function removeFromSelected(index) {
  console.log(index)
  selectedRequiredCourses.value.splice(index, 1)
}

function removeOptional(index) {
  selectedOptionalCourses.value.splice(index, 1)
}

function removeFromBookmarked(index) {
  bookmarked_classes.value.splice(index, 1);
  axios.post('http://localhost:3001/api/removebookmark', {
    user_id: userStore.user_id,
    class_name: bookmarked_classes.value
  }, config).then(() => {
    console.log('Bookmark removed')
  })
}

const bookmarked_classes = ref([])
function addToBookmarked(item) {
  if (!this.bookmarked_classes.includes(item)) {
    this.bookmarked_classes.push(item);
  }
}

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

watch(bookmarked_classes, (newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    const newBookmark = newVal[newVal.length - 1]
    console.log(`New bookmark added: ${newBookmark}`)
    console.log(bookmarked_classes.value)
    axios.post('http://localhost:3001/api/addbookmark', {
      user_id: userStore.user_id,
      class_name: bookmarked_classes.value
    }, config).then(() => {
      console.log('Bookmark added')
    })
  }
  if (newVal.length < oldVal.length) {
    const removedBookmark = oldVal[oldVal.length - 1]
    console.log(`Bookmark removed: ${removedBookmark}`)
    console.log(bookmarked_classes.value)
    axios.post('http://localhost:3001/api/removebookmark', {
      user_id: userStore.user_id,
      class_name: bookmarked_classes.value
    }, config).then(() => {
      console.log('Bookmark removed')
    })
  }
})

function submit() {
  if (selectedRequiredCourses.value.length > 0) {
    axios.post('http://localhost:3001/api/createschedule', {
      user_id: userStore.user_id,
      required_classes: selectedRequiredCourses.value,
      optional_classes: selectedOptionalCourses.value
    }, config).then(() => {
      if (response.data["accessToken"] != undefined) {
        userStore.user = {
          accessToken: response.data["accessToken"],
          //refreshToken: response.data["refreshToken"],
          user_id: user_id
        }
        accessToken = userStore.accessToken;
        config.headers['authorization'] = `Bearer ${accessToken}`;
      }
      navigateTo('/app/view')
    })
  }
}
</script>

<style scoped>
.hover\:bg-red-500:hover {
  background-color: #EF4444;
}

.hover\:bg-red-500:hover::after {
  content: ' ✖';
}
</style>
