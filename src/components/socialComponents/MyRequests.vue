<template>
<div class="list-of-profiles" id="requests">
  <h1> Your <br/> Requests</h1>
  <ul>
    <li v-for="author in requests" :key="author.url">
      <template v-if="author"> 
      <img :src="author.actor.profileImage">
      <p>{{displayUsername(author.actor.displayName)}}</p>
      <span>
        <button @click="handleRequest('Accepted', getIdFromUrl(author.actor.url))" id="accept-button" class="btn btn-success">Accept</button>
        <button @click="handleRequest('Declined', getIdFromUrl(author.actor.url))" id="decline-button" class="btn btn-danger">Decline</button>
      </span>
      </template>
    </li>
  </ul>
</div>
  </template>

<script>
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  data () {
    return {
      inbox: [''], // the author's entire inbox
      requests: [''], // the requests that will be filtered from the inbox
      actor: null, // the author that is requesting to follow the current author
      object: null, // the current author
      followFormat: // the json object that will be sent 
      {
        "type": "Follow",      
        "actor": this.actor,
        "object": this.object
      }
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    },
    getIdFromUrl (url) {
      return url.split('/')[4]
    },
    HandleRequest (state, followerId) {
        axios
        .get(`/authors/${followerId}/`) // info about the author who wants to follow the current author
        .then((res) => {
          this.actor = res.data
          this.updateRequestInformation(state)
        })
        .catch((err) => {
          alert("Couldn't get author actor!")
          console.log(err)
        })
    },
    updateRequestInformation (state) {
      this.followFormat["state"] = state // having a state implies that the request has been accepted/declined

      axios
        .post(`/authors/${this.object.id}/inbox/`, this.followFormat) 
        .catch((err) => {
          alert("Couldn't update your request!")
          console.log(err)
        }) 
    },
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.object = userStore.user.author
    },
    // get the inbox and filter out the inbox so that we only get the requests
    getRequests () {
      axios
        .get(`/authors/${this.object.id}/inbox/`)
        .then((res) => {
          this.inbox = res.data
          this.requests = this.inbox.items.filter(item => item.type == "Follow").filter(follow => follow.state == undefined)
        })
        .catch((err) => {
          alert("Couldn't get inbox or requests!")
          console.log(err)
        })
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getRequests()
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
