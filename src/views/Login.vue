<template>
  <h1>Login</h1>
  <div class="log-in">
    <form @submit.prevent="submitForm" style="display: inline;">
      <label>Username: <input type="text" name="username" v-model="username"></label><br>
      <label>Password: <input type="password" name="password" v-model="password"></label><br>
      <button type="submit">Login</button>
    </form>
    <br>Don't have an account? <a href ="/signup">Sign up</a>
  </div>
</template>

<script>
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
    }
    // TODO: Send formData to backend
  }
}

</script>
