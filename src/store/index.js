// stores variables that can be accessed from any component
import { createStore } from 'vuex'

export default createStore({
  state: {
    token: '',
    isAuthenticated: false // by default, the user is not authenticated
  },
  mutations: {
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
  },
  actions: {
  },
  modules: {
  }
})
