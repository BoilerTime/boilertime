<template>
    <h3 class='mt-6 mb-2 text-xl font-bold'>1. basic</h3>
    <div>
      <button class='mt-2 rounded-full py-1 px-4 bg-white transition border-blue-500 border-2 text-blue-500 text-sm hover:border-blue-700 hover:text-blue-700 focus:bg-blue-700 focus:text-white focus:outline-none' @click="showModal">Show modal</button>
      <a
        href="https://github.com/hoiheart/vue-universal-modal/blob/main/example/1.basic.vue"
        target="_blank"
        class='mt-2 rounded-full py-1 px-4 bg-white transition border-blue-500 border-2 text-blue-500 text-sm hover:border-blue-700 hover:text-blue-700 focus:bg-blue-700 focus:text-white focus:outline-none'
      >
        Source
      </a>
    </div>
    <Modal v-model="isShow" :close="closeModal">
      <div class="modal">
        <p>Hello</p>
        <button @click="closeModal">exit</button>
      </div>
    </Modal>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  export default defineComponent({
    setup() {
      const isShow = ref(false);
      function showModal() {
        isShow.value = true;
      }
      function closeModal() {
        console.log("Clicked!")
        isShow.value = false;
      }
      return {
        isShow,
        showModal,
        closeModal,
      };
    },
  });
  </script>