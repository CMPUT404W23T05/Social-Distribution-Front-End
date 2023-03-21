<template>
<div class="list-of-profiles" id="requests">
  <h1> Your <br/> Requests</h1>
  <ul>
    <li v-for="author in test_requests" :key="author._id">
      <img :src="author.profileImage">
      <p>{{displayUsername(author.displayName)}}</p>
      <span>
        <button id="accept-button" class="btn btn-success">Accept</button>
        <button id="decline-button" class="btn btn-danger">Decline</button>
      </span>
    </li>
  </ul>
</div>
  </template>

<script>

export default {
  data () {
    return {
      requests: [''],
      get_link: 'http://localhost:8000/api/authors/a15eb467-5eb0-4b7d-9eaf-850c3bf7970c/requests/',
      test_requests: [
        {
          type: 'Follow',
          actor: this.actor,
          object: this.object
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
        const response = await this.$http.get(this.get_link)
        this.requests = response.data
      } catch (error) {
        console.log(error)
      }
    },
    mounted () {
      this.getAuthorFromStore()
      this.getRequests()
      // this.testExampleRequest()
    }
  },
  created () {
    // get requests when page loads
    // this.getData()
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

  img {
    width: 100px;
    height: 100px;
    margin: 10px;
  }
  </style>
