<template>
  <div class="manage-posts">
    <!-- Replace with a component later on -->
    <div class="card-list">
      <Card
        v-for="(post, index) in posts"
        :key="post.id"
        :post="post"
        :author="tempAuthor"
        @hover="previewAction(index, post)"
        @click="performAction(index, post)"
      ></Card>
      <div v-if="!posts">You haven't made any posts yet!</div>
    </div>

    <PopUpPrompt
      v-if="showPrompt"
      @dismissPrompt="(toggleStatus) => (allowPrompt = toggleStatus)"
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
      mode: "Edit",
      posts: [],
      selectedPost: { post: null, index: NaN },
      allowPrompt: true,
      showPrompt: false,
      showManage: false,
      tempAuthor: {
        display_name: "Tommy",
        profile_image:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
        profile_name: "Tommy1321",
      },
    };
  },
  methods: {
    performAction(index, post) {
      this.selectedPost = { post: post, index: index };
      if (this.mode === "Edit") {
        this.showManage = true;
      } else {
        this.allowPrompt
          ? (this.showPrompt = true)
          : this.deletePost(this.selectedPost);
      }
    },
    deletePost(post, index) {
      this.posts = this.posts.splice(index, 1);
      axios.delete(`/api/authors/${this.author.id}/${post.id}`);
      this.showPrompt = false;
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
  margin: 15pt 20%;
}
</style>
