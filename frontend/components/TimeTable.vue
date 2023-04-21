<template>
  <div class="flex items-center space-x-2">
    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
    <div class="text-sm font-medium text-gray-800 cursor-pointer"
         @mouseover="showInfo = true"
         @mouseleave="showInfo = false">
      {{ className }}
    </div>
    <div v-if="showInfo"
         class="font-size: 100px; px-2 py-1 text-xs text-white bg-black rounded-md">
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
