<template>
  <div class="absolute modal-backdrop grid grid-flow-row justify-center items-center inset-x-1/2 inset-y-1/4">
    <div class="modal bg-white rounded p-8 border shadow-lg">
      <header class="modal-header grid grid-flow-col p-5">
        <slot name="header">
        </slot>
      </header>

      <section class="modal-body p-5">
        <slot name="body">
        </slot>
       </section>

      <footer class="modal-footer p-5 grid grid-flow-col gap-6">
        <slot name="footer">
        </slot>
        <button
          type="button"
          class="btn-close bg-gray-400 w-auto rounded-lg text-white p-2 hover:bg-gray-700"
          @click="closeModal"
        >
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>

const emits = defineEmits(['closed']);

const closeModal = () => {
  emits('closed');
}
</script>