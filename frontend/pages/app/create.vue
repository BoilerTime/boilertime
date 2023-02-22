<!--create.vue is a page that users will see once they request to make
    a new schedule. There is an entry for classes and searching for the
    classes, and the user will be allowed to mark the class as required
    or optional.-->

<template>
  <!--Begin entire page-->
  <body class="h-screen bg-gray-200">
    <!--Begin window-->
    <div
      class="grid grid-flow-row mx-auto my-24 w-4/5 bg-white rounded-lg shadow-lg p-8"
    >
      <!--Intro-->
      <h1 class="font-extrabold text-left text-2xl">
        Hi 👋 Let's help you get started with your new schedule!
      </h1>

      <h1 class="font-light text-left">
        To do so, search for your class in the bar below and mark it as required
        or optional.
      </h1>
      <br />

      <!--List display-->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h1 class="font-extrabold text-left text-2xl">Required Classes</h1>
          <div class="mx-auto my-auto w-auto bg-gray-200 rounded-lg p-4">
            <ol class="list-decimal list-inside">
              <!-- Loop through the array and display each item as a list item -->
              <li
                class="mb-2 font-bold"
                v-for="(item, index) in required_classes"
                :key="index"
              >
                {{ item }}
              </li>
            </ol>
          </div>
        </div>

        <div>
          <h1 class="font-extrabold text-left text-2xl">Optional Classes</h1>
          <div class="mx-auto my-auto w-auto bg-gray-200 rounded-lg p-4">
            <ol class="list-decimal list-inside">
              <!-- Loop through the array and display each item as a list item -->
              <li
                class="mb-2 font-bold"
                v-for="(item, index) in optional_classes"
                :key="index"
              >
                {{ item }}
              </li>
            </ol>
          </div>
        </div>
      </div>

      <br />

      <!--User interaction group-->
      <div class="grid gap-4 grid-cols-2">
        <input
          class="w-5/6 justify-self-center border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
          type="text"
          v-model="class_input"
          placeholder="Enter class..."
        />

        <div class="flex gap-4 justify-self-center">
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            @click="add_class_required"
          >
            Required
          </button>

          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            @click="add_class_optional"
          >
            Optional
          </button>
        </div>
      </div>

      <br />
      <!--Submit Button-->
      <button
        class="w-1/8 justify-self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="button"
        @click="submit"
      >
        Done
      </button>
    </div>
  </body>
</template>

<!-- Begin scripting section -->

<script>
import axios from "axios";

export default {
  class_input: "",

  data() {
    return {
      user_id: "",
      optional_classes: [],
      personal_preferences: [],
      required_classes: [],
    };
  },

  methods: {
    return_data() {
      return {
        user_id: "dummy_user_id",
        optional_classes: this.optional_classes,
        personal_preferences: [],
        required_classes: this.required_classes,
      };
    },

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
      axios
        .post("http://  localhost:3001/api/createschedule", this.return_data())
        .then((res) => {
          console.log(res);
          navigateTo("/app/loading");
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
