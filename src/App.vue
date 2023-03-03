<template>
  <NavBar :author = author v-if="loggedIn"></NavBar>
  <router-view/>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { useTokenStore } from '@/stores/token.js'
import axios from 'axios'

export default {
  name: 'App',
  beforeCreate () {
    const tokenStore = useTokenStore() // initialize the store
    // eslint-disable-next-line no-unused-vars
    const token = tokenStore.token // get the token from the store
    // TODO: attach token to request header
    if (token) {
      axios.defaults.headers.common.Authorization = `Token ${token}`
    } else {
      axios.defaults.headers.common.Authorization = 'null'
    }
  },
  data () {
    return {
      author: {
        display_name: 'username',
        profile_image: 'http://i.imgur.com/k7XVwpB.jpeg'
      }
    }
  },
  components: {
    NavBar
  },
  computed: {
    loggedIn () {
      return this.$route.name !== 'login' && this.$route.name !== 'signup'
    }
  }

}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
