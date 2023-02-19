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
      <div>
        
      </div>
      
    </div>
  </body>
</template>

<!-- Begin scripting section -->

<script setup>
import { ref } from 'vue'
import { useUserStore } from "../../store/user"

const email = ref('')
const optonal_classes = ref([])
const personal_preferenes = ref([])
const required_classes = ref([])

</script>