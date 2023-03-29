<template>

<div class="notification-list d-flex flex-wrap">
    <!-- Anchor is where to re-direct on click -->
    <GenericCard
      v-for="notification in feed"
      :key="notification.id"
      :anchor="getAnchor(notification)"
    >

      <template #card-content>
        <!-- Should be of the form: {actor} {verb (past-tense)} {preposition (optional)} {target} -->
        <!-- e.g) <Sandy> <commented> <on> <'Selling seashells by the seashore'> -->
        <!-- e.g) <Jim> <sent> <friend request> <to you> -->

        <!-- No actionables yet, let's get a read-only version done first. -->

        <!-- Followed by relevant summary, if any. -->
        <div class="post-notif-content notification" v-if="notification.type==='post'">
          <p> {{ notification.author.displayName }} posted <strong>{{ notification.title }}</strong></p>
          <!-- Post summary stuff here? -->
        </div>

        <div class="comment-notif-content notification" v-else-if="notification.type==='comment'">
          <p> {{ notification.author.displayName }} commented on <strong>{{ getPostFromComment(notification) }}</strong> </p>
          <p class="actual-comment"> {{ notification.comment }} </p>
        </div>

        <!-- Yes, the casing is correct according to the spec -->
        <div class="like-notif-content notification" v-else-if="notification.type==='Like'">
          <p> {{ notification.author.displayName }} liked {{ getPostComment(notification) }} </p>
        </div>

        <!-- The follow was sent, but not in an accepted or rejected state (i.e pending???) -->
        <div
        class="request-notif-content notification"
        v-else-if="notification.type==='Follow' && '!notification.state'"
        >
          <p> {{ getActor(notification.actor) }} sent a follow request to {{ getActor(notification.object) }}</p>
        </div>

        <!-- Notice that request was rejected/accepted -->
        <!-- Jane accepted your follow request -->
        <div class="request-notif-content notification"
         v-else-if="notification.type==='Follow' && 'notification.state'"
         :anchor="{ name: 'SocialPage' }">
          <!-- Note: there is an issue when another accepts your request: "X accepted you's follow request" -->
          <p class="request-notif-message"> {{ getActor(notification.actor) }} {{ notification.state }} {{ getActor(notification.object) }}'s follow request </p>
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
  mounted () {
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
      axios.get(comment.post_id)
        .then((res) => {
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
        : user.displayName
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
      switch (notification.type) {
        case 'Follow':
          return { name: 'SocialPage' } // Redirect to social page
        case 'post':
          return notification.post.id // Single post view page
        case 'comment':
          return notification.id.split('/comment')[0] // Single post view page
        case 'Like':
          return notification.items.object.split('/comment')[0] // Single post of the post/comment that was liked
      }
    }
  }
}

</script>
<style scoped>
  .request-notif-message {
    text-transform: capitalize;
  }

  .notification {
    margin: 1em;
  }

  h6 {
    text-align: center;
    width: 100%;
  }

</style>
