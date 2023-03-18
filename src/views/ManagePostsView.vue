<template>
  <h1>Manage your posts here</h1>
  <div class="manage-posts">
    <!-- Replace with a component later on -->
    <button type="button" class="add-button btn btn-primary" @click="manage()">
      Make A New Post
    </button>
    <div class="card-list">
      <Card
        v-for="(post, index) in posts"
        :key="post.id"
        :post="post"
        :author="author"
      >
        <template #footer>
          <span class="footer-totality">
            <button type="button" class="edit-button btn" @click="manage(post, index)">
              <i class="bi bi-pencil-square"></i>
            </button>
            <span class="divider"></span>
            <button
              type="button"
              class="delete-button btn"
              @click="displayPrompt(post)"
            >
            <i class="bi bi-trash3-fill"></i>
            </button>
          </span>
        </template>
      </Card>
      <div v-if="posts.length === 0">You haven't made any posts yet!</div>
    </div>

    <PopUpPrompt v-if="showPrompt" @dismiss="closePrompt" @accept="deletePost">
      You are about to delete <strong>{{ selectedPost.title }}</strong
      >! Are you sure?
    </PopUpPrompt>

    <ManagePost
      v-if="showManage"
      :author="author"
      :existingPost="selectedPost"
      @end-manage="refreshPosts"
    ></ManagePost>
  </div>
</template>

<script>
import ManagePost from '@/components/ManagePost.vue'
import Card from '@/components/RevisedCard.vue'
import PopUpPrompt from '@/components/PopUpPrompt.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  data () {
    return {
      posts: [],
      selectedPost: null,
      showManage: false,
      showPrompt: false,
      author: null
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    deletePost () {
      axios
        .delete(`/authors/${this.author.id}/posts/${this.selectedPost.id}`)
        .then((res) => {
          console.log(res.data)
          this.posts = this.posts.filter((post) => post !== this.selectedPost)
        })
        .catch((err) => {
          alert("Couldn't delete post!")
          console.log(err)
        })
      this.closePrompt()
    },

    getPosts () {
      axios
        .get(`/authors/${this.author.id}/posts/`)
        .then((res) => {
          this.posts = res.data
          console.log(res)
        })
        .catch((err) => {
          alert("Couldn't get posts!")
          console.log(err)
          this.posts = []
        })
    },

    manage (post) {
      this.setSelected(post)
      this.showManage = true
    },

    displayPrompt (post) {
      this.setSelected(post)
      this.showPrompt = true
    },

    setSelected (post) {
      this.selectedPost = post
    },

    refreshPosts () {
      console.log('refreshing!')
      this.getPosts()
      this.$forceUpdate()
      this.showManage = false
    },

    closePrompt () {
      this.showPrompt = false
    },

    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getPosts()
  },
  components: { ManagePost, Card, PopUpPrompt }
}
</script>

<style scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  margin: 15pt 10%;
  gap: 3em;
}

.footer-totality {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}

.divider {
  border: 1px solid #FFF;
  height: 55%;
}

i {
  font-size: 2em;
  color: #FFF;
  transition: all 0.2s;
}

i:hover {
  color: #4998F5;
}

</style>
