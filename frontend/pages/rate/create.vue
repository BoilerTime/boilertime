<!--This page is designed to allow users to create a rating of a classroom, TA, or class.
    For the star component, it uses code found from https://tailwind-elements.com/docs/standard/components/rating/-->
<template>
    <div class="h-screen bg-gradient-to-b from-gray-100 to-gray-300">
        <br />
        <div class="mx-auto my-10 max-w-sm p-3 bg-white border rounded-lg shadow sm:p-8 md:p-8 dark:bg-white">
            <form @submit.prevent="() => createreview()"></form>
            <div class="gap-8 columns-2">
                <!--Review type text-->
                <label for="reviewtype" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What would you like to review?</label>
                <!--Review Type dropdown-->
                <select id="reviewtype"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                        p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        v-model="reviewtype" required>
                    <option value="course">Course</option>
                    <option value="classroom">Classroom</option>
                    <option value="ta">TA</option>
                </select>

                

                <!--Review options Course text-->
                <label for="reviewselection" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What course would you like to review?</label>
                <!--Review options Course selection-->


                <!--Review options Classroom text-->
                <label for="reviewselection" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What classroom would you like to review?</label>
                <!--Review options Classroom selection-->


                <!--Review options TA text-->
                <label for="reviewselection" class="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-black">What TA would you like to review?</label>
                <!--Review options TA selection-->
                <input type="ta" id="ta" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:text-black dark:focus:ring-blue-500"
                    v-model="reviewselection" required>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const route = useRoute()
const user_id = route.query.user_id

const reviewtype = ref('')
const reviewselection = ref('')

const course = ref('')
const classroom = ref('')
const ta = ref('')

/**
 * This function will take the review type and review selection and send the inserted
 * information to the database.
 */
async function createreview() {
    if (reviewtype === course) {
        await axios.post('http://localhost:3001/api/add/ratings/classrooms', {
            user_id: user_id,
            course: course.value,
        })
    } else if (reviewtype === classroom) {
        await axios.post('http://localhost:3001/api/add/ratings/courses', {
            user_id: user_id,
            classroom: classroom.value,
        })
    } else if (reviewtype === ta) {
        await axios.post('http://localhost:3001/api/add/ratings/tas', {
            user_id: user_id,
            ta: ta.value,
        })
    }
}
</script>