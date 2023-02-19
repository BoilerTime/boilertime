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
          <label class = "font-bold text-left text-2xl" for = "class">
            Class:
          </label>
          <input class = "border-2 border-gray-300 bg-white h-10 px-5
                          rounded-lg text-sm focus:outline-none"
                 type = "text" id = "class" v-model = "class_choice" />
        </div>
        <div class = "flex flex-col">
          <label class = "font-bold text-left text-2xl" for = "class">
            Required or Optional:
          </label>
          <select class = "border-2 border-gray-300 bg-white h-10 px-5
                           rounded-lg text-sm focus:outline-none"
                  id = "class" v-model = "personal_preferenes">
            <option value = "required">Required</option>
            <option value = "optional">Optional</option>
          </select>
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