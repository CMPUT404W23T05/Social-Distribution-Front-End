<template>
  <h1>Manage your posts here</h1>
  <div class="manage-posts">
    <!-- Replace with a component later on -->
    <button type="button" class="add-button btn" @click="manage()">
      Make A New Post
    </button>
    <div class="card-list">
      <Card
        v-for="(post) in posts"
        :key="post.id"
        :post="post"
        :author="tempAuthor"
      >
        <template #footer>
          <button type="button" class="edit-button btn" @click="manage(post)">
            Edit
          </button>
          <span class="divider"></span>
          <button
            type="button"
            class="delete-button btn"
            @click="displayPrompt(post)"
          >
            Delete
          </button>
        </template>
      </Card>
      <div v-if="!posts">You haven't made any posts yet!</div>
    </div>

    <PopUpPrompt v-if="showPrompt" @dismiss="closePrompt" @accept="deletePost">
      You are about to delete <strong>{{ selectedPost.title }}</strong
      >! Are you sure?
    </PopUpPrompt>

    <ManagePost
      v-if="showManage"
      :author="tempAuthor"
      :existingPost="selectedPost"
      @end-manage="refreshPosts"
    ></ManagePost>
  </div>
</template>

<script>
import ManagePost from '@/components/ManagePost.vue'
import Card from '@/components/RevisedCard.vue'
import PopUpPrompt from '@/components/PopUpPrompt.vue'
import axios from 'axios'

export default {
  data () {
    return {
      posts: [],
      selectedPost: null,
      showManage: false,
      showPrompt: false,
      tempAuthor: {
        id: '22dea0b0-5e3b-445f-86f5-86fe91be0790',
        displayName: 'Test Author 1',
        profileImage: 'https://i.imgur.com/k7XVwpB.jpeg'
      }
    }
  },
  methods: {
    deletePost () {
      axios
        .delete(`/authors/${this.tempAuthor.id}/posts/${this.selectedPost.id}`)
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
        .get(`/authors/${this.tempAuthor.id}/posts/`)
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
    }
  },
  mounted () {
    this.getPosts()
  },
  components: { ManagePost, Card, PopUpPrompt }
}
</script>

<style>
.card-list {
  display: flex;
  flex-wrap: wrap;
  margin: 15pt 10%;
}
</style>
