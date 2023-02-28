<template>
  <div>
    Professor: {{ prof }}
    <br>
    Class: {{ class }}
  </div>
</template>

<script setup>
  const props = defineProps({
    prof: String,
    class: String
  })

</script>