<template>
  <h1>Manage your posts here</h1>
  <div class="manage-posts">
    <!-- Replace with a component later on -->
    <div class="card-list">
      <Card
        v-for="(post, index) in posts"
        :key="post.id"
        :post="post"
        :author="tempAuthor"
      >
        <template #footer>
          <button type="button" class="edit-button">Edit</button>
          <span class="divider">|</span>
          <button
            type="button"
            class="delete-button"
            @click="displayDelPrompt(post, index)"
          >
            Delete
          </button>
        </template>
      </Card>
      <div v-if="!posts">You haven't made any posts yet!</div>
    </div>

    <PopUpPrompt
      v-if="showPrompt"
      @clickOut="showPrompt = false"
      @acceptPrompt="deletePost"
    >
      You are about to delete <strong>{{ selectedPost.post.title }}</strong
      >! Are you sure?
    </PopUpPrompt>

    <ManagePost
      v-if="showManage"
      :author="tempAuthor"
      :existingPost="selectedPost.post"
    ></ManagePost>
  </div>
</template>

<script>
import ManagePost from "@/components/ManagePost.vue";
import Card from "@/components/RevisedCard.vue";
import PopUpPrompt from "@/components/PopUpDeletePrompt.vue";
import axios from "axios";

export default {
  data() {
    return {
      posts: [],
      selectedPost: { post: null, index: NaN },
      showPrompt: false,
      tempAuthor: {
        display_name: "Tommy",
        profile_image:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
        profile_name: "Tommy1321",
      },
    };
  },
  methods: {
    displayDelPrompt(post, index) {
      this.selectedPost = { post: post, index: index };
      this.showPrompt = true;
    },

    deletePost(post, index) {
      this.posts = this.posts.splice(index, 1);
      axios.delete(`/api/authors/${this.author.id}/${post.id}`);
      this.showPrompt = false;
    },
    doSomething() {
      console.log("Delete is pressed!");
    },
  },
  mounted() {
    // Eventually: `/api/authors/${this.author.id}/posts`
    axios
      .get("http://localhost:3000/posts/")
      .then((res) => {
        this.posts = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  components: { ManagePost, Card, PopUpPrompt },
};
</script>

<style>
.card-list {
  display: flex;
  flex-wrap: wrap;
  margin: 15pt 10%;
}
</style>
