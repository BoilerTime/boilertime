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
      
      <h1 class = "font-bold text-left">
        To do so, search for your class in the bar below and mark it as required or optional.
        Please note that you are limited to 10 classes total.
      </h1>
      <br/>

      <!--User interaction group, fix positioning on the screen, fill lists as boxes-->
      <div>

        <input class = "border-2 border-gray-300 bg-white h-10 px-5
                        rounded-lg text-sm focus:outline-none"
               type = "text" v-model = "class_input" placeholder = "Enter class...">

        <button class = "bg-blue-500 hover:bg-blue-700 text-white
                         font-bold py-2 px-4 rounded"
                type = "button" @click = "addClassRequired">
          Required
        </button>

        <button class = "bg-blue-500 hover:bg-blue-700 text-white
                         font-bold py-2 px-4 rounded"
                type = "button" @click = "addClassOptional">
          Optional
        </button>

        <button class = "bg-blue-500 hover:bg-blue-700 text-white
                         font-bold py-2 px-4 rounded"
                type = "button" @click = "submit">
          Done
        </button>

        <ul class="list-disc list-inside">
          <!-- Loop through the array and display each item as a list item -->
          <li class="mb-2 text-red-400" v-for="(item, index) in optional_classes" :key="index">{{ item }}</li>
        </ul>

        <ul class="list-disc list-inside">
          <!-- Loop through the array and display each item as a list item -->
          <li class="mb-2 text-cyan-400" v-for="(item, index) in required_classes" :key="index">{{ item }}</li>
        </ul>

      </div>
    </div>
  </body>
</template>

<!-- Begin scripting section -->

<script>

//import{ add_classes } from "../backend/components/schedule/schedule.js"
//const add_class = add_classes()

import { useUserStore } from "../../store/user"
const userStore = useUserStore()

export default {

  data() {

    return {
      user_id: "",
      optional_classes: [],
      personal_preferences: [],
      required_classes: [],
      class_input: "",
    };

  },

  methods: {

    add_class_required() {
      if (this.class_input !== "") {
        this.required_classes.push(this.class_input);
        this.class_input = "";
      }
    },

    add_class_optional() {
      if (this.class_input !== "") {
        this.optional_classes.push(this.class_input);
        this.class_input = "";
      }
    },

    submit() {
      
    },

  },
};

</script>