<template>
  <div class="absolute grid grid-flow-row justify-center items-center inset-x-1/4">
    <div class="modal bg-white dark:bg-neutral-700 rounded-lg p-4 md:p-6 m-16 shadow-lg max-w-sm md:max-w-lg">
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
          class="btn-close w-auto rounded-lg font-bold text-yellow-700 dark:text-white p-2"
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