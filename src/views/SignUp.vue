<template>
    <h1>Sign Up</h1>
    <div class="form-group">
      <form @submit.prevent="submitForm" >
        <div class="alert alert-danger" role="alert" v-if="authError">{{ authError }}</div>
        <label>Username: <input class="form-control" type="text" name="username" v-model="username"></label><br>
        <label>Password: <input class="form-control" type="password" name="password" v-model="password"></label><br>
        <label>Confirm Password: <input class="form-control" type="password" name="password" v-model="confirmPassword"></label><br>
        <button type="submit">Sign Up</button>
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
        alert('Passwords do not match')
        // clear the password fields
        this.password = ''
        this.confirmPassword = ''
      }
      // TODO: Send formData to backend
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

</script>
