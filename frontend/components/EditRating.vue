<template>
  <TransitionRoot :show="isOpen">
    <Dialog as="div" @close="closeEdit">
      <TransitionChild
        enter="duration-100"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0" />
      </TransitionChild>

      <div class="fixed inset-0">
        <div class="flex min-h-full items-center justify-center text-center">
          <TransitionChild
            enter="duration-100"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-100"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogPanel class="text-left bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-lg">
              <DialogTitle class="text-lg font-medium leading-6 text-black dark:text-gray-200">
                Edit rating for {{ title }}
              </DialogTitle>
              <div class="mt-2">
                <form>
                  <label class="mb-1 dark:text-gray-200">First rating: {{ q1 }}</label><br>
                  <input type="text" class="bg-gray-200 border border-black dark:text-gray-200 dark:bg-neutral-500 hover:outline-none focus:outline-none p-1 rounded-lg" v-model="q1_edit"><br>
                  <label class="mt-1 mb-1 dark:text-gray-200">Second rating: {{ q2 }}</label><br>
                  <input type="text" class="bg-gray-200 border border-black dark:bg-neutral-500 dark:text-gray-200 hover:outline-none focus:outline-none p-1 rounded-lg" v-model="q2_edit"><br>
                  <label class="mb-1 dark:text-gray-200">Third rating: {{ q3 }}</label><br>
                  <input type="text" class="bg-gray-200 border border-black dark:bg-neutral-500 dark:text-gray-200 hover:outline-none focus:outline-none p-1 rounded-lg" v-model="q3_edit"><br>
                  <label class="mb-1 dark:text-gray-200">Current Review:</label><br>
                  <textarea type="text" rows="5" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-neutral-500 dark:text-gray-200 rounded-lg border border-black dark:placeholder-white focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Leave a review..." v-model="expl_edit"></textarea>
                </form>
              </div>

              <div class="mt-4 flex place-content-center">
                <button class="rounded-lg bg-yellow-500 hover:bg-yellow-700 px-4 py-2 text-sm font-bold border dark:border-black text-white" @click="submit">
                  Submit changes
                </button>
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
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import axios from 'axios'
import { useUserStore } from "../store/user";

var q1_edit = ref('')
var q2_edit = ref('')
var q3_edit = ref('')
var expl_edit = ref('')

var userStore = useUserStore();
var accessToken = userStore.accessToken;
const config = {
  headers: {
    'authorization': `Bearer ${accessToken}`
  }
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  closeEdit: {
    type: Function,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  q1: {
    type: String,
    required: true,
  },
  q2: {
    type: String,
    required: true,
  },
  q3: {
    type: String,
    required: true,
  },
  expl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})

async function submit() {

  if (props.type == "course") {
    const course = props.title;
    const user_id = props.id;
    const prequisiteStrictness = q1_edit.value;
    const pace = q2_edit.value;
    const depth = q3_edit.value;
    const explanation = expl_edit.value;
    const data = {
      user_id: user_id,
      course: course,
      prequisite_strictness: prequisiteStrictness,
      pace: pace,
      depth: depth,
      explanation: explanation,
    }
    if (q1_edit.value == "") {
      data.prequisite_strictness = props.q1
    }
    if (q2_edit.value == "") {
      data.pace = props.q2
    }
    if (q3_edit.value == "") {
      data.depth = props.q3
    }
    if (expl_edit.value == "") {
      data.explanation = props.expl
    }
    setTimeout(async () => {
      console.log(data)
      await axios.post("http://localhost:3001/api/edit/ratings/courses", data, config)
      .then((res) => {
        console.log(res.data)
        alert('Successfully edited rating')
        location.reload()
      })
      .catch((err) => {
        console.log(err)
      })
    }, 1000)
  }

  if (props.type == "classroom") {
    const user_id = props.id;
    const classroom = props.title;
    const access_conv = q1_edit.value;
    const seating_quality = q2_edit.value;
    const technology_avail = q3_edit.value;
    const explanation = expl_edit.value;
    const data = {
      user_id: user_id,
      classroom: classroom,
      access_conv: access_conv,
      seating_quality: seating_quality,
      technology_avail: technology_avail,
      explanation: explanation,
    }
    if (q1_edit.value == "") {
      data.access_conv = props.q1
    }
    if (q2_edit.value == "") {
      data.seating_quality = props.q2
    }
    if (q3_edit.value == "") {
      data.technology_avail = props.q3
    }
    if (expl_edit.value == "") {
      data.explanation = props.expl
    }
    setTimeout(async () => {
      console.log(data)
      await axios.post("http://localhost:3001/api/edit/ratings/classrooms", data, config)
      .then((res) => {
        console.log(res.data)
        alert('Successfully edited rating')
        location.reload()
      })
      .catch((err) => {
        console.log(err)
      })
    }, 1000)
    }

  if (props.type == "ta") {
    const user_id = props.id;
    const ta = props.title;
    const grading_fairness = q1_edit.value;
    const question_answering = q2_edit.value;
    const responsiveness = q3_edit.value;
    const explanation = expl_edit.value;
    const data = {
      user_id: user_id,
      ta: ta,
      grading_fairness: grading_fairness,
      question_answering: question_answering,
      responsiveness: responsiveness,
      explanation: explanation,
    }
    if (q1_edit.value == "") {
      data.grading_fairness = props.q1
    }
    if (q2_edit.value == "") {
      data.question_answering = props.q2
    }
    if (q3_edit.value == "") {
      data.responsiveness = props.q3
    }
    if (expl_edit.value == "") {
      data.explanation = props.expl
    }
    setTimeout(async () => {
      console.log(data)
      await axios.post("http://localhost:3001/api/edit/ratings/tas", data, config)
      .then((res) => {
        console.log(res.data)
        alert('Successfully edited rating')
        location.reload()
      })
      .catch((err) => {
        console.log(err)
      })
    }, 1000)
  }
}
</script>