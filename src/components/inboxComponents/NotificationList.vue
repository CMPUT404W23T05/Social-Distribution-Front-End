<template>

<div class="notification-list">
    <!-- Anchor is where to re-direct on click -->
    <InboxNotification v-for="notification in socialNotifications"
      :key="notification._id"
      :notification-type="notification.type"
      :anchor="notification.id"
    >

    <!-- This is so yucky but I don't want 5 other components AAAAAAAAAAAAAAAAAAAAAAAAA -->
      <template #notification-content>
        <!-- Should be of the form: {actor} {verb (past-tense)} {preposition (optional)} {target} -->
        <!-- e.g) <Sandy> <commented> <on> <'Selling seashells by the seashore'> -->
        <!-- e.g) <Jim> <sent> <friend request> <to you> -->

        <!-- No actionables yet, let's get a read-only version done first. -->

        <!-- Followed by relevant summary, if any. -->
        <div class="post-notif-content" v-if="notification.type==='post'">
          <p> {{ notification.author.displayName }} posted <strong>{{ notification.title }}</strong></p>
          <!-- Post summary stuff here? -->
        </div>

        <div class="comment-notif-content" v-else-if="notification.type==='comment'">
          <p> {{ notification.author.displayName }} commented on <strong>{{ getPostTitleFromComment(notification) }}</strong> </p>
          <p class="actual-comment"> {{ comment.comment }} </p>
        </div>

        <!-- Yes, the casing is correct according to the spec -->
        <div class="like-notif-content" v-else-if="notification.type==='Like'">
          <p> {{ notification.author.displayName }} liked {{ postCommentsMsg }} </p>
        </div>

        <!-- The follow was sent, but not in an accepted or rejected state (i.e pending???) -->
        <div class="request-notif-content" v-else-if="notication.type==='Follow' && '!notification.state'">
          <p> {{ getActor(notification.actor) }} sent a follow request to {{ getActor(notification.object) }}</p>
        </div>

        <!-- Notice that request was rejected/accepted -->
        <!-- Jane accepted your follow request -->
        <div class="request-notif-content" v-else-if="notification.type==='Follow' && 'notification.state'">
          <!-- Note: there is an issue when another accepts your request: "X accepted you's follow request" -->
          <p> {{ getActor(notification.actor) }} {{ notification.state }} {{ getActor(notification.object) }}'s follow request </p>
        </div>
      </template>
    </InboxNotification>
  </div>
</template>

<script>
import InboxNotification from '@/components/inboxComponents'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  components: [InboxNotification],
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
  data () {
    return {
      stream: null,
      author: null
    }
  },
  mounted () {
    this.updateList()
    this.getAuthorFromStore()
  },
  computed: {
    ...mapStores(useUserStore)
  },

  methods: {
    getPostFromComment (comment) {
      axios.get(comment.post_id)
        .then((res) => {
          return res.data.title
        })
        .catch(() => {
          return 'one of your posts'
        })
    },
    postCommentsMsg (like) {
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
    getActor (object) {
      return this.author.id === object.author.id
        ? 'You'
        : object.authorDisplayName
    },
    updateList () {
      this.stream = this.selectedNotifications
    },
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    }
  }
}

</script>
