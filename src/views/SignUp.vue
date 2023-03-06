<template>
    <h1>Sign Up</h1>
    <div class="form-group authForm">
      <form @submit.prevent="submitForm" >
        <div class="alert alert-danger" role="alert" v-if="authError">{{ authError }}</div>
        <div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="username-icon">👤</span></div><input class="form-control" type="text" name="username" v-model="username" placeholder="Username"></div><br>
      <div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔒</span></div><input class="form-control" type="password" name="password" v-model="password"  placeholder="Password"></div><br>
      <div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔐</span></div><input class="form-control" type="password" name="password" v-model="confirmPassword"  placeholder="Confirm password"></div><br>
        <button class="btn btn-primary" type="submit">Sign Up</button>
      </form>
<br>Already have an account? <router-link to="/login">Log in</router-link>
    </div>
  </template>

<script>
import axios from 'axios'
import { errorFromResponse } from '@/util/authErrorHandler'
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
        axios
          .post('/users/', formData)
          .then(response => {
            this.$router.push('/login') // redirect to login page
            console.log(response)
            console.log(formData.password)
          })
          .catch(error => {
            console.log(error)
            const response = error.response
            const errorString = errorFromResponse(response)
            this.authError = errorString
          })
      }
    }

  }
}

</script>

<style>@import "@/styles/auth.css";</style>
