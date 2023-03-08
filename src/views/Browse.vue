<template>
  <div class="main_center">
    <div class="margin_set" style="margin-top: 1%;">
      <h1 style="text-align: left;">Public Posts</h1>
    </div>

    <div v-for="(postSection, index) in postSections" :key="index">
      <div style="padding: 3% 3% 3% 3%;">
        <div class="dated_section" v-if="postSection.posts.length > 0">
          <div class="border_date">
            <h7>{{ postSection.dateLabel }}</h7>
          </div>
          <div class="posts_section margin_set">
            <div v-for="post in postSection.posts" :key="post.id">
              <Post :author="post.author" :post="post" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="search_box">

    <form class="search_bar" method="post">
      <input style="width: 100%;" type="text" placeholder="search by term" id="keywords" name="keywords">
    </form>
    <div class="search_box_texts">
      <h6>File Type</h6>
    </div>
    <div class="logo_groups">
      <div class="logo_options">
        <img class="icon" src="..\assets\text.png">
      </div>
      <div class="logo_options">
        <img class="icon" src="..\assets\image.png">
      </div>
      <div class="logo_options">
        <img class="icon" src="..\assets\mark.png">
      </div>
    </div>
    <div class="search_box_texts">
      <h6>Privacy settings</h6>
    </div>
    <div class="logo_groups">
      <div class="logo_options">
        <img class="icon" src="..\assets\friends.png">
      </div>
      <div class="logo_options">
        <img class="icon" src="..\assets\public.png">
      </div>
      <div class="logo_options">
        <img class="icon" src="..\assets\private.png">
      </div>
    </div>
    <div class="search_box_texts">
      <h6>Sort by</h6>
    </div>
    <div style="display: flex; align-items: center;">
      <div style="margin-right: 8px;">
        <button @click="reverseOrder = !reverseOrder" style="border:none; background:none;">
          <img style="height: 20%; width: 20%;" class="icon" src="..\assets\arrows.png">
        </button>
      </div>
      <div style="margin-right: 8px;">
        <img style="height: 20%; width: 20%;" class="icon" src="..\assets\calendar.png">
      </div>
      <div style="border-left: 1px solid #ccc; height: 16px; margin-left: 8px;"></div>
    </div>

  </div>
  </template>
  
<script>
import Post from '../components/RevisedCard.vue'
var moment = require('moment')
import axios from "axios"

  export default {
    name: 'BrowsePage',
    components:{
      Post,
    },
    data(){
      return{
        moment:moment,
        posts:[],
        reverseOrder: false      
      }
    },
    computed: {
      postSections() {
        const sections = [];
        const groupedPosts = this.posts.reduce((acc, post) => {
          const date = moment(post.published).format('YYYY-MM-DD');
          if (acc[date]) {
            acc[date].push(post);
          } else {
            acc[date] = [post];
          }
          return acc;
        }, {});
        
        for (const date in groupedPosts) {
          const section = {
            dateLabel: moment(date).format("YYYY MMM DD"),
            posts: groupedPosts[date],
          };
          sections.push(section);
        }
        
        if (this.reverseOrder) {
          sections.reverse();
        }

        return sections;
      },
    },
    methods: {
      getPosts() {
      axios
        .get("http://localhost:8000/api/authors/22dea0b0-5e3b-445f-86f5-86fe91be0790/posts/")
        .then((res) => {
          this.posts = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      }
    },
    mounted() {
    this.getPosts();
    },
  };
</script>

<style scoped>
  .posts_section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2% 2% 2% 2%;
  }
  .dated_section {
    border-top: 2px solid #006a9b;
  }
  .border_date {
    width:140px;
    margin-top:-14px;
    margin-left:52px;
    background-color: rgb(255, 255, 255);
  }
  .main_center {
    display: flex;
    flex-direction: column;
    margin-left: 12%;
    margin-right: 25%;
    width: 62%;
  }
  .margin_set {
    margin-bottom: 1%;
  }
  .single_card {
    min-width: 120pt;
    min-height: 144pt;
    aspect-ratio: 5/6;
    max-width: 120pt;
    max-height: 144pt;
    margin: 1%;
  }
  .icon {
    height: 70%;
    width: 85%;
    display: inline;
  }
  .logo_groups {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
  .search_box_texts {
    height: 20pt;
    width: 100%;
    text-align: left;
    padding: 4% 0 0% 3%;
    color: #7E7E7E;
  }
  .search_box_texts h6{
    font-size: 13px;
  }
  .search_box {
    display: flex;
    flex-direction: column;
    width: 22%;
    position: fixed;
    right: 2%;
    top: 20%;
    border: solid 0.5px;
    border-color: #0060fa;
    padding: 0.5%;
  }
  .search_bar {
    width: 100%;
    margin-left: 0;
  }
  .logo_options
  {
    width: 33%;
  }
</style>

