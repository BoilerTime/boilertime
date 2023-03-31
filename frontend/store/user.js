import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {
        accessToken: "",
        refreshToken: "",
        user_id: ""
      },
    };
  },
  persist: persistedState.localStorage,
  /**
  * Getter functions for the user store variables retrieved from the backend login response.
  */
  getters: {
    isLoggedIn() {
        return this.user.user_id !== "";
    },
    user_id() {
        return this.user.user_id;
    },
    accessToken() {
        return this.user.accessToken;
    }
  },
  actions: {
    /**
    * A function to POST a pair of email and password to the backend /api/login route.
    * @param {string} email - an email address.
    * @param {string} password - a SHA-256 hashed password.
    */
    async signIn(email, password) {
      const res = await axios.post('http://localhost:3001/api/login', {
        email: email,
        password: password
      })
      const accessToken = await res.data.accessToken;
      const refreshToken = await res.data.refreshToken;
      const user_id = await res.data.user_id;
      const dark_mode = await res.data.dark_mode;
      const user = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user_id: user_id,
        dark_mode: dark_mode,
      }
      this.user = user;
    }, async logOut() {
      const user = {
        accessToken: "",
        refreshToken: "",
        user_id: ""
      }
      this.user = user;
    },
    async verifyToken(token, user_id) {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      const data = {
        user_id: user_id
      }
      await axios.post('http://localhost:3001/api/auth/user', data, config)
      .then(response => {
        if (response.data["authenticationToken"] != undefined) {
          this.user = {
            accessToken: response.data["authenticationToken"],
            refreshToken: response.data["refreshToken"],
            user_id: user_id
          }
        }
      })
      .catch(error => {
        navigateTo('/auth/login');
      });
    },
    async createGuest() {
      await axios.post('http://localhost:3001/api/guest')
      .then(response => {
        this.user = {
          accessToken: response.data["accessToken"]
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
});
