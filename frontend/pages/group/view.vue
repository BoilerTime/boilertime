<!--view.vue is a page for viewing the groups that a user is in.-->
<template>
    <NavBar />
    <div class="h-screen p-16 bg-gray-200">
        <!--Create Group-->
        <div class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row">
            <h1 class="font-bold text-2xl mb-5 text-center">Groups Page</h1>
            <!--Flex grouping for groups-->
            <div class="mt-5">
                <div class="bg-gray-300 rounded-lg max-w-full mb-5 mt-5 p-4">
                    <ul class="list-inside list-item">
                        <li class="mb-2 font-bold" v-for="(item, index) in groups" :key="index">
                            {{ item.group_name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios'
import { useUserStore } from "../../store/user";

var userStore = useUserStore();
var groups = ref([]);

async function getGroups() {
  axios.post('http://localhost:3001/api/groups', {
    user_id: userStore.user_id
  })
  .then((res) => {
    console.log(res.data.groups);
    groups.value.group_name = res.data.groups;
    isDataLoaded.value = true;
  })
  .catch(function (error) {
    console.error(error);
    alert(error);
  })
}

onMounted(async () => {
  await getGroups();
});
</script>