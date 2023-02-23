<template>
<div class="list-of-profiles" id="followers">
  <h1 id="followers"> Your <br/> Followers</h1>
  <ul>
    <li v-for="author in authors" :key="author.id">
      <img :src="author.profile_image">
      <p>{{displayUsername(author.display_name)}}</p>
    </li>
  </ul>
</div>
  </template>

<script>

export default {
  data () {
    return {
      authors: [
        {
          id: 1,
          display_name: 'follower1',
          profile_image: 'http://i.imgur.com/k7XVwpB.jpeg'
        },

        {
          id: 2,
          display_name: 'follower2',
          profile_image: 'http://i.imgur.com/k7XVwpB.jpeg'
        }
      ]
    }
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    }
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
