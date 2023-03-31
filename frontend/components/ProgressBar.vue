<template>
    <div class="container">
      <div :style="fillerStyles">
        <span class="label">{{ `${completed}%` }}</span>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from "vue";
  export default {
    name: "ProgressBar",
    props: {
      bgcolor: String,
      completed: Number,
    },
    setup(props) {
      const fillerStyles = computed(() => {
        return {
          height: "100%",
          width: `${props.completed}%`,
          backgroundColor: props.bgcolor,
          transition: "width 1s ease-in-out",
          borderRadius: "inherit",
          textAlign: "right",
        };
      });
  
      return { fillerStyles };
    },
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .container {
    height: 30px;
    width: 100%;
    background-color: #e0e0de;
    border-radius: 50px;
  }
  
  .label {
    padding: 15px;
    vertical-align: middle;
    color: white;
    font-weight: bold;
  }
  </style>
  