<template>
    <!-- Components: Post, Comments list, profile picture -->
    <PostProper v-if="!loading" :post="postData"></PostProper>

    <!--Left sidebar w/ features and author stuff-->
    <aside id=post-right-bar>
      <section class="author-info">
        <img :src="author.picture">
        <span class="name">{{ author.displayName }}</span>
        <span>
          <!-- Will always encourage person to follow through colour contrast -->
          <small :class="{activated: isFollowing}"> {{ isFollowing ? "Following" : "Not Following" }} </small>
          <small :class="{activated: !isFollowing}" @click="toggleFollow"> {{ isFollowing ? "Unfollow" : "Follow" }} </small>
        </span>
      </section>

      <button id="like-post-button" type="button" class="btn btn-default"><i class="bi bi-chat-left-text-fill"></i></button>
      <!-- <label for="like-post-button">{{ PostProper.likes }}</label> Not sure how this works yet...-->
      <button id="comment-button" type="button" class="btn btn-default"><i class="bi bi-heart-fill" :class="{liked: isFollowing}"></i></button>
      <label for="comment-button">{{ PostProper.count }}</label>
      <button type="button" class="btn btn-default"><i class="bi bi-link-45deg"></i></button>
    </aside>
    <!-- Idk if the sidebar for liiking, commenting, etc should be a component, or unique to this page -->
</template>

<script>
import PostProper from '@/components/viewPostComponents/SinglePost.vue'
import axios from 'axios'

export default {
  components: { PostProper },
  mounted () {
    // Get the post and author
    const pid = this.$route.params.pid
    const aid = this.$route.params.aid
    this.getData(pid, aid)
  },
  computed: {
    loading () {
      return (!this.authorData || !this.postData)
    },
    isFollowing () {
      // return this.authorisfollowing
      return false
    }
  },
  data () {
    return {
      postData: null,
      authorData: null
    }
  },
  methods: {
    async getData (pid, aid) {
      axios.get(`/authors/${aid}/posts/${pid}`)
        .then((res) => {
          this.postData = res.data
        })
        .catch((err) => { console.log(err) })

      axios.get(`/authors/${aid}`)
        .then((res) => {
          this.authorData = res.data
        })
        .catch((err) => { console.log(err) })
    }
  }
}
</script>

<style scoped>

  .liked {
    color: #FF0000
  }

  button > i:hover {
    filter: drop-shadow(5px, 3px, #797979);
  }

  i {
    color: #3a3a3a;
  }

</style>
