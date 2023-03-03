<!--create.vue is a page that users will see once they request to make
    a new schedule. There is an entry for classes and searching for the
    classes, and the user will be allowed to mark the class as required
    or optional.-->

<template>
  <!--Begin entire page-->

  <div class="h-screen p-8 overflow-scroll bg-gray-200">
    <!--Begin window-->
    <div
      class="grid grid-flow-row mx-auto my-64 w-4/5 bg-white rounded-lg shadow-lg p-8"
    >
      <!--Intro-->
      <h1 class="font-extrabold text-left text-2xl">
        Hi 👋 Let's help you get started with your new schedule!
      </h1>

      <h1 class="font-light text-left">
        To do so, search for your class in the bar below and mark it as required
        or optional and click done once you are finished.
      </h1>
      <h1 class="font-light text-left">
        If you want to come back to a certain class later, you can bookmark it
        as well and it will be saved for you in your profile page.
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
      <!--Do work here for US 7-->
      <div class="grid gap-4 grid-cols-2">
        <div>
          <input type="text" v-model="search" @input="fetch" placeholder="Enter class..."
          class="w-5/6 justify-self-center border-2 border-gray-300 bg-white h-10 px-5 mt-5 rounded-lg text-sm focus:outline-blue-500"
          >
          <ul class="bg-gray-200 mt-5 rounded-lg max-h-40 overflow-scroll py-5 px-5">
            <li v-for="result in results" :key="result" @click="select(result)">
              {{ result }}
            </li>
          </ul>
        </div>

        <div class="flex gap-4 mt-5 justify-self-center">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-h-10"
            @click="bookmark"
          >
            Bookmark
          </button>

          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded max-h-10"
            type="button"
            @click="add_class_required"
          >
            Required
          </button>

          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded max-h-10"
            type="button"
            @click="add_class_optional"
          >
            Optional
          </button>
        </div>
      </div>

      <br />
      <div class="flex justify-self-end gap-4 mt-5">
        <!--Submit and Cancel Button-->
        <button
          class="w-1/8 justify-self-end bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          <a href="/app/home"> Cancel </a>
        </button>
        <button
          class="w-1/8 justify-self-end bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          @click="submit"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<!-- Begin scripting section -->

<script setup>
import axios from "axios";
import { useUserStore } from "../../store/user";
import { ref } from "vue";
import { TransitionRoot } from "@headlessui/vue";

var userStore = useUserStore();
var class_input = ref("");
var required_classes = ref([]);
var optional_classes = ref([]);
var bookmarked_classes = ref([]);
var removedBookmark = ref(false);
var department = ref("")

//function to add a class to the required classes array
function add_class_required() {
  if (class_input !== "") {
    required_classes.value.push(class_input.value);
    class_input.value = "";
    search.value = "";
  }
}

//function to add a class to the optional classes array
function add_class_optional() {
  if (class_input !== "") {
    optional_classes.value.push(class_input.value);
    class_input.value = "";
    search.value = "";
  }
}

const search = ref('');
let results = [];

const fetch = async () => {
  try {
    search.value = (search.value).toUpperCase()
    await axios.post('http://localhost:3001/api/search', { dept: search.value }).then((res) => {
      department = search.value
      results = res.data.classes;
    }).catch(async () => {
      console.log("Dept : " + department)
      const response = await axios.post('http://localhost:3001/api/search', { dept: department })
      results = response.data.classes;
    })
    results = results.filter(word => word.substring(0, search.value.length) === search.value)
    results.length = Math.min(5, results.length)
  } catch (error) {
    console.log(error);
  }
}

const select = (result) => {
  search.value = result;
  results = [];
  class_input.value = result;
}

function bookmark() {
  axios
    .post("http://localhost:3001/api/getbookmarks", {
      user_id: userStore.user_id,
    })
    .then((res) => {
      bookmarked_classes.value = res.data.bookmarks;
      console.log(bookmarked_classes.value);
      if (bookmarked_classes.value.includes(class_input.value)) {
        axios.post("http://localhost:3001/api/removebookmark", {
          user_id: userStore.user_id,
          class_name: class_input.value,
        });
      }
      //}

      if (!bookmarked_classes.value.includes(class_input.value)) {
        axios.post("http://localhost:3001/api/addbookmark", {
          user_id: userStore.user_id,
          class_name: class_input.value,
        });
      }
      class_input.value = "";
      search.value = "";
    })
    .catch((err) => console.error(err));
}

//function to submit the schedule to backend
async function submit() {
  axios
    .post("http://localhost:3001/api/createschedule", {
      user_id: userStore.user_id,
      required_classes: required_classes.value,
      optional_classes: optional_classes.value,
    })
    .then((res) => {
      navigateTo("/app/loading");
    })
    .catch((err) => console.error(err));
}
</script>
