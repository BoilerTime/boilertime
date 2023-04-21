<template>
  <div class="block text-center p-2 gap-2">
    <div class="text-lg font-bold cursor-help"
         @mouseover="showInfo = true"
         @mouseleave="showInfo = false">
      {{ className }}
    </div>
    <div v-if="showInfo"
         class="px-2 py-1 text-sm font-medium text-indigo-700 bg-indigo-200 rounded-lg">
      {{ classInfo }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showInfo: false
    }
  },
  props: {
    className: {
      type: String,
      required: true
    },
    classInfo: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
/* No custom styles needed for this component */
</style>
