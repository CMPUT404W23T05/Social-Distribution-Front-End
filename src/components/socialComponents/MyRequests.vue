<template>
<div class="list-of-profiles" id="requests">
  <h1> Your <br/> Requests</h1>
  <ul>
    <li v-for="author in requests" :key="author.actor.id">
      <template v-if="author">
      <img :src="author.actor.profileImage">
      <p>{{displayUsername(author.actor.displayName)}}</p>
      <span>
        <button @click="updateRequest('accept', getIdFromUrl(author.actor.id))" id="accept-button">Accept</button>
        <button @click="updateRequest('decline', getIdFromUrl(author.actor.id))" id="decline-button">Decline</button>
      </span>
      </template>
    </li>
  </ul>
</div>
  </template>

<script>

export default {
  data () {
    return {
      requests: null,
      get_request_link: 'http://localhost:8000/api/authors/a15eb467-5eb0-4b7d-9eaf-850c3bf7970c/requests/',
      get_follower_link: 'http://localhost:8000/api/authors/a15eb467-5eb0-4b7d-9eaf-850c3bf7970c/followers/',
      test_requests: [
        {
          id: 1,
          displayName: 'request1',
          profileImage: 'http://i.imgur.com/k7XVwpB.jpeg'
        },
        {
          id: 2,
          displayName: 'request2',
          profileImage: 'http://i.imgur.com/k7XVwpB.jpeg'
        }
      ]
    }
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    },
    getIdFromUrl (url) {
      return url.split('/')[4]
    },
    updateRequest (selection, authorId) {
      if (selection === 'accept') {
        // if accepted, add the follower
        this.$http.put(this.get_follower_link + authorId + '/')
      }
      // will get deleted regardless
      this.$http.delete(this.get_request_link + authorId + '/')
    },
    async getData () {
      try {
        const response = await this.$http.get(this.get_request_link)
        this.requests = response.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    // get requests when page loads
    this.getData()
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
