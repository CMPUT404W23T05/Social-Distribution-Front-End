<template>
    <UserComment
    ref="infScrollCommentList"
    v-for="comment in comments"
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

    <!-- Bottom of the list when in loading/completed state-->
    <div v-if="loading" class="spinner-grow text-light" role="status"></div>
    <hr v-if="exhausted && comments.length > 0" id="end-of-comments" class="text-primary">
    <small v-if="exhausted" class="text-light mt-3">There are no more comments.
      <a class="text-primary" @click="$emit('addComment')">But you can add one</a>
    </small>
</template>

<script>
import UserComment from '@/components/commentComponents/UserComment.vue'
import { useUserStore } from '@/stores/user'

export default {
  emits: ['addComment'],
  props: { post: Object, page: Number, pageTotal: Number, pagination: Number, axiosTarget: Function },
  components: { UserComment },
  mounted () {
    const userStore = useUserStore()
    userStore.initializeStore()
    this.currentUser = userStore.user.author
    this.getComments()
  },
  watch: {
    page (updated) {
      this.getComments()
    }
  },
  computed: {
    exhausted () {
      return (this.comments?.length < this.pagination) && (this.page === this.pageTotal)
    }
  },
  data () {
    return {
      comments: [],
      loading: true, // Used in tandem with loading more posts
      currentUser: null
    }
  },
  methods: {
    matchPost (comment) {
      return this.post.author.id === comment.author.id || false
    },
    matchSession (comment) {
      return this.currentUser.id === comment.author.id || false
    },
    getComments () {
      const postPath = new URL(this.post.id).pathname
      this.axiosTarget.get(`${postPath}/comments`,
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
          this.comments = res.data.items // Replace existing comments
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
    margin: 0 0.25em;
  }

  hr {
    opacity: 0.8;
  }

  a {
    cursor: pointer;
  }
</style>
