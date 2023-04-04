<template>

  <div v-if='loading' class="load-spinner spinner-border text-info text-center" role="loading"></div>

  <div v-if='!loading' class='follow-accounts' id="follows">
    <!-- Different footer to accept/request -->
    <!-- My Friends, My Followers, etc -->
    <div v-for="category in friendlies" :key="category" :id="category">
      <h2 class="section-header">My <strong>{{ textTransform(category.type, false, true) }}</strong></h2>
      <!-- Each person in each category -->
      <p v-if="category.items?.length === 0" class="mb-5">You don't have any {{category.type}} 😒</p>
      <div v-else class="d-flex flex-wrap justify-content-center mb-5">
        <GenericCard v-for="person in category.items" :key="person.id" class="m-2">
          <template #card-content>
            <div v-if="category.type !== 'requests'" class="wrapper d-flex flex-column justify-content-center text-center">
              <img :src='person.profileImage' class="profile-image"/>
              <h3 class="mt-1"> <strong>@{{person.displayName}}</strong></h3>
              <small>{{ person.host }}</small>
            </div>
            <div v-else class="wrapper d-flex flex-column justify-content-center text-center">
              <img :src='person.actor.profileImage' class="profile-image"/>
              <h3 class="mt-1"><strong>@{{person.actor.displayName}}</strong></h3>
              <small>{{ person.actor.host }}</small>
            </div>
          </template>

          <template #footer>
            <div v-if="category.type === 'requests'" class="accept-footer d-flex align-items-center justify-content-around">
              <button class="btn text-info" @click="handleRequest('Accepted', person)">Accept</button>
              <button class="btn text-light" @click="handleRequest('Declined', person)">Reject</button>
            </div>
            <div v-else class="d-flex justify-content-center align-items-center">
              <p>{{ textTransform(category.type, true, true) }}</p>
            </div>
          </template>
        </GenericCard>
      </div>
    </div>
  </div>

  <!-- All of the authors on our social distribution (across registered nodes) -->
  <div v-if='!loading' class="all-authors pb-5">
    <div v-for="nodeName in Object.keys(authorNodes)" :key="nodeName" :id="nodeName">
      <h2 class="section-header"> <strong>{{ nodeName === "localNode" ? "Local" : `${textTransform(nodeName, false, true)}'s`}}</strong> Authors</h2>
      <div class="d-flex flex-wrap justify-content-center mb-5">
        <GenericCard v-for="author in authorNodes[nodeName].data.items" :key="author.id" class="m-2">
          <template #card-content>
            <div class="wrapper d-flex flex-column justify-content-center text-center">
              <img :src='author.profileImage' class="profile-image"/>
              <h3 class="mt-1"> <strong>@{{author.displayName}}</strong></h3>
            </div>
          </template>
          <template #footer>
            <div class="request-footer d-flex align-items-center justify-content-around">
              <button class="btn text-info" @click="sendFollow(author)">Send Follow Request</button>
            </div>
          </template>
        </GenericCard>
      </div>
    </div>
  </div>

</template>

<script>
import GenericCard from '@/components/GenericCard.vue'
import { mapStores } from 'pinia'
import { useUserStore } from '@/stores/user'
import { queryAllNodes, getAxiosTarget } from '@/util/axiosUtil.js'

const followTemplate = {
  type: 'Follow',
  actor: Object,
  object: Object,
  state: null // Null if not accepted/rejected
}

export default {
  name: 'SocialPage',

  components: { GenericCard },

  computed: {
    ...mapStores(useUserStore),

    pendingRequests () {
      if (this.loading) {
        return { type: 'requests', items: [] }
      } else {
        const allRequests = this.inbox.filter(item => item.type === 'Follow')

        const pending = allRequests.filter(follow => !follow.state)
        const accepted = allRequests.filter(follow => !!follow.state)

        // Return requests that do not have a counterpart in the "accepted" category
        const items = pending.filter(pending => !accepted.some(updated => pending.actor.url === updated.actor.url))
        return { type: 'requests', items: items }
      }
    },

    friendlies () {
      return {
        requests: this.pendingRequests,
        friends: this.friendliesProxy.friends,
        followers: this.friendliesProxy.followers,
        following: this.friendliesProxy.following
      }
    }
  },

  async mounted () {
    this.getAuthorFromStore()
    this.basePath = new URL(this.sessionAuthor.id).pathname.replace(/\/api\//, '')
    await this.getRequests()
    await this.getFriendlies()
    await this.getAllAuthors()
    this.loading = false
  },

  data () {
    return {
      // For stuff related to the current author logged in

      // Helper for holding properties since requests has to be computed
      friendliesProxy: {
        friends: [],
        followers: [],
        following: []
      },

      inbox: [], // All requests that will need to be filtered

      // All people across our social distribution network
      authorNodes: {
        local: [],
        node10: [],
        node7: []
      },

      sessionAuthor: null, // Get from store
      basePath: String, // none
      loading: true
    }
  },
  methods: {
    // Used to transform "followers" -> "follower"
    textTransform (word, singularize, capitalize) {
      try {
        if (capitalize) {
          word = word?.charAt(0).toUpperCase() + word?.slice(1)
        }
        if (singularize) {
          word = word?.replace(/s$/, '')
        }
        return word
      } catch {
        console.log('Failed on: ' + word)
        console.table(word)
      }
    },

    // Related to the friend request logic
    handleRequest (state, existingFollow) {
      // Create a new follow object with a state (accepted/rejected)
      const followToSend = followTemplate

      followToSend.state = state
      followToSend.actor = existingFollow.actor
      followToSend.object = this.sessionAuthor

      console.table(followToSend)

      this.$localNode
        .post(`${this.basePath}/inbox/`, followToSend)
        .then(() => {
          alert(`${state} the Request`) // Computed pendingRequests should auto-update
          if (state === 'Accepted') {
            this.inbox.push(followToSend) // Update local version of allRequests
            this.moveToFriendsOrFollower(followToSend.actor)
          }
        })
        .catch((err) => {
          console.log(err)
        })

      // For back-end purposes to track remote only posts
      if (!followToSend.actor.host.includes('t30')) {
        this.$localNode.post(`${this.basePath}/remote-requests`, followToSend)
          .then(() => {
            console.log('sent to backend')
          })
          .catch(() => {
            console.log('Couldn\'t send to backend')
          })
      }
    },

    moveToFriendsOrFollower (acceptedFollow) {
      // Helper function to move people from the requests to the appropriate field for the local

      // Sheesh this funciton is incredibly inefficient but that's web dev for you am I right?
      const allRequests = this.inbox.filter(item => item.type === 'Follow')

      const recipricalFollow = acceptedFollow
      recipricalFollow.author = acceptedFollow.actor
      recipricalFollow.actor = acceptedFollow.author

      if (allRequests.includes(acceptedFollow) && allRequests.includes(recipricalFollow)) {
        this.friendliesProxy.friends.push(acceptedFollow.actor)
      } else {
        this.friendliesProxy.followers.push(acceptedFollow.actor)
      }
    },

    sendFollow (author) {
      // Create follow object
      const followToSend = followTemplate
      followToSend.actor = this.sessionAuthor
      followToSend.object = author

      if (author.id === this.sessionAuthor.id) {
        alert('You can\'t send a follow request to yourself')
        return
      }

      // Set up axios
      const hostNode = getAxiosTarget(author.host) // Gets the corresponding axios instance
      const endpoint = new URL(author.id).pathname.replace(/^\/api/, '')

      hostNode.post(`${endpoint}/inbox/`, followToSend)
        .then(() => {
          alert(`Succesfully sent follow request to ${author.displayName}`)
        })
        .catch(() => {
          alert(`Couldn't send the request to ${author.displayName}`)
        })

      // Backend purposes
      if (hostNode !== this.$localNode) {
        console.log(`${this.basePath}/remote-requests`)
        console.log(followToSend)

        this.$localNode.put(`${this.basePath}/remote-requests/`, followToSend)
          .then(() => {
            console.log('sent to backend')
          })
          .catch(() => {
            console.log('Couldn\'t send to backend')
          })
      }
    },
    async getRequests () {
      this.$localNode
        .get(`${this.basePath}/inbox/`)
        .then((res) => {
          this.inbox = res.data.items
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert('You\'ve already sent a request')
          } else {
            alert('Couldn\'nt get requests')
          }
          console.log(err)
        })
    },
    async getFriendlies () {
      for (const friendly in this.friendliesProxy) {
        this.$localNode.get(`${this.basePath}/${friendly}`)
          .then((res) => {
            this.friendliesProxy[friendly] = res.data // The array with friends, followers, etc.
          })
          .catch((err) => {
            this.friendliesProxy[friendly] = { type: friendly, items: [] }
            console.log("Couldn't get" + friendly)
            console.log(err)
          })
      }
    },

    async getAllAuthors () {
      this.authorNodes = await queryAllNodes('get', '/authors')
    },

    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.sessionAuthor = userStore.user.author
    }
  }
}
</script>

<style scoped>
  .profile-image {
    width: 128pt;
    height: 128pt;
    border-radius: 50%;
  }

  strong {
    color: #4998F5;
  }

  .load-spinner {
    position: fixed;
    margin: 0 auto;
    top: 40%;
    width: 100pt;
    height: 100pt;
  }

  .btn {
    border: none;
  }
  .authors{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2% 2% 2% 2%;
    justify-content: space-around;
    row-gap: 20px;
    margin-left: 5%;
    margin-right: 5%;
  }
</style>
