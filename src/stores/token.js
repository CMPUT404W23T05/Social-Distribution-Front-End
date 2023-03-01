// stores variables that can be accessed from any component
// adapted from https://www.youtube.com/watch?v=XEZB-XbwihA
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', {
  state: () => ({
    token: '',
    isAuthenticated: false // by default, the user is not authenticated
  }),
  actions: {
    initializeStore () {
      if (localStorage.getItem('token')) { // if there is a token in local storage
        this.token = localStorage.getItem('token')
        this.isAuthenticated = true // the user is authenticated
      } else {
        this.token = ''
        this.isAuthenticated = false
      }
    },
    setToken (token) { // set the token in local storage when the user logs in
      this.token = token
      this.isAuthenticated = true
    },
    removeToken () { // remove the token from local storage when the user logs out
      this.token = ''
      this.isAuthenticated = false
    }
  }
})
