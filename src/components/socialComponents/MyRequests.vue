<template>
<div class="list-of-profiles" id="requests">
  <h1> Your <br/> Requests</h1>
  <ul>
    <li v-for="author in authors" :key="author.id">
      <img :src="author.profile_image">
      <p>{{displayUsername(author.display_name)}}</p>
      <span>
        <button id="accept-button">Accept</button>
        <button id="decline-button">Decline</button>
      </span>
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
          display_name: 'request1',
          profile_image: 'http://i.imgur.com/k7XVwpB.jpeg'
        },

        {
          id: 2,
          display_name: 'request2',
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

  .list-of-profiles p button{
    margin: 10px;
  }

  #accept-button{
    background-color: green;
    color:white;
    margin:10px;
  }

  #decline-button{
    background-color: red;
    color:white;
    margin:5px;
  }

  img {
    width: 100px;
    height: 100px;
    margin: 10px;
  }
  </style>
