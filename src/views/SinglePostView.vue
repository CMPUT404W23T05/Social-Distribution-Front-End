<template>
    <div class="d-flex flex-column flex-shrink-0 p-3">
      <!-- Components: Post, Comments list, profile picture -->
      <PostProper v-if="!loading" :post="postData" :author="authorData" class="col-9"></PostProper>

      <!--Left sidebar w/ features and author stuff-->
      <aside v-if="!loading" id="post-left-bar">
        <section class="author-info">
          <img :src="authorData.profileImage" class="author-picture">
          <div class="name">@{{ authorData.displayName }}</div>
          <span class="follow-status">
            <!-- Will always encourage person to follow through colour contrast -->
            <small :class="{activated: isFollowing}"> {{ isFollowing ? "Following" : "Not Following" }} </small>
            <small :class="{activated: !isFollowing}" @click="toggleFollow"> {{ isFollowing ? "Unfollow" : "Follow" }} </small>
          </span>
        </section>

        <ul class="btn-list">
          <li class="btn-with-label">
            <button id="like-post-button" type="button" class="btn btn-default"><i class="bi bi-heart-fill"></i></button>
            <!-- <label for="like-post-button">{{ PostProper.likes }}</label> Not sure how this works yet...-->
          </li>
          <li class="btn-with-label">
            <button id="comment-button" type="button" class="btn btn-default"><i class="bi bi-chat-left-text-fill" :class="{liked: isFollowing}"></i></button>
            <label for="comment-button">{{ postData.count }}</label>
          </li>
          <li>
            <button type="button" class="btn btn-default"><i class="bi bi-link-45deg"></i></button>
          </li>
        </ul>
      </aside>

    </div>
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
    color: #FF0000;
  }

  .activated {
    color: #4998F5;
    font-weight: bold;
  }

  .btn-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    gap: 3rem;
    margin: 5em 0;
  }
  .author-picture {
    border-radius: 50%;
    width: 144pt;
    height: 144pt;
  }

  .btn-with-label {
    margin: 0.5em 0;
  }

  .follow-status {
    display: flex;
    justify-content: space-around;
  }
  .name {
    font-weight: bold;
    font-size: 1.2em;
  }

  button {
    display: block;
    border-radius: 50%;
    background-color: #d9d9d9;
    aspect-ratio: 1/1;
    width: 5em;
  }

  i:hover {
    filter: drop-shadow(10px, 10px, #797979);
  }

  i {
    color: #3a3a3a;
    font-size: 2.2rem;
    padding: 0;
  }

  small {
    font-size: 0.75em;
    display: block;
  }

  li {
    list-style: none;
  }

  aside {
    position: fixed;
    width: fit-content;
  }

</style>
