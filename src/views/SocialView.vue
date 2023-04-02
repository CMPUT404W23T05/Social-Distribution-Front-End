<template>

  <div v-if='loading' class="load-spinner spinner-border text-info text-center" role="loading"></div>

  <div v-if='!loading' class='follow-accounts'>
    <!-- Different footer to accept/request -->
    <!-- My Friends, My Followers, etc -->
    <div v-for="category in friendlies" :key="category">
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
              <button class="btn text-info" @click="handleRequest('Accept', person)">Accept</button>
              <button class="btn text-light" @click="handleRequest('Decline', person)">Reject</button>
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
  <div v-if='!loading' class="all-authors">
    <div v-for="nodeName in Object.keys(authorNodes)" :key="nodeName">
      <h2 class="section-header"> <strong>{{ nodeName === "localNode" ? "Local" : `${textTransform(nodeName, false, true)}'s`}}</strong> Authors</h2>
      <div class="d-flex flex-wrap justify-content-center mb-5">
        <GenericCard v-for="author in authorNodes[nodeName].data.items" :key="author.id" class="m-2">
          <template #card-content>
            <img :src='author.profileImage' class="profile-image"/>
            <h3 class="mt-1"> <strong>@{{author.displayName}}</strong></h3>
          </template>
          <div class="request-footer d-flex align-items-center justify-content-around">
            <button class="btn text-info" @click="sendFollow">Send Follow Request</button>
          </div>
        </GenericCard>
      </div>
    </div>
  </div>

</template>

<script>
import GenericCard from '@/components/GenericCard.vue'
import author_card from '../components/AuthorCard.vue'
import { mapStores } from 'pinia'
import { useUserStore } from '@/stores/user'
import { queryAllNodes } from '@/plugins/axiosUtil'

const followTemplate = {
  type: 'Follow',
  actor: Object,
  object: Object,
  state: String || null // Null if not accepted/rejected
}

export default {
  name: 'SocialPage',

  components: { GenericCard, author_card },

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
    this.currentAuthor = this.getAuthorFromStore()
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
    handleRequest (state, sender) {
      // Create a new follow object with a state
      const followToSend = followTemplate

      followToSend.state = state
      followToSend.actor = sender
      followToSend.object = this.currentAuthor

      this.$localNode
        .post(`${this.basePath}/inbox/`, followToSend)
        .then(() => {
          alert(`${state}ed the Request`) // Computed pendingRequests should auto-update
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async getRequests () {
      this.$localNode
        .get(`${this.basePath}/inbox/`)
        .then((res) => {
          this.inbox = res.data.items
        })
        .catch((err) => {
          alert('Couldn\'nt get requests')
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

  //   getAuthors () {
  //     this.$localNode.get('authors/')
  //       .then((res) => {
  //         this.authors = res.data
  //       })
  //       .catch((err) => {
  //         console.log('Our Teams Error is:' + err)
  //         console.log(this.$localNode.defaults)
  //       })
  //   },
  //   getRemoteAuthors2 () {
  //     this.$node7.get('authors/')
  //       .then((res) => {
  //         this.authors_remote2 = res.data
  //         console.log(res.data)
  //       })
  //       .catch((err) => {
  //         console.log('T7 Error is: ' + err)
  //         console.log(this.$node7.defaults)
  //       })
  //   },
  //   getRemoteAuthors () {
  //     this.$node10.get('authors/')
  //       .then((res) => {
  //         this.authors_remote = res.data
  //         console.log(res.data)
  //       })
  //       .catch(function (err) {
  //         console.log('T10 error is: ' + err)
  //         console.log(this.$node7.defaults)
  //       })
  //   },
  //   updateFollowers () {
  //     this.$refs.followers.getFollowers()
  //     this.$refs.friends.getFriends()
  //   }
  // },
  // mounted () {
  //   this.getAuthors()
  //   this.getRemoteAuthors()
  //   this.getRemoteAuthors2()
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
