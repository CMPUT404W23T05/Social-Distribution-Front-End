<template>
  <h1>Login</h1>
  <div class="log-in">
    <form @submit.prevent="submitForm" style="display: inline;">
      <label>Username: <input type="text" name="username" v-model="username"></label><br>
      <label>Password: <input type="password" name="password" v-model="password"></label><br>
      <button type="submit">Login</button>
    </form>
    <br>Don't have an account? <router-link to="/signup">Sign up</router-link>
  </div>
</template>

<script>
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
export default {
  name: 'LogIn',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submitForm (e) {
      // eslint-disable-next-line no-unused-vars
      const formData = {
        username: this.username,
        password: this.password
      }
      // Send formData to backend
      axios
        .post('token/login', formData)
        .then(response => {
          console.log(response)
          // store token in local storage
          const token = response.data.auth_token
          const store = useTokenStore()
          store.setToken(token)
          axios.defaults.headers.common.Authorization = `Token ${token}`
          localStorage.setItem('token', token)
          // go to home page
          this.$router.push('/')
        })
        .catch(error => {
          console.log(error)
        })
    }

  }
}

</script>
