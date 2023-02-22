// stores variables that can be accessed from any component
// adapted from https://www.youtube.com/watch?v=XEZB-XbwihA
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', {
  state: () => ({
    token: '',
    isAuthenticated: false // by default, the user is not authenticated
  }),
  actions: {
    initializeStore (state) {
      if (localStorage.getItem('token')) { // if there is a token in local storage
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true // the user is authenticated
      } else {
        state.token = ''
        state.isAuthenticated = false
      }
    },
    setToken (state, token) { // set the token in local storage when the user logs in
      state.token = token
      state.isAuthenticated = true
    },
    removeToken (state) { // remove the token from local storage when the user logs out
      state.token = ''
      state.isAuthenticated = false
    }
  }
})
