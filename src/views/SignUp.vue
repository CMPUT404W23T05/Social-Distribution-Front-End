<template>
  <div class="d-flex min-vh-100">
    <div class="form-group authForm">
      <h1>Sign Up</h1>
      <form @submit.prevent="submitForm" >
        <div class="alert alert-danger" role="alert" v-if="authError">{{ authError }}</div>
        <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="username-icon">👤</span></div><input class="form-control" type="text" name="username" v-model="username" placeholder="Username"></div>
      <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔒</span></div><input class="form-control" type="password" name="password" v-model="password"  placeholder="Password"></div>
      <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔐</span></div><input class="form-control" type="password" name="password" v-model="confirmPassword"  placeholder="Confirm password"></div>
        <button class="btn btn-primary" type="submit">Sign Up</button>
      </form>
<br>Already have an account? <router-link to="/login">Log in</router-link>
    </div>
  </div>
  </template>

<script>
import axios from 'axios'
import { errorToString } from '@/util/authErrorHandler'
export default {
  name: 'sign-up',
  data () {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      authError: ''
    }
  },
  methods: {
    submitForm (e) {
      // key value pairs of username and password
      const formData = {
        username: this.username,
        password: this.password
      }
      if (this.password !== this.confirmPassword) {
        this.authError = 'Passwords do not match.'
        // clear the password fields
        this.password = ''
        this.confirmPassword = ''
      } else {
        if (localStorage.getItem('token') !== null) {
          localStorage.removeItem('token') // remove any old tokens from local
          console.log('Removed existing token')
        }
        axios
          .post('/users/', formData)
          .then(response => {
            this.$router.push('/login') // redirect to login page
            console.log(response)
          })
          .catch(error => {
            console.log(error)
            const formattedFieldNames = { username: 'Username', password: 'Password', non_field_errors: 'Error' }
            const errorString = errorToString(error, formattedFieldNames)
            this.authError = errorString
          })
      }
    }

  }
}

</script>

<style>@import "@/styles/auth.css";</style>
