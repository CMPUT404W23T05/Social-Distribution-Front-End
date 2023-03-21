<template>
    <UserComment
    ref="infScrollCommentList"
    v-for="comment in comments"
    :key="comment.id"
    :comment="comment">
        <!-- A list of comments independent of a post will not show this information -->
        <template #flair>
            <span v-if="matchPost(comment)">OP<i class="bi bi-person-check-fill"></i></span>
            <!-- I'm not sure what an appropriate icon for "Me" would be -->
            <span v-else-if="matchSession(comment)">Me<i class="bi bi-rocket-takeoff-fill"></i></span>
        </template>
    </UserComment>

    <!-- Bottom of the list when in loading/completed state-->
    <div v-if="loading" class="spinner-grow text-dark" role="status"></div>
    <hr v-if="exhausted" id="end-of-comments">
    <small v-if="exhausted">There are no more comments. <a href="activateAddComment!">But you can add one</a></small>
</template>

<script>
import UserComment from '@/components/commentComponents/UserComment.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

export default {
  props: { post: Object, page: Number, pagination: Number },
  components: { UserComment },
  mounted () {
    const userStore = useUserStore()
    userStore.initializeStore()
    this.currentUser = userStore.user.author
    this.getPosts(this.pagination)
  },
  updated () {
    this.getPosts(this.pagination)
  },
  data () {
    return {
      comments: [],
      loading: true, // Used in tandem with loading more posts
      exhausted: false, // No more posts to load from server (Show message indicating no more posts)
      currentUser: null
    }
  },
  methods: {
    matchPost (comment) {
      console.table(comment)
      return this.post.author.id === comment.author.id || false
    },
    matchSession (comment) {
      return this.currentUser.id === comment.author.id || false
    },
    getPosts () {
      console.table(this.post)
      axios.get(`${this.post.author._id}/posts/${this.post._id}/comments`, null,
        {
          params: {
            page: this.page,
            size: this.pagination
          }
        })
        .then(res => {
          if (res.data.length === 0) {
            this.exhausted = true
          }
          console.log(res.data.comments)
          this.comments = res.data.comments // Replace existing comments
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
      this.loading = true
    }
  }
}
</script>

<!-- Styling of this list will be left up to whatever view renders this -->
<style scoped>
  /* Colour of post flair */
  span {
    color: #4998F5;
  }

  i {
    margin: 0 0.5em;
  }
</style>
