<template>
  <div class="list-of-profiles" id="requests">
    <h1> Your <br/> Requests</h1>
    <ul>
      <li v-for="author in requests" :key="author.url">
        <template v-if="author" >
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
  emits: ['updateFollowers'],
  data () {
    return {
      inbox: [''], // the author's entire inbox
      requests: [''], // the requests that will be filtered from the inbox
      actor: null, // the author that is requesting to follow the current author
      object: null, // the current author
      pendingRequests: [''],
      updatedRequests: [''],
      followFormat: // the json object that will be sent
        {
          type: 'Follow',
          actor: this.actor,
          object: this.object
        }
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    getTestFollowerAuthor () {
      axios
        .get('/authors/38f57b34-f1ff-4f3b-9e81-2be731a14a0e/')
        .then((res) => {
          this.actor = res.data
          this.testSendingRequest()
        }
        )
        .catch((err) => {
          console.log(err)
        })
    },
    testSendingRequest () {
      this.followFormat.actor = this.actor
      this.followFormat.object = this.object
      axios
        .post('/authors/07e7050f-4bf6-4249-8cde-6d254bddce9e/inbox/', this.followFormat)
        .catch((err) => {
          console.log("Couldn't send test request")
          console.log(err)
        })
    },
    testExampleRequest () {
      /*
        Get information about the author that wants to follow the curent author, set then
        to this.actor, then post the follow request for the first time (i.e. it won't have a state field)
        */
      axios
        .get('/authors/07e7050f-4bf6-4249-8cde-6d254bddce9e/')
        .then((res) => {
          this.object = res.data
          this.getTestFollowerAuthor()
        }
        )
        .then(
          console.log(this.actor)
        )
        .catch((err) => {
          console.log(err)
        })
    },
    displayUsername (username) {
      return '@' + username
    },
    getIdFromUrl (url) {
      return url.split('/')[5]
    },
    handleRequest (state, followerId) {
      axios
        .get(`/authors/${followerId}/`) // info about the author who wants to follow the current author
        .then((res) => {
          this.actor = res.data
          this.updateRequestInformation(state)
        })
        .catch((err) => {
          console.log("Couldn't get author actor!")
          console.log(err)
        })
    },
    updateRequestInformation (state) {
      /*
        having a state implies that the request has been accepted/declined
        */
      this.followFormat.state = state
      this.followFormat.actor = this.actor
      this.followFormat.object = this.object

      axios
        .post(`/authors/${this.object._id}/inbox/`, this.followFormat)
        .then(() => {
          this.requests = this.requests.filter(request => request.actor.url !== this.actor.url) // remove the request from the list by only keeping requests with a different actor url
          console.table(this.requests)
          this.$emit('updateFollowers') // update the followers list
        })
        .catch((err) => {
          console.log("Couldn't update your request!")
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
        .get(`/authors/${this.object._id}/inbox/`)
        .then((res) => {
          this.inbox = res.data
          this.pendingRequests = this.inbox.items.filter(item => item.type === 'Follow').filter(follow => follow.state === undefined)
          this.updatedRequests = this.inbox.items.filter(item => item.type === 'Follow').filter(follow => follow.state !== undefined)
          this.requests = this.pendingRequests.filter(pending => !this.updatedRequests.some(updated => pending.actor.url === updated.actor.url))
        })
        .catch((err) => {
          console.log("Couldn't get inbox or requests!")
          console.log(err)
        })
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getRequests()
    // this.testExampleRequest()
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
