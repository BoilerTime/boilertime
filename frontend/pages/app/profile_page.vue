<template>
  <body class="h-screen p-16 bg-gray-200">
    <div
      class="mx-auto max-w-lg p-8 bg-white border rounded-lg shadow-lg grid grid-flow-row"
    >
      <div class="flex flex-auto gap-4">
        <div
          class="rounded-full h-24 w-24 text-white bg-yellow-400 flex items-center justify-center text-4xl font-extrabold"
        >
          <h1>{{ user.firstname[0] }}{{ user.lastname[0] }}</h1>
        </div>
        <div class="place-self-center">
          <h1 class="font-extrabold text-2xl">{{ user.firstname }} {{ user.lastname }}</h1>
          <h1 class="font-light text-lg">{{ user.grad_month }} {{ user.grad_year }}</h1>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  data() {
    return {
      user: {
        user_id: "xyz",
        grad_month: "December",
        grad_year: "2023",
        firstname: "Mahad",
        lastname: "Faruqi",
        grad_student: false,
      },
    };
  },

  methods: {
    //todo
  },
};
</script>
