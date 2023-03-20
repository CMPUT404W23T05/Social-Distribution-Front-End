<template>
  <div class="manage-posts">
    <h1>Manage <strong>Posts</strong></h1>
    <!-- Replace with a component later on -->
    <button type="button" class="add-button btn btn-primary float-start" data-bs-toggle="modal" data-bs-target="#managePost" @mouseenter="selected = { post: null, index: -1 }">
      Make A New Post
    </button>
    <div class="list-wrapper">
      <div class="card-list">
        <Card
          v-for="(post, index) in posts"
          :key="post.id"
          :post="post"
          :author="author"
          @mousedown="selected = {post: post, index: index}"
        >
          <template #footer>
            <span class="footer-totality">
              <button type="button" class="edit-button btn" data-bs-toggle="modal" data-bs-target="#managePost">
                <i class="bi bi-pencil-square"></i>
              </button>
              <span class="divider"></span>
              <button type="button" class="delete-button btn" data-bs-toggle="modal" data-bs-target="#deletePrompt">
              <i class="bi bi-trash3-fill"></i>
              </button>
            </span>
          </template>
        </Card>
        <div v-if="posts.length === 0">You haven't made any posts yet!</div>
      </div>
    </div>

    <ManagePostModal
      :existingPost="selected.post"
      @edit-post="(post) => editPost(post)"
      @create-post="(post) => createPost(post)">
    </ManagePostModal>

    <SlotModal modal-name="deletePrompt" v-if="selected.post">
      <template #titleText>Delete <strong>{{ selected.post.title }}</strong> </template>
      <template #body>Are you sure?</template>
      <template #closeButtonText>
        No! Take me back!
      </template>
      <template #submitButton>
        <button type="submit" class="btn btn-primary text-warning" data-bs-dismiss="modal" @click="delPost()">Yes, I'm sure</button>
      </template>
      <!-- Overwrite the fallback slot and prevent open modal button from appearing-->
      <template #openModalButton><br class="d-none"></template>
    </SlotModal>

  </div>
</template>

<script>
import Card from '@/components/RevisedCard.vue'
import SlotModal from '@/components/SlotModal.vue'
import ManagePostModal from '@/components/ManagePostModal.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  components: { ManagePostModal, Card, SlotModal },
  data () {
    return {
      posts: [],
      selected: { post: null, index: -1 },
      showPrompt: false,
      author: null // Load from user store
    }
  },
  computed: {
    ...mapStores(useUserStore),

    // Update, delete
    udEndPoint () {
      if (this.selected.post) {
        // const endpoint = `/authors/${this.author.id}/posts/${this.selected.post.id}/`
        const endpoint = '/authors/' + this.author.id + '/posts/' + this.selected.post.id + '/'
        return endpoint
      } else {
        return null
      }
    },

    // Create, read
    crEndPoint () {
      // const endpoint = String.raw`/authors/${this.author.id}/posts/`
      const endpoint = '/authors/' + this.author.id + '/posts/'
      return endpoint
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
        .post(this.crEndPoint, post)
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
  }
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
