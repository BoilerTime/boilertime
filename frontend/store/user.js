import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn() {
        return !!this.user;
    },
    firstname() {
        return this.user.firstname;
    },
    accessToken() {
        return this.user.accessToken;
    }
  },
  actions: {
    async signIn(email, password) {
      console.log(email, password)
      const res = await axios.post('http://localhost:3001/api/login', {
        email: email,
        password: password
      })
      const accessToken = await res.data.accessToken;
      const firstname = await res.data.firstname;
      const user = {
        accessToken: accessToken,
        firstname: firstname
      }
      this.user = user;
    },
  },
});