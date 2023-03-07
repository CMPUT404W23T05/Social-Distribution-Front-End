<template>
  <div class="main_center">
    <div class="margin_set" id="heading" style="margin-top: 1%;">
      <h1 style="text-align: left;">Public Posts</h1>
    </div>

    <div v-for="(postSection, index) in postSections" :key="index">
      <div class="dated_section" v-if="postSection.posts.length > 0">
        <div class="border_date">
          <h7 v-if="index === 0">{{ postSection.dateLabel }}</h7>
          <h7 v-else-if="index === 1">{{ postSection.dateLabel }}</h7>
          <h7 v-else-if="index === 2">{{ postSection.dateLabel }}</h7>
          <h7 v-else-if="index === 3">{{ postSection.dateLabel }}</h7>
          <h7 v-else-if="index === 4">{{ postSection.dateLabel }}</h7>
          <h7 v-else-if="index === 5">{{ postSection.dateLabel }}</h7>
        </div>
        <div class="posts_section margin_set">
          <div v-for="post in postSection.posts" :key="post.id">
            <!-- <h6 v-if="index === 2">{{ post.published }}</h6> -->
            <Post class="card" :author="post.author" :post="post" />
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
  
  <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    
  </template>
  
<script>
import Post from '../components/PostCard.vue'
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
        day_today: moment().format("YYYY MMM DD"),
        posts:[],
        postSections:[],
        reverseOrder: false      
      }
    },
    computed: {
      postSections() {
        const today = moment();
        const yesterday = moment().subtract(1, 'day');
        const twoDaysAgo = moment().subtract(2, 'days');
        const oneWeekAgo = moment().subtract(1, 'week');
        const oneMonthAgo = moment().subtract(1, 'month');

        const postSections = [
          {
            dateLabel: today.format("YYYY MMM DD"),
            posts: this.posts.filter(post => moment(post.published).isSame(today, 'day'))
          },
          {
            dateLabel: yesterday.format("YYYY MMM DD"),
            posts: this.posts.filter(post => moment(post.published).isSame(yesterday, 'day'))
          },
          {
            dateLabel: twoDaysAgo.format("YYYY MMM DD"),
            posts: this.posts.filter(post => moment(post.published).isSame(twoDaysAgo, 'day'))
          },
          {
            dateLabel: 'This Week',
            posts: this.posts.filter(post => moment(post.published).isBetween(oneWeekAgo, twoDaysAgo))
          },
          {
            dataLabel: 'A Month Ago',
            posts: this.posts.filter(post => moment(post.published).isBetween(oneMonthAgo, oneWeekAgo))
          },
          {
            dataLabel: 'Earlier',
            posts: this.posts.filter(post => moment(post.published).isBefore(oneMonthAgo))
          }
        ];
        
        if (this.reverseOrder) {
          postSections.reverse();
        } 

        return postSections;

      }
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
  .icon {
    height: 90%;
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
    width: 15%;
    position: fixed;
    right: 5%;
    top: 20%;
    border: solid 0.5px;
    border-color: #0060fa;
    padding: 0.5%;
  }

  .search_bar {
    width: 100%;
    margin-left: 0;
  }

  .posts_section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-top: 2%;
  }

  .dated_section {
    border-top: 2px solid #0060fa;
  }

  .border_date {
    width:140px;
    margin-top:-14px;
    margin-left:52px;
    background: white;
  }
  .main_center {
    display: flex;
    flex-direction: column;
    margin-left: 15%;
    margin-right: 25%;
    width: 60%;
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

  .card {
    width: 120pt;
    height: 144pt;
    aspect-ratio: 5/6;
    max-width: 120pt;
    max-height: 144pt;
  }

  .logo_options
  {
    width: 33%;
  }
</style>