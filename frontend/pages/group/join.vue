<!--join.vue is accessed when clicking on a group link. The page will
    prompt the user whether or not they would like to join a group.-->
<template>
    <NavBar />
    <div class="h-screen p-16 bg-gray-200">
        <!--Join Group-->
        <div class="mx-auto max-w-6xl p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row">
            <h1 class="font-bold text-2xl mb-5 text-center">Would you like to join "{{ group_id }}"?</h1>
            <button type="submit" class="w-1/8 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded-lg" @click="joingroup">
                Join Group
            </button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { useUserStore } from "../../store/user";

const route = useRoute()
const group_id = route.query.group_id
var userStore = useUserStore();
var user_id = userStore.user_id;

/**
 * This function is used for making sure users meet the prerequisites of joining
 * a group, as well as adding the user to a group if they confirm.
 */
async function joingroup() {
    await axios.post('http://localhost:3001/api/joingroup', {
        user_id: user_id,
        group_id: group_id
    })
        .then(function () {
            alert("Group has been joined!")
        })
        .catch(function (error) {
            console.error(error);
            alert(error);
        })
}
</script>