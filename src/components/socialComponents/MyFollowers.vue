<template>
<div class="list-of-profiles" id="followers">
  <h1 id="followers"> Your <br/> Followers</h1>
  <ul>
    <li v-for="author in test_followers" :key="author._id">
      <img :src="author.profileImage">
      <p>{{displayUsername(author.displayName)}}</p>
    </li>
  </ul>
</div>
  </template>

<script>

export default {
  data () {
    return {
      followers: [''],
      get_link: 'http://localhost:8000/api/authors/a15eb467-5eb0-4b7d-9eaf-850c3bf7970c/followers/',
      test_followers: [
        {
          id: 1,
          displayName: 'follower1',
          profileImage: 'http://i.imgur.com/k7XVwpB.jpeg'
        },
        {
          id: 2,
          displayName: 'follower2',
          profileImage: 'http://i.imgur.com/k7XVwpB.jpeg'
        }
      ]
    }
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    },
    async getData () {
      try {
        // get the followers of the author
        const response = await this.$http.get(this.get_link)
        this.followers = response.data
      } catch (error) {
        console.log(error)
      }
    },
    mounted () {
      this.getAuthorFromStore()
      this.getFollowers()
    }
  },
  created () {
    // get followers when page loads
    // this.getData()
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
