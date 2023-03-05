import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  actions: {
    initializeStore () {
      if (localStorage.getItem('user')) { // if there is a user in local storage
        this.user = localStorage.getItem('user')
      } else {
        this.user = {}
      }
    },
    setUser (user) { // set the user in local storage when the user logs in
      this.user = user
    },
    removeUser () { // remove the user from local storage when the user logs out
      this.user = {}
    }
  }
})
