<template>
  <div class="h-screen p-16 bg-gray-200">
    <div
      class="mx-auto max-w-lg p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row"
    >
      <div class="flex flex-auto gap-4">
        <div
          class="rounded-full h-24 w-24 text-white bg-yellow-500 flex items-center justify-center text-4xl font-extrabold"
        >
          <h1>{{ firstname[0] }}{{ lastname[0] }}</h1>
        </div>
        <div class="place-self-center">
          <h1 class="font-extrabold text-2xl">{{ firstname }} {{ lastname }}</h1>
          <h1 class="font-light text-lg">{{ gradMonth }} {{ gradYear }}</h1>
        </div>
      </div>
      <div class="grid grid-flow-col gap-2 justify-end">
        <button 
          type="button"
          class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded"
          @click="edit"
          >
            Edit
        </button>
        <button
          type="button"
          class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded"
          @click="done"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios';
import { useUserStore } from "../../store/user"

const userStore = useUserStore();
const userID = ref('')
const firstname = ref('John')
const lastname = ref('Doe')
const gradMonth = ref('May')
const gradYear = ref('2022')
const isGradStudent = ref(false)

</script>
