<!--view.vue is a page for viewing the groups that a user is in.-->
<template>
    <NavBar />
    <div class="h-screen p-16 bg-gray-200 overflow-auto dark:bg-neutral-500">
        <!--Groups Page-->
        <div class="mx-auto max-w-6xl p-8 bg-white dark:bg-neutral-700 border border-black rounded-lg shadow-lg grid grid-flow-row">
            <h1 class="font-bold text-2xl mb-5 text-center dark:text-gray-200">Groups Page</h1>
            <!--Flex grouping for groups-->
            <div class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 mt-5 p-4">
                <ul class="list-inside list-item">
                    <li class="divide-y divide-solid divide-black">
                        <li v-for="(item, index) in groups" :key="index">
                        <li class="mb-2 font-bold">Group Name:</li>
                        <li class="mb-2 font-light">{{ item.group_name }}</li>
                        <li class="mb-2 font-bold">Group Members:</li>
                        <li class="font-light mb-2" v-for="(item, index) in groups[index].member_names" :key="index">
                            {{ item }}
                        </li>
                        <li class="mb-2 font-bold">Invite Link:</li>
                        <li class="mb-2 font-light divide-y divide-dashed">{{ "localhost:3000/group/join/?group_id=" +
                            item.group_id }}</li>
                        </li>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios'
import { useUserStore } from "../../store/user";

var userStore = useUserStore();
var user_id = userStore.user_id;
var accessToken = userStore.accessToken;
const config = {
    headers: {
        'authorization': `Bearer ${accessToken}`
    }
}
var groups = ref([]);

/**
 * This function is used to get the information of groups a user is in.
 */
async function getGroups() {
    axios.post('http://localhost:3001/api/groups', {
        user_id: user_id
    }, config)
        .then((res) => {
            groups.value = res.data.groups;
        })
        .catch(function (error) {
            console.error(error);
            alert(error);
        })
}

/**
 * This function loads the groups a user is when the page loads.
 */
onMounted(async () => {
    await getGroups();
});
</script>