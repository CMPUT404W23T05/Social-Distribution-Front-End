<template>
  <div class="d-flex min-vh-100">
  <div class="form-group authForm">
    <h1>Login</h1>
    <form @submit.prevent="submitForm">
      <div class="alert alert-danger" role="alert" v-if="authError">{{ authError }}</div>
      <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="username-icon">👤</span></div><input class="form-control" type="text" name="username" v-model="username" placeholder="Username"></div>
      <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔒</span></div><input class="form-control" type="password" name="password" v-model="password"  placeholder="Password"></div>
      <button class="btn btn-primary" type="submit">Login</button>
    </form>
    <br>Don't have an account? <router-link to="/signup">Sign up</router-link>
  </div>
</div>
</template>

<script>
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
import { errorToString } from '@/util/authErrorHandler'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
export default {
  name: 'LogIn',
  data () {
    return {
      username: '',
      password: '',
      authError: ''
    }
  },
  methods: {
    submitForm (e) {
      // eslint-disable-next-line no-unused-vars
      const formData = {
        username: this.username,
        password: this.password
      }
      if (localStorage.getItem('token') !== null) {
        localStorage.removeItem('token') // remove any old tokens from local
        console.log('Removed existing token')
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

          // store user in local storage
          axios.get('users/me')
            .then(response => {
              this.authError = '' // clear error message
              const user = response.data
              const store = this.userStore
              store.setUser(user)
            })
            .catch(error => {
              console.log(error)
            })

          // go to home page
          this.$router.push('/home')
        })
        .catch(error => {
          console.log(error)
          const formattedFieldNames = { username: 'Username', password: 'Password', non_field_errors: 'Error' }
          const errorString = errorToString(error, formattedFieldNames)
          // alert(errorString)
          this.authError = errorString
        })
    }

  },
  computed: {
    ...mapStores(useTokenStore, useUserStore)
  }
}

</script>

<style>
@import "@/styles/auth.css";
</style>
