<!--loading.vue is a page that the viewer sees as their schedule is being generated-->
<template>
  <!--Content-->
  <div class="h-screen bg-gray-300">
    <div class="grid">
      <h1 class="font-extrabold text-3xl text-center my-16">
        Generating schedule...
      </h1>
      <div
        class="place-self-center animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-600"
      ></div>
    </div>
  </div>
</template>

<script>
//todo, await the schedule generation
</script>
