<template>
<div class="list-of-profiles" id="requests">
  <h1> Your <br/> Requests</h1>
  <ul>
    <li v-for="request in requests" :key="request.id">
      <img :src="request.profile_image">
      <p>{{displayUsername(request.display_name)}}</p>
      <span>
        <button @click="removeRequest(request.id)" id="accept-button">Accept</button>
        <button @click="removeRequest(request.id)" id="decline-button">Decline</button>
      </span>
    </li>
  </ul>
</div>
  </template>

<script>

import axios from 'axios'
export default {
  data () {
    return {
      /* test authors */
      requests: [
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
  /* testing it out with json server */
  async created () {
    try {
      const res = await axios.get('http://localhost:3000/follows')
      this.items = res.data
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    },
    removeRequest (id) {
      axios.delete(`http://localhost:3000/follows/${id}`)
      this.items = this.items.filter(item => item.id !== id)
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
