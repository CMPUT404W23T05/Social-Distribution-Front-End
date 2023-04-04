<template>

<div class="notification-list d-flex flex-wrap">
    <!-- Anchor is where to re-direct on click -->
    <GenericCard
      v-for="notification in feed"
      :key="notification.id"
      :anchor="getAnchor(notification)"
      class="m-2"
    >

      <template #card-content>
        <!-- Should be of the form: {actor} {verb (past-tense)} {preposition (optional)} {target} -->
        <!-- e.g) <Sandy> <commented> <on> <'Selling seashells by the seashore'> -->
        <!-- e.g) <Jim> <sent> <friend request> <to you> -->

        <!-- No actionables yet, let's get a read-only version done first. -->

        <!-- Followed by relevant summary, if any. -->
        <div class="post-notif-content notification" v-if="notification.type==='post'">
          <p> {{ capitalizeFirstChar(getActor(notification.author)) }} posted <strong>{{ notification.title }}</strong></p>
          <!-- Post summary stuff here? -->
        </div>

        <div class="comment-notif-content notification" v-else-if="notification.type==='comment'">
          <p> {{ capitalizeFirstChar(getActor(notification.author))}} commented </p>
          <p class="actual-comment"> {{ notification.comment }} </p>
        </div>

        <!-- Yes, the casing is correct according to the spec -->
        <div class="like-notif-content notification" v-else-if="notification.type==='Like'">
          <p> {{ notification.summary }} </p>
        </div>

        <!-- The follow was sent, but not in an accepted or rejected state (i.e pending???) -->
        <div class="request-notif-content notification" v-else-if="notification.type==='Follow' && !notification.state">
          <p> {{ getActor(notification.actor) }} sent a follow request to {{ getActor(notification.object) }}</p>
        </div>

        <!-- Notice that request was rejected/accepted -->
        <!-- Jane accepted your follow request -->
        <div class="request-notif-content notification" v-else-if="notification.type==='Follow' && !!notification.state">
          <!-- Note: there is an issue when another accepts your request: "X accepted you's follow request" -->
          <p class="request-notif-message"> {{  capitalizeFirstChar(getActor(notification.object)) }} {{ notification.state.toString().toLowerCase() }} {{ getActor(notification.actor) }}'s follow request </p>
        </div>
      </template>

    <template #footer>
      <h6 class="notification-type">
        {{ notification.type }}
      </h6>
    </template>

    </GenericCard>
  </div>
</template>

<script>
import GenericCard from '@/components/GenericCard.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  emits: ['redirect'],
  components: { GenericCard },
  props: {
    selectedNotifications: {
      type: Array
    }
  },
  watch: {
    selectedNotifications () {
      this.updateList()
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  async created () {
    this.getAuthorFromStore()
    this.updateList()
  },
  data () {
    return {
      feed: [],
      author: null
    }
  },
  methods: {
    getPostFromComment (comment) {
      // Return a post associated with the comment
      axios.get(comment.id.split('/comments')[0]) // The post endpoint
        .then((res) => {
          console.log(res.data)
          return res.data.title
        })
        .catch(() => {
          return 'one of your posts'
        })
    },
    getPostComment (like) {
      // Return one of two values dependant on the liked object (post or comment)
      axios.get(like.object)
        .then((res) => {
          const content = res.data
          return content.type === 'post'
            ? content.title
            : `your comment: ${content.comment}`
        })
        .catch(() => {
          return 'one of your posts'
        })
    },
    getActor (user) {
      // An author object
      return this.author.id === user.id
        ? 'you'
        : '@' + user.displayName
    },
    updateList () {
      this.feed = this.selectedNotifications
    },
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    },
    getAnchor (notification) {
      if (notification.type === 'Follow') {
        return { name: 'SocialPage' }
      } else if (notification.type === 'comment' || notification.type === 'post') {
        return this.anchorHelper(notification.id)
      } else if (notification.type === 'Like') {
        return this.anchorHelper(notification.object)
      }
    },
    anchorHelper (queryObject) {
      const url = new URL(queryObject).pathname.replace('/api/', '').replace(/^\//)
      const parts = url.split('/')
      return { name: 'postpage', params: { aid: parts[1], pid: parts[3] }, query: { hostURL: queryObject } } // authors/[aid]/posts/[pid]
    },
    capitalizeFirstChar (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}

</script>
<style scoped>

  .notification {
    margin: 1em;
  }

  h6 {
    text-align: center;
    width: 100%;
    text-transform: capitalize;
  }

</style>
