<!--join.vue is accessed when clicking on a group link. The page will
    prompt the user whether or not they would like to join a group.-->
<template>
  <div v-if="!isMobile">
    <NavBar />
  </div>
  <div v-else>
    <NavBarMobile />
  </div>
  <div class="h-screen p-16 bg-gray-200 dark:bg-neutral-700">
    <!--Join Group-->
    <div
      class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row"
    >
      <div v-if="group_exists">
        <h1 v-if="isDataLoaded" class="font-bold text-2xl mb-5 text-center">
          Would you like to join "{{ group_name }}"?
        </h1>
        <button
          type="submit"
          class="w-full bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-lg"
          @click="joingroup"
        >
          Join Group
        </button>
      </div>
      <div v-else>
        <h1 v-if="isDataLoaded" class="font-bold text-2xl mb-5 text-center">
          The group you are attempting to join does not exist.
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../../store/user";

const userStore = useUserStore();
var user_id = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
};
var isUserLoggedIn = userStore.isUserLoggedIn;
if (isUserLoggedIn == false) {
  alert(
    "You are not logged in. Please log in to join a group. Redirecting to the home page."
  );
}

var isDataLoaded = ref(false);
var route = useRoute();
var group_id = route.query.group_id;
var group_name = ref("");
var isMobile = ref(false);

async function checkWindowSize() {
  if (window.innerWidth <= 768) {
    isMobile.value = true;
  }
}

var group_exists = true;

/**
 * This function is used for making sure users meet the prerequisites of joining
 * a group, as well as adding the user to a group if they confirm.
 */
async function joingroup() {
  await axios
    .post(
      "https://api.boilerti.me/api/joingroup",
      {
        user_id: user_id,
        group_id: group_id,
      },
      config
    )
    .then(function () {
      alert("Group has been joined! Redirecting you to the home page.");
      navigateTo("/app");
    })
    .catch(function (error) {
      console.error(error);
      if (error.response.status == 409) {
        alert(
          "You are already in this group. Redirecting you to the home page."
        );
        navigateTo("/app");
      } else if (error.response.status == 403) {
        alert(
          "This group has reached the maximum number of members. Redirecting you to the home page."
        );
        navigateTo("/app");
      } else {
        alert(error);
      }
    });
}

/**
 * This function is used for getting the name of the group associated with the
 * invite link.
 */
async function getname() {
  await axios
    .post("https://api.boilerti.me/api/group", {
      group_id: group_id,
    })
    .then((res) => {
      group_name.value = res.data.group_name;
      if (group_name.value == undefined) {
        group_exists = false;
        alert("The group you are trying to join does not exist.");
      }
      isDataLoaded.value = true;
    })
    .catch(function (error) {
      console.error(error);
      alert(error);
    });
}

/**
 * This function will get the group name as soon as the page is loaded.
 */
onMounted(async () => {
  await getname();
  await checkWindowSize();
});
</script>
