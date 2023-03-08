import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  actions: {
    initializeStore () {
      if (localStorage.getItem('user')) { // if there is a user in local
        this.user = JSON.parse(localStorage.getItem('user'))
      } else {
        this.user = {}
      }
    },
    setUser (user) { // set the user in local storage when the user logs in
      console.assert(typeof user === 'object', 'user must be an object')
      this.user = user
    },
    removeUser () { // remove the user from local storage when the user logs out
      this.user = {}
    }
  }
})
