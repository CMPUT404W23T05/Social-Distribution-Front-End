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
          v-for="(post, index) in posts.items"
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
        <div v-if="posts.items.length === 0">You haven't made any posts yet!</div>
      </div>
    </div>
    <ShowMoreButton v-if="!posts.noMore" @showMore="getPosts(++posts.page)"></ShowMoreButton>
    <p v-else-if="posts.noMore" class="text-center mt-5">No more posts to show!</p>
    <ManagePostModal
      :existingPost="selected.post"
      @edit-post="(post) => editPost(post)"
      @create-post="(post) => createPost(post)">
    </ManagePostModal>

    <SlotModal modal-name="deletePrompt" v-if="selected.post">
      <template #titleText>Delete <strong>{{ selected.post.title }}</strong> </template>
      <template #body>Are you sure you want to delete this post?</template>
      <template #closeButtonText>
        No! Take me back!
      </template>
      <template #submitButton>
        <button type="submit" class="btn btn-danger" data-bs-dismiss="modal" @click="delPost()">Yes, I'm sure</button>
      </template>
      <!-- Overwrite the fallback slot and prevent open modal button from appearing-->
      <template #openModalButton><br class="d-none"></template>
    </SlotModal>

  </div>
</template>

<script>
import Card from '@/components/PostCard.vue'
import SlotModal from '@/components/SlotModal.vue'
import ManagePostModal from '@/components/ManagePostModal.vue'
import ShowMoreButton from '@/components/ShowMoreButton.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { pathOf } from '@/util/axiosUtil'

export default {
  components: { ManagePostModal, Card, SlotModal, ShowMoreButton },
  data () {
    return {
      posts: {
        items: [],
        size: 12,
        page: 1,
        noMore: false
      },
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
        return (`${pathOf(this.selected.post.id)}/`)
      } else {
        return ''
      }
    },

    // Create, read
    crEndPoint () {
      return `${pathOf(this.author.id)}/posts/`
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
      // set missing fields in post
      post.author = this.author
      post._id = uuidv4()
      post.id = this.author.id + '/posts/' + post._id
      post.comments = post.id + '/comments'
      console.log(post)
      this.$localNode
        .post(this.crEndPoint, post)
        .then(() => {
          this.posts.items.unshift(post)
        })
        .catch(() => {
          alert("Couldn't add the post!")
        })
      this.showManage = false
    },

    getPosts (page) {
      this.$localNode
        .get(this.crEndPoint, {
          params: {
            size: this.posts.size,
            page: page
          }
        })
        .then((res) => {
          this.posts.items = this.posts.items.concat(res.data)
          if (res.data.length < this.posts.size) {
            this.posts.noMore = true
          }
        })
        .catch((e) => {
          // alert("Couldn't get any posts!")
          console.log(e)
          this.posts.noMore = true
        })
    },

    editPost (post) {
      this.$localNode
        .post(this.udEndPoint, post)
        .then(() => {
          this.posts.items[this.selected.index] = post
        })
        .catch(() => {
          alert("Couldn't edit the post!")
        })
      this.showManage = false
    },

    delPost () {
      this.$localNode
        .delete(this.udEndPoint)
        .then(() => {
          this.posts.items.splice(this.selected.index, 1)
        })
        .catch(() => {
          alert("Couldn't delete the post!")
        })
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getPosts(this.posts.page)
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
