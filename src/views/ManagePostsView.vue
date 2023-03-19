<template>
  <div class="manage-posts">
    <h1>Manage <strong>Posts</strong></h1>
    <!-- Replace with a component later on -->
    <button type="button" class="add-button btn btn-primary float-start" @click="showManage = true">
      Make A New Post
    </button>
    <div class="list-wrapper">
      <div class="card-list">
        <Card
          v-for="(post, index) in posts"
          :key="post.id"
          :post="post"
          :author="author"
          @click="selected = {post: post, index: index}"
        >
          <template #footer>
            <span class="footer-totality">
              <button type="button" class="edit-button btn" @click="showManage = true">
                <i class="bi bi-pencil-square"></i>
              </button>
              <span class="divider"></span>
              <button
                type="button"
                class="delete-button btn"
                @click="showPrompt = true"
              >
              <i class="bi bi-trash3-fill"></i>
              </button>
            </span>
          </template>
        </Card>
        <div v-if="posts.length === 0">You haven't made any posts yet!</div>
      </div>
    </div>

    <PopUpPrompt
      v-if="showPrompt"
      @dismiss="showPrompt = false"
      @delete-post="delPost()"
    >
      You are about to delete <strong>{{ selected.post.title }}</strong>! Are you sure?
    </PopUpPrompt>

    <ManagePost
      v-if="showManage"
      :existingPost="selected.post"
      @dismiss="showManage=false"
      @edit-post="(post) => editPost(post)"
      @create-post="(post) => createPost(post)"
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
      selected: { post: null, index: -1 },
      showManage: false,
      showPrompt: false,
      author: null // Load from user store
    }
  },
  computed: {
    ...mapStores(useUserStore),

    // Update, delete
    udEndPoint () {
      return `/authors/${this.author.id}/posts/${this.selected.post.id}/`
    },

    // Create, read
    crEndPoint () {
      return `/authors/${this.author.id}/posts/`
    }
  },
  methods: {
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    },

    // This view handles all CRUD Operations
    // Existing post is already accessible via "this.selected"
    createPost (post) {
      axios
        .post(this.udEndPoint, post)
        .then(() => {
          this.posts.unshift(post)
        })
        .catch(() => {
          alert("Couldn't add the post!")
        })
      this.showManage = false
    },

    getPosts () {
      axios
        .get(this.crEndPoint)
        .then((res) => {
          this.posts = res.data
        })
        .catch(() => {
          alert("Couldn't get any posts!")
        })
    },

    editPost (post) {
      axios
        .post(this.udEndPoint, post)
        .then(() => {
          this.posts[this.selected.index] = post
        })
        .catch(() => {
          alert("Couldn't edit the post!")
        })
      this.showManage = false
    },

    delPost () {
      axios
        .delete(this.udEndPoint)
        .then(() => {
          this.posts.splice(this.selected.index, 1)
        })
        .catch(() => {
          alert("Couldn't delete the post!")
        })
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

.manage-posts {
  margin: 2rem 5%;
}

.list-wrapper {
  clear: left;
}

.card-list {
  margin: 0 auto;
  display: inline-flex;
  justify-content: center; /* TODO: Try to center align the list, but flex-start each card */
  flex-wrap: wrap;
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

.add-button {
  margin: 1rem 0 2rem 0;
  background-color: #4998F5;
  border: none;
}

i {
  font-size: 2em;
  color: #FFF;
  transition: all 0.2s;
}

i:hover {
  color: #4998F5;
}

h1 {
  text-align: left;
  color: #1e1e1e;
}

strong {
  color: #4998F5;
}

</style>
