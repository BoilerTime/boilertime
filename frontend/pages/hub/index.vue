<template>
  <main>
    <NavBar />
    <div class="flex flex-col items-center mt-12">
      <h1 class="text-2xl font-bold mb-6 text-center">Aggregated reviews for your <br>professor, classroom, course, and TA
      </h1>
      <div class="w-full max-w-lg flex justify-center">
        <div class="relative z-10">
          <input v-model="searchTerm"
            class="w-96 px-3 py-2 border border-gray-400 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            type="text" placeholder="Search" @keyup.enter="addSingleResultToSelected">
          <ul v-if="isSearchActive && filteredResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-scroll">
            <li v-for="result in filteredResults" :key="result"
              class="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white" @click="navigate(result, searchType)">
              <span>{{ result }}</span>
            </li>
          </ul>
        </div>
        <div class="relative">
          <select class="bg-white border border-gray-400 rounded-r-md h-full appearance-none px-3 py-2 pr-6"
            v-model="searchType">
            <option>Professor</option>
            <option>Classroom</option>
            <option>Course</option>
            <option>TA</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10 12a.997.997 0 0 1-.707-.293l-4-4a.999.999 0 1 1 1.414-1.414L10 9.586l3.293-3.293a.999.999 0 1 1 1.414 1.414l-4 4A.997.997 0 0 1 10 12z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="items-center mt-12 px-24" v-if="resultData && isDataLoaded">
      <h1 class="text-xl font-light mb-6 text-center">Results for {{ result }}</h1>
      <div class="flex flex-col max-w-lg mx-auto" v-if="resultType == 'Professor'">
        <div class="pr-8">
          <div class="flex justify-between mb-1">
            <span class="text-base font-medium text-blue-700">Department</span>
            <span class="text-base font-medium text-blue-700" v-if="resultData[1]">{{ resultData[1].department }}</span>
          </div>
          <div class="flex justify-between mb-4">
            <span class="text-base font-medium text-blue-700">Averaged from</span>
            <span class="text-base font-medium text-blue-700" v-if="resultData[1]">{{ resultData[1].numRatings }}
              ratings</span>
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-base font-medium text-blue-700">Average GPA</span>
            <span class="text-sm font-medium text-blue-700" v-if="resultData[0]">{{ resultData[0].overall_gpa }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3" v-if="resultData[0]">
            <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: resultData[0].percentage * 100 + '%' }"></div>
          </div>
          <div v-else>
            No data available
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-base font-medium text-blue-700">Average difficulty</span>
            <span class="text-sm font-medium text-blue-700" v-if="resultData[1]">{{ (resultData[1].avgDifficulty / 5.0 *
              100).toPrecision(4) + '%' }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3" v-if="resultData[0]">
            <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: resultData[1].avgDifficulty / 5.0 * 100 + '%' }">
            </div>
          </div>
          <div v-else>
            No data available
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-base font-medium text-blue-700">Average rating</span>
            <span class="text-sm font-medium text-blue-700" v-if="resultData[1]">{{ ((resultData[1].avgRating) / 5.0 * 100).toPrecision(4) +
              '%' }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3" v-if="resultData[0]">
            <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: resultData[1].avgRating / 5.0 * 100 + '%' }">
            </div>
          </div>
          <div v-else>
            No data available
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-base font-medium text-blue-700">Would take again</span>
            <span class="text-sm font-medium text-blue-700" v-if="resultData[1]">{{ (resultData[1].wouldTakeAgainPercent).toPrecision(4) +
              '%' }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700" v-if="resultData[0]">
            <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: resultData[1].wouldTakeAgainPercent + '%' }">
            </div>
          </div>
          <div v-else>
            No data available
          </div>
        </div>
        <div class="flex justify-between mb-1">
        </div>
      </div>
      <div class="flex flex-col items-center py-6 mb-12" v-if="resultType == 'Classroom'">
        <div class="w-full max-w-md">
          <h2 class="font-bold text-2xl mb-4">Ratings</h2>
          <div v-for="(group, index) in resultData" :key="index">
            <div v-for="(rating, ratingIndex) in group" :key="ratingIndex" class="bg-gray-300 rounded-lg shadow-xl p-4 mb-4">
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Timestamp:</span>
                <span class="text-gray-600">{{ rating.timestamp }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Convenience of access:</span>
                <span class="text-gray-600">{{ rating.rating[0] }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Quality of seating: </span>
                <span class="text-gray-600">{{ rating.rating[1] }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Availability of technology:</span>
                <span class="text-gray-600">{{ rating.rating[2] }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-bold mr-2 text-gray-700">Flagged:</span>
                <span class="text-gray-600">{{ rating.flag_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center py-6 mb-12" v-if="resultType == 'Course'">
        <div class="w-full max-w-md">
          <h2 class="font-bold text-2xl mb-4">Ratings</h2>
          <div v-for="(group, index) in resultData" :key="index">
            <div v-for="(rating, ratingIndex) in group" :key="ratingIndex" class="bg-gray-300 rounded-lg shadow-xl p-4 mb-4">
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Timestamp:</span>
                <span class="text-gray-600">{{ rating.timestamp }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Strictness of prerequisite requirements:</span>
                <span class="text-gray-600">{{ rating.rating[0] }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Pace of material covered:</span>
                <span class="text-gray-600">{{ rating.rating[1] }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Depth of material covered:</span>
                <span class="text-gray-600">{{ rating.rating[2] }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-bold mr-2 text-gray-700">Flagged:</span>
                <span class="text-gray-600">{{ rating.flag_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center py-6 mb-12" v-if="resultType === 'TA'">
        <div class="w-full max-w-md">
          <h2 class="font-bold text-2xl mb-4">Ratings</h2>
          <div v-for="(group, index) in resultData" :key="index">
            <div v-for="(rating, ratingIndex) in group" :key="ratingIndex" class="bg-gray-300 rounded-lg shadow-xl p-4 mb-4">
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Timestamp:</span>
                <span class="text-gray-600">{{ rating.timestamp }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Helpfulness of answering questions:</span>
                <span class="text-gray-600">{{ rating.rating[0] }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Responsiveness:</span>
                <span class="text-gray-600">{{ rating.rating[1] }}</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="font-bold mr-2 text-gray-700">Fairness of grading:</span>
                <span class="text-gray-600">{{ rating.rating[2] }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-bold mr-2 text-gray-700">Flagged:</span>
                <span class="text-gray-600">{{ rating.flag_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="items-center mt-12 px-24" v-else>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue';

const searchTerm = ref('')

const professors = ref([])
const classrooms = ref([])
const courses = ref([])
const tas = ref([])

var isSearchActive = ref(true)
var searchType = ref('Professor')

var result = ref('')
var resultType = ref('')
var resultData = ref([])

var isDataLoaded = ref(false)

async function fetch() {
  try {
    await axios.get('http://localhost:3001/api/professorsnew')
      .then(response => {
        professors.value = response.data
      })
    await axios.get('http://localhost:3001/api/classroomsnew')
      .then(response => {
        classrooms.value = response.data.classrooms
      })
    await axios.get('http://localhost:3001/api/searchnew')
      .then(response => {
        courses.value = response.data
      })
    await axios.get('http://localhost:3001/api/tasnew')
      .then(response => {
        tas.value = Object.keys(response.data)
      })
  } catch (error) {
    console.error(error)
  }
}

const filteredResults = computed(() => {
  resultData.value = []
  if (!searchTerm.value) {
    return []
  }
  if (searchType.value == 'Professor') {
    return professors.value.filter((item) => {
      return item.toLowerCase().includes(searchTerm.value.toLowerCase())
    })
  } else if (searchType.value == 'Classroom') {
    return classrooms.value.filter((item) => {
      return item.toLowerCase().includes(searchTerm.value.toLowerCase())
    })
  } else if (searchType.value == 'Course') {
    return courses.value.filter((item) => {
      return item.toLowerCase().includes(searchTerm.value.toLowerCase())
    })
  } else if (searchType.value == 'TA') {
    return tas.value.filter((item) => {
      return item.toLowerCase().startsWith(searchTerm.value.toLowerCase())
    })
  }
})

async function navigate(selected, type) {
  searchTerm.value = ''
  result.value = selected;
  resultType.value = type;
  if (type == 'Professor') {
    // getoverall_gpa
    // ratemyprofessor
    result.value = result.value.split(',');
    result.value = result.value[1].trim() + ' ' + result.value[0];
    axios.post('http://localhost:3001/api/getoverall_gpa', {
      prof_name: result.value
    })
      .then(response => {
        console.log(response.data.overall_gpa)
        try {
          var gpa = {
            'overall_gpa': response.data.overall_gpa,
            'percentage': response.data.overall_gpa / 4.0
          }
          resultData.value.push(gpa)
          isDataLoaded.value = true;
        } catch {
          resultData.value.push({ 'overall_gpa': 'N/A', 'percentage': 0 })
        }
      })
      .catch(error => {
        console.log(error)
        resultData.value.push({ 'overall_gpa': 'N/A', 'percentage': 0 })
      })
    axios.post('http://localhost:3001/api/ratemyprofessor', {
      prof_name: result.value
    })
      .then(response => {
        resultData.value.push(response.data)
        isDataLoaded.value = true;
      })
      .catch(error => {
        console.log(error)
        isDataLoaded.value = true;
      })
  }
  if (type == 'Classroom') {
    // clasroom_ratings/classrooms
    axios.post('http://localhost:3001/api/get/classroom_ratings/classrooms', {
      classroom: result.value.replace(/ /g, '')
    })
      .then(response => {
        console.log(response.data)
        var data = response.data
        resultData.value.push(data)
        isDataLoaded.value = true;
      })
  }
  if (type == 'Course') {
    // course_ratings/courses
    axios.post('http://localhost:3001/api/get/course_ratings/courses', {
      course_name: result.value.replace(/ /g, '')
    })
      .then(response => {
        console.log(response.data)
        resultData.value.push(response.data)
        isDataLoaded.value = true;
      })
  }
  if (type == 'TA') {
    // ta_ratings/tas
    axios.post('http://localhost:3001/api/get/ta_ratings/tas', {
      ta: result.value
    })
      .then(response => {
        var data = response.data
        resultData.value.push(response.data)
        isDataLoaded.value = true;
      })
  }
}

onBeforeMount(async () => {
  await fetch()
});
</script>
