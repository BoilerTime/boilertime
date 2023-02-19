<!--create.vue is a page that users will see once they request to make
    a new schedule. There is an entry for classes and searching for the
    classes, and the user will be allowed to mark the class as required
    or optional.-->

<template>
  <body class = "h-screen bg-gray-200">
    <div class = "mx-auto my-24 max-w-screen-xl bg-white border-
                 rounded-lg shadow-lg sm:p-8 md:p-8">

      <!--Intro-->
      <h1 class = "font-bold text-left text-2xl" >
        Hi! Let's help you get started with your new schedule.
      </h1>
      <h1 class = "font-bold text-leftr">
        To do so, search for your class in the bar below and mark it as required or optional.
        Please note that you are limited to 10 classes total.
      </h1>
      <br />

      <!--User interaction group-->
      <div class = "flex flex-row">
        <div class = "flex flex-col">
          <input type = "string" aria-describedby="class-search-bar" class="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-black dark:text-black dark:focus:ring-blue-500"
          placeholder="Search..." v-model="class_choice" required/>          
        </div>
        <div class = "flex flex-col">
          <button class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </div>
      </div>
    </div>

    <!--Information debugging-->

    <p> Search = {{ class_choice }}</p>
    <ul>
      <li v-for = "classes in optonal_classes" :key="classes">
        {{ classes }}
      </li>
    </ul>
    <ul>
      <li v-for = "classes in required_classes" :key="classes">
        {{ classes }}
      </li>
    </ul>

  </body>
</template>

<!-- Begin scripting section -->

<script setup>
import { ref } from 'vue'
import { useUserStore } from "../../store/user"

const email = ref('')
const class_choice = ref('')
const optonal_classes = ref([])
const personal_preferenes = ref([])
const required_classes = ref([])

</script>