<template>
  <h1>Manage your posts Here</h1>
  <div class="manage-posts">
    <!-- Replace with a component later on -->
    <button type="button" class="add-button btn" @click="manage()">
      Make A New Post
    </button>
    <!-- <div v-for="post in posts" :key="post.id"> 
      <Card :author="post.author" :post="post"></Card>
    </div> -->
    <div class="main_center">
      <div class="post_section">
        <Card v-for="post in posts" :key="post.id" :post="post" :author="tempAuthor">
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
      </div>
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
      @succesful-post="refreshPosts"
    ></ManagePost>
  </div>
</template>

<script>
import ManagePost from "@/components/ManagePost.vue";
import Card from "@/components/RevisedCard.vue";
import PopUpPrompt from "@/components/PopUpPrompt.vue";
import axios from "axios";

export default {
  data() {
    return {
      posts: [
    //   {
    //     type:"post",
    //     title:"A post title about a post about web dev",
    //     id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
    //     source:"http://lastplaceigotthisfrom.com/posts/yyyyy",
    //     contentType:"text/plain",
    //     content:"Þā wæs on burgum B",
    //     author:{
    //       type:"author",
    //       id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
    //       host:"http://127.0.0.1:5454/",
    //       displayName:"Lara Croft",
    //       url:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
    //       github: "http://github.com/laracroft",
    //       profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
    //     },
    //     published:"2023-02-01T13:07:04+00:00"
    //   },
    //   {
    //     type:"post",
    //     title:"newly demo post",
    //     id:"http://127.0.0.1:5454/authors/9de/posts/76",
    //     source:"http://lastplaceigotthisfrom.com/posts/yyyyy",
    //     // origin:"http://whereitcamefrom.com/posts/zzzzz",
    //     // description:"This post discusses stuff -- brief",
    //     contentType:"text/plain",
    //     content:"Hey yo",
    //     author:{
    //       type:"author",
    //       id:"http://127.0.0.1:5454/authors/9de",
    //       host:"http://127.0.0.1:5454/",
    //       displayName:"Lara Croft",
    //       url:"http://127.0.0.1:5454/authors/9de",
    //       github: "http://github.com/laracroft",
    //       profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
    //     },
    //     published:"2022-03-09T13:07:04+00:00"
    //   },
      ],
      selectedPost: null,
      showManage: false,
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
    deletePost() {
      //TO BE: `/api/authors/${this.author.id}/${post.id}`
      axios
        .delete(`http://localhost:8000/posts/${this.selectedPost.id}`)
        .then((res) => {
          console.log(res.data);
          this.posts = this.posts.filter((post) => post != this.selectedPost);
        })
        .catch((err) => {
          console.log(err);
        });
      this.closePrompt();
    },

    getPosts() {
      // Eventually: `/api/authors/${this.author.id}/posts`
      axios
        .get("http://localhost:8000/api/authors/22dea0b0-5e3b-445f-86f5-86fe91be0790/posts/")
        .then((res) => {
          this.posts = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    manage(post) {
      this.setSelected(post);
      this.showManage = true;
    },

    displayPrompt(post) {
      this.setSelected(post);
      this.showPrompt = true;
    },

    setSelected(post) {
      this.selectedPost = post;
    },

    refreshPosts() {
      this.getPosts();
      this.$forceUpdate;
      this.showManage = false;
    },

    closePrompt() {
      this.showPrompt = false;
    },
  },
  mounted() {
    this.getPosts();
  },
  components: { ManagePost, Card, PopUpPrompt },
};
</script>

<style scoped>
  .main_center {
    /* display: flex;
    flex-wrap: wrap;
    margin: 15pt 10%; */
    display: flex;
    flex-direction: horizontal;
    margin-left: 8%;
    margin-right: 1%;
    width: 77%;
  }

  .post_section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2% 2% 2% 2%;
  }

  .border_date {
    width:140px;
    margin-top:-14px;
    margin-left:52px;
    background: white;
  }

  .dated_section {
    border-top: 2px solid #0060fa;
  }
</style>
