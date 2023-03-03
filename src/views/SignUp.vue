<template>
    <h1>Sign Up</h1>
    <div class="sign-up">
      <form @submit.prevent="submitForm" style="display: inline;">
        <label>Username: <input type="text" name="username" v-model="username"></label><br>
        <label>Password: <input type="password" name="password" v-model="password"></label><br>
        <label>Confirm Password: <input type="password" name="password" v-model="confirmPassword"></label><br>
        <button type="submit">Sign Up</button>
      </form>
<br>Already have an account? <router-link to="/login">Log in</router-link>
    </div>
  </template>

<script>
import axios from 'axios'
export default {
  name: 'sign-up',
  data () {
    return {
      username: '',
      password: '',
      confirmPassword: ''
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
        })
        .catch(error => {
          console.log(error)
        })
    }

  }
}

</script>
