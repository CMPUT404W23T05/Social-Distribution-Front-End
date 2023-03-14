<template>
    <UserComment
    ref="infScrollCommentList"
    v-for="comment in comments"
    :key="comment.id"
    :comment="comment">
        <!-- A list of comments independent of a post will not show this information -->
        <template v-slot:flair>
            <span v-if="matchPost(comment)">OP<i class="bi bi-person-check-fill"></i></span>
            <!-- I'm not sure what an appropriate icon for "Me" would be -->
            <span v-else-if="matchSession(comment)">Me<i class="bi bi-smile-fill"></i></span>
        </template>
    </UserComment>
    <hr v-if="exhausted" id="end-of-comments">
    <small v-if="exhausted">There are no more comments. <a href="activateAddComment!">But you can add one</a></small>
</template>

<script>
import UserComment from '@/components/UserComment.vue'
import axios from 'axios'
import useUserStore from '@/stores/user'

export default {
  props: { post: Object },
  components: { UserComment },
  data () {
    return {
      comments: [],
      exhausted: false, // No more posts to load from server (Stop infinite scroll)
      currentUser: useUserStore().initializeStore().user.author // TODO: Consolidate later
    }
  },
  methods: {
    matchPost (comment) {
      return this.post.author.id === comment.author.id || false
    },
    matchSession (comment) {
      return this.currentUser.id === comment.author.id || false
    },
    appendPosts (n) {
      // n will be determined by user's pagination settings (eventually)
      axios.get(`/authors/${this.author.id}/posts/${this.post.id}/comments`)
        .then(res => {
          if (res.data.length === 0) {
            this.exhausted = true
          }
          this.loadedComments.push(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleScroll (event) {
      const list = this.$refs.infScrollCommentList
      if (list.getBoundingClientRect().bottom < window.innerHeight && !this.exhausted) {
        this.appendPosts(10)
      }
    }
  }
}
</script>

<!-- Styling of this list will be left up to whatever view renders this -->
