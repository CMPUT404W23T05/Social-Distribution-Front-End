<template>
    <h1>Sign Up</h1>
    <div class="sign-up">
      <form @submit.prevent="submitForm" style="display: inline;">
        <label>Username: <input type="text" name="username" v-model="username"></label><br>
        <label>Password: <input type="password" name="password" v-model="password"></label><br>
        <button type="submit">Sign Up</button>
      </form>
<br>Already have an account? <router-link to="/login">Log in</router-link>
    </div>
  </template>

<script>
export default {
  name: 'sign-up',
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
    }
    // TODO: Send formData to backend
  }
}

</script>
