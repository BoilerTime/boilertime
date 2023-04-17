import { defineStore } from "pinia";
import axios from "axios";

export const useGuestStore = defineStore("guest", {
  state: () => {
    return {
      guest: {
        accessToken: "",
        schedule: "",
        bookmarked_classes: "",
      },
    };
  },
  persist: persistedState.localStorage,
  /**
  * Getter functions for the guest store variables retrieved from the backend login response.
  */
  getters: {
    accessToken() {
        return this.guest.accessToken;
    },
    schedule() {
      return this.guest.schedule
    },
    bookmarked_classes() {
      return this.guest.bookmarked_classes
    }
  },
  actions: {
    /**
    * A function to POST a pair of email and password to the backend /api/login route.
    * @param {string} email - an email address.
    * @param {string} password - a SHA-256 hashed password.
    */
    async addToSchedule(newSchedule) {
      this.guest.schedule = schedule

    },
    async saveSchedule() {
      await axios.post('http://localhost:3001/api/saveschedule/guest', this.guest.schedule)
      .then(response => {
        this.guest= {
          accessToken: response.data["accessToken"]
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
});
