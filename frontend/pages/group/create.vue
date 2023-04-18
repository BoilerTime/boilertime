<!--create.vue is used for creating groups, which includes naming it
    and forming the invite link.-->
<template>
  <NavBar />
  <div class="h-screen p-16 dark:bg-neutral-500 bg-gray-200">
    <!--Create Group-->
    <div
      class="mx-auto max-w-6xl p-8 bg-white dark:bg-neutral-700 border border-black rounded-lg shadow-lg grid grid-flow-row">
      <h1 class="font-bold text-2xl mb-5 text-center dark:text-gray-200">
        Create a Group
      </h1>
      <form @submit.prevent="() => creategroup()">
        <label for="name" class="pt-3 block mb-2 text-2x1 font-medium text-gray-900 dark:text-gray-200">
          Group Name
        </label>
        <input type="group_name" id="group_name"
          class="bg-gray-50 outline-none border border-black text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-neutral-500 dark:placeholder-white dark:text-gray-200"
          v-model="group_name" required /><br />
        <div class="grid grid-flow-col gap-4mb-5">
          <button type="submit" class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-lg">
            Create Group
          </button>
        </div>
      </form>
    </div>
    <div>
      <div v-if="isModalVisible"
        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row">
          <h1 class="font-bold text-2xl mb-5 text-center">
            Your group "{{ group_name }}" has been created!
          </h1>
          <h1 class="pt-3 block mb-2 text-2x1 font-medium text-gray-900 dark:text-black text-center">
            Here is your Invite Link. Send this to others to have them join your
            group.
          </h1>
          <center>
            <qrcode-vue :value="group_id" :size="300" level="H" />
          </center>
          <h2 class="pb-4 text-center text-2x1">{{ group_id }}</h2>
        </div>
      </div>
      <div v-if="isModalVisible" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../../store/user";
import QrcodeVue from "qrcode.vue";

var isModalVisible = ref(false);
var userStore = useUserStore();
var user_id = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
};
var group_name = ref("");
var group_id = "";

/**
 * A function that will take a user_id and group_name and create a group.
 * It returns the URL to join a group and opens a pop-up.
 */
async function creategroup() {
  await axios
    .post(
      "https://api.boilerti.me/api/creategroup",
      {
        user_id: user_id,
        group_name: group_name.value,
      },
      config
    )
    .then((res) => {
      group_id = "http://localhost:3000/group/join/?group_id=" + res.data.group_id;
      isModalVisible.value = true;
    })
    .catch(function (error) {
      console.error(error);
      alert(error);
    });
}
</script>