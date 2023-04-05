<template>
    <div class="comments-section">
      <UserComment
      v-for="comment in commentSection"
      :key="comment.id"
      :comment="comment"
      :sessionUser="this.currentUser">
          <!-- A list of comments independent of a post will not show this information -->
          <template #flair>
              <span v-if="matchPost(comment)">OP<i class="bi bi-person-check-fill"></i></span>
              <!-- I'm not sure what an appropriate icon for "Me" would be -->
              <span v-else-if="matchSession(comment)">Me<i class="bi bi-rocket-takeoff-fill"></i></span>
          </template>
      </UserComment>
    </div>

    <!-- Bottom of the list when in loading/completed state-->
    <hr v-if="commentSection.length < pagination" id="end-of-comments" class="text-primary">
    <small class="text-light mt-3">There are no more comments.
      <a class="text-primary" @click="$emit('addComment')">But you can add one</a>
    </small>

    <div class="move-page-wrapper">
      <div v-if="pageTotal > 1" class="move-page">
        <i class="bi bi-caret-left-fill" :class="{activated: currentCommentPage > 1}" @click="changeCommentPage(-1)"></i>
        <span class="pages-count">{{ currentCommentPage }}/{{ pageTotal }}</span>
        <i class="bi bi-caret-right-fill" :class="{activated: currentCommentPage < pageTotal}" @click="changeCommentPage(1)"></i>
      </div>
    </div>

</template>

<script>
import UserComment from '@/components/commentComponents/UserComment.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  props: { comments: Array, pagination: Number, post: Object },
  components: { UserComment },
  mounted () {
    const userStore = useUserStore()
    userStore.initializeStore()
    this.currentUser = userStore.user.author
  },
  computed: {
    ...mapStores(useUserStore),
    exhausted () {
      return (this.commentSection?.length < this.pagination) && (this.page === this.pageTotal)
    },
    commentSection () {
      const start = (this.currentCommentPage - 1) * this.pagination
      const end = this.currentCommentPage * (this.pagination - 1)
      return this.comments?.slice(start, end)
    },
    pageTotal () {
      return Math.ceil(this.comments?.length / this.pagination) || 1 // Atleast one page
    }
  },
  data () {
    return {
      currentUser: null,
      currentCommentPage: 1
    }
  },
  methods: {
    matchPost (comment) {
      return this.post.author.id === comment?.author?.id
    },
    matchSession (comment) {
      return this.currentUser?.id === comment?.author?.id
    },
    changeCommentPage (n) {
      // Check if the currentPage will put the user out of bounds
      if (n < 0 && this.currentCommentPage + n > 0) {
        this.currentCommentPage += n
      } else if (n > 0 && this.currentCommentPage + n <= this.pageTotal) {
        this.currentCommentPage += n
      }
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
    margin: 0 0.25em;
  }

  hr {
    opacity: 0.8;
  }

  a {
    cursor: pointer;
  }
</style>
