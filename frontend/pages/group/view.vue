<!--view.vue is a page for viewing the groups that a user is in.-->
<template>
    <NavBar />
    <div class="p-16 bg-gray-200 overflow-auto dark:bg-neutral-500">
        <!--Groups Page-->
        <div class="mx-auto max-w-6xl p-8 bg-white dark:bg-neutral-700 border border-black rounded-lg shadow-lg grid grid-flow-row">
            <h1 class="font-bold text-2xl mb-5 text-center dark:text-gray-200">Groups Page</h1>
            <!--Flex grouping for groups-->
            <div class="bg-neutral-200 dark:bg-neutral-400 rounded-lg max-w-full mb-5 mt-5 p-4 text-center">
                <ul class="list-inside list-item">
                    <li class="divide-y divide-solid divide-black">
                        <li v-for="(item, index) in groups" :key="index">
                            <li class="mt-2 mb-2 font-bold">Group Name:</li>
                            <li class="mb-2 font-light">{{ item.group_name }}</li>
                            <li class="mb-2 font-bold">Group Members:</li>
                            <li class="font-light mb-2" v-for="(item, index) in groups[index].member_names" :key="index">
                                {{ item }}
                            </li>
                            <li class="mb-2 font-bold">Invite Link:</li>
                            <li class="mb-2 font-light divide-y divide-dashed">{{ "https://boilerti.me/group/join/?group_id=" +
                                item.group_id }}</li>
                            <button type="copy" class="mb-2 w-1/8 bg-blue-500 hover:bg-blue-700 text-white font-bold border dark:border-black py-2 px-2 rounded-lg hover:"
                                @click="copyLink(item.group_id)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                                </svg>                                  
                            </button>
                            <!--Leave Group Button-->
                            <button v-if="item.owner!==user_id" type="leave" class="mb-2 w-1/8 bg-green-500 hover:bg-green-700 text-white font-bold border dark:border-black py-2 px-2 rounded-lg"
                                @click="leaveGroup(item.group_id)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </button>
                            <!--Delete Group Button-->
                            <button v-if="item.owner===user_id" type="delete" class="mb-2 w-1/8 bg-red-500 hover:bg-red-700 text-white font-bold border dark:border-black py-2 px-2 rounded-lg"
                                @click="deleteGroup(item.group_id)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
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
var group_name = ref();
var isOwner = ref(false);

/**
 * This function is used to get the information of groups a user is in.
 */
async function getGroups() {
    axios.post('https://api.boilerti.me/api/groups', {
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
 * This function is used to leave a group.
 */
async function leaveGroup(group_id) {
    axios.post('https://api.boilerti.me/api/leavegroup', {
        user_id: user_id,
        group_id: group_id
    }, config)
    .then((res) => {
        console.log(res.group_name);
        group_name.value = res.data.group_name;
        console.log(group_name.value);
        console.log(group_name);
        alert("You have left this group.");
        location.reload();
    })
    .catch(function (error) {
        console.error(error);
        alert(error);
    })
}

/**
 * This function is used for deleting a group, only if the user is the owner.
 */
async function deleteGroup(group_id) {
    axios.post('https://api.boilerti.me/api/removegroup', {
        user_id: user_id,
        group_id, group_id
    }, config)
    .then((res) => {
        group_name.value = res.data.group_name;
        alert("You have deleted this group.");
        location.reload();
    })
    .catch(function (error) {
        console.error(error);
        alert(error);
    })
}

/**
 * This function is used to copy the group invite link when pressing a button.
 */
async function copyLink(group_id) {
    try {
        await navigator.clipboard.writeText("https://boilerti.me/group/join/?group_id=" + group_id);
        console.log("https://boilerti.me/group/join/?group_id=" + group_id)
        alert("Copied link");
    } catch(error) {
        alert("Cannot copy");
    }
}

/**
 * This function loads the groups a user is when the page loads.
 */
onMounted(async () => {
    await getGroups();
});
</script>