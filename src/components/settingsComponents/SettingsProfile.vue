<script>
export default {
  data () {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <h1>Profile</h1>
  <h2>Settings</h2>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
