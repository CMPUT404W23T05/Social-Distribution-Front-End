<template>
  <div class="manage-posts">
    <!-- Replace with a component later on -->
    <Card
      v-for="{ post, index } in posts"
      :key="post.id"
      @hover="previewAction(index, post)"
      @click="performAction(index, post)"
    ></Card>
    <div v-if="!posts">You haven't made any posts yet!</div>

    <PopUpPrompt
      v-if="showPrompt"
      @dismissPrompt="(toggleStatus) => (allowPrompt = toggleStatus)"
      @clickOut="showPrompt = false"
      @acceptPrompt="deletePost"
    >
      You are about to delete <strong>{{ selectedPost.post.title }}</strong
      >! Are you sure?
    </PopUpPrompt>

    <ManagePost v-if="showManage" :post="selectedPost.post"></ManagePost>
  </div>
</template>

<script>
import ManagePost from "@/components/ManagePost.vue";
import Card from "@/components/PostCard.vue";
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
    };
  },
  methods: {
    performAction(index, post) {
      this.selectedPost = { post: post, index: index };
      if (this.mode === "Edit") {
        this.selectedPost = { post: null, index: NaN };
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
  created() {
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
