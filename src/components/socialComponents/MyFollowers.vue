<template>
<div class="list-of-profiles" id="followers">
  <h1 id="followers"> Your <br/> Followers</h1>
  <ul>
    <li v-for="follower in followers.items" :key="follower.id">
      <img :src="follower.profileImage">
      <p>{{displayUsername(follower.displayName)}}</p>
    </li>
  </ul>
</div>
  </template>

<script>

export default {
  data () {
    return {
      followers: ['']
    }
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    },
    async getData () {
      try {
        // get the followers of the author
        const response = await this.$http.get('http://localhost:8000/authors/1/followers/')
        this.followers = response.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    // get followers when page loads
    this.getData()
  }
}

</script>

<style>

  .list-of-profiles ul>li{
    display: inline-block
  }

  .list-of-profiles p{
    margin: 10px;
  }

  img {
    width: 100px;
    height: 100px;
    margin: 10px;
  }
</style>
