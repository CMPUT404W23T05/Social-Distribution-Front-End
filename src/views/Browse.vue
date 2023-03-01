<template>
  <div class="main_center">
    <div class="margin_set" id="heading" style="margin-top: 1%;">
      <h1 style="text-align: left;">Public Posts</h1>
    </div>

    <div class="dated_section">
      
      <div class="border_date">
        <h7>date</h7>
      </div>
      <!-- <h1>{{ moment().format("MMM DD YYYY") }}</h1> -->
      <h1>{{ moment("2011", "YYYY").fromNow() }}</h1>
      <div class="posts_section margin_set">
        <div class="single_card" v-for="post in posts" :key="post.id">
          <h1>{{ moment(post.published).fromNow() }}</h1>
          <Post class="card"
            :author="post.author" :post="post"
          />
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
    <div class="logo_groups" style="justify-content: flex-start;">
      <div class="logo_options" style="padding-right: 12%;">
        <img class="icon" src="..\assets\date.png">
      </div>
    </div>

  </div>
  
  <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

    
  </template>
  
<script>
import Post from '../components/PostCard.vue'
var moment = require('moment');

  export default {
    name: 'BrowsePage',
    components:{
      Post,
    },
    data(){
      return{
        moment:moment,
        posts:[]        
      }
    },
    computed: {
      trydate() {
        return moment.format()
      }
    },
    methods: {
      oldestPost: {

      }
    },
    created(){
      this.posts = [
        {
          type:"post",
          title:"A post title about a post about web dev",
          id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
          source:"http://lastplaceigotthisfrom.com/posts/yyyyy",
          // origin:"http://whereitcamefrom.com/posts/zzzzz",
          // description:"This post discusses stuff -- brief",
          contentType:"text/plain",
          content:"Þā wæs on burgum B",
          author:{
            type:"author",
            id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            host:"http://127.0.0.1:5454/",
            displayName:"Lara Croft",
            url:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            github: "http://github.com/laracroft",
            profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
          },
          published:"2015-03-09T13:07:04+00:00"
        },
        {
          type:"post",
          title:"newly demo post",
          id:"http://127.0.0.1:5454/authors/9de/posts/76",
          source:"http://lastplaceigotthisfrom.com/posts/yyyyy",
          // origin:"http://whereitcamefrom.com/posts/zzzzz",
          // description:"This post discusses stuff -- brief",
          contentType:"text/plain",
          content:"Hey yo",
          author:{
            type:"author",
            id:"http://127.0.0.1:5454/authors/9de",
            host:"http://127.0.0.1:5454/",
            displayName:"Lara Croft",
            url:"http://127.0.0.1:5454/authors/9de",
            github: "http://github.com/laracroft",
            profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
          },
          published:"2022-03-09T13:07:04+00:00"
        },
        {
          type:"post",
          title:"A post title to duplicate",
          id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bb",
          source:"http://lastplaceigotthisfrom.com/posts/yyyyy",
          origin:"http://whereitcamefrom.com/posts/zzzzz",
          description:"This post discusses stuff -- brief",
          contentType:"text/plain",
          content:"Þā wæs on burgum B",
          author:{
            type:"author",
            id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            host:"http://127.0.0.1:5454/",
            displayName:"Lara Croft",
            url:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            github: "http://github.com/laracroft",
            profileImage: "https://imgur.com/gallery/2oNSn3C.jpeg"
          },
          published:"2015-03-09T13:07:04+00:00"
        } 
      ]
    }
  }
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
    width:60px;
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

<!-- computed: {
  auth_post(){
    const auth_post = []
    for (let i = 0, len = Math.max(this.authors.length, this.posts.length); i < len; i++) {
      auth_post.push({
        author: this.authors[i] || 'no auhtors',
        post: this.posts[i] || 'no posts'
      })
    }
    return auth_post
  }
}, -->

<!-- 
// categories:["web","tutorial"],
// count: 1023,
// comments:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
// commentsSrc:{
//   type:"comments",
//   page:1,
//   size:5,
//   post:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
//   id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
//   comments:[
//     {
//       type:"comment",
//       author:{
//         type:"author",
//         id:"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
//         url:"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
//         host:"http://127.0.0.1:5454/",
//         displayName:"Greg Johnson",
//         github: "http://github.com/gjohnson",
//         profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
//       },
//       comment:"Sick Olde English",
//       contentType:"text/markdown",
//       published:"2015-03-09T13:07:04+00:00",
//       id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
//     }
//   ]
// },
// published:"2015-03-09T13:07:04+00:00",
// visibility:"PUBLIC",
// unlisted:false -->

<!-- categories:["web","tutorial"],
          count: 1023,
          comments:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
          commentsSrc:{
            type:"comments",
            page:1,
            size:5,
            post:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
            id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
            comments:[
              {
                type:"comment",
                author:{
                  type:"author",
                  id:"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                  url:"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                  host:"http://127.0.0.1:5454/",
                  displayName:"Greg Johnson",
                  github: "http://github.com/gjohnson",
                  profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
                },
                comment:"Sick Olde English",
                contentType:"text/markdown",
                published:"2015-03-09T13:07:04+00:00",
                id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
              }
            ]
          },
          published:"2015-03-09T13:07:04+00:00",
          visibility:"PUBLIC",
          unlisted:false -->