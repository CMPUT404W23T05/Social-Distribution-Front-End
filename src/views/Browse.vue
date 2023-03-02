<template>
  <div class="main_center">
    <div class="margin_set" id="heading" style="margin-top: 1%;">
      <h1 style="text-align: left;">Public Posts</h1>
    </div>

    <div class="dated_section">
      <div class="border_date">
        <h7>{{ moment().format("YYYY MMM DD") }}</h7>
      </div>
      <div class="posts_section margin_set">
        <div v-for="post in todaysPosts" :key="post.id">
          <Post class="card" :author="post.author" :post="post" />
        </div>
      </div>
    </div>

    <div class="dated_section">
      <div class="border_date">
        <h7>{{ moment().subtract(1, 'day').format("YYYY MMM DD") }}</h7>
      </div>
      <div class="posts_section margin_set">
        <div v-for="post in yesterdaysPosts" :key="post.id">
          <Post class="card" :author="post.author" :post="post" />
        </div>
      </div>
    </div>

    <div class="dated_section">
      <div class="border_date">
        <h7>{{ moment().subtract(2, 'days').format("YYYY MMM DD") }}</h7>
      </div>
      <div class="posts_section margin_set">
        <div v-for="post in daysBeforeYesterdaysPosts" :key="post.id">
          <Post class="card" :author="post.author" :post="post" />
        </div>
      </div>
    </div>

    <div class="dated_section">
      <div class="border_date">
        <h7>A Month Ago</h7>
      </div>
      <div class="posts_section margin_set">
        <div v-for="post in lastMonthPosts" :key="post.id">
          <Post class="card" :author="post.author" :post="post" />
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
var moment = require('moment')

  export default {
    name: 'BrowsePage',
    components:{
      Post,
    },
    data(){
      return{
        moment:moment,
        day_today: moment().format("YYYY MMM DD"),
        posts:[]        
      }
    },
    computed: {
      trydate() {
        return moment.format()
      },
      todaysPosts() {
        return this.posts.filter(post => moment(post.published).isSame(moment(), 'day'));
      },
      yesterdaysPosts() {
        return this.posts.filter(post => moment(post.published).isSame(moment().subtract(1, 'day'), 'day'));
      },
      daysBeforeYesterdaysPosts() {
        return this.posts.filter(post => moment(post.published).isSame(moment().subtract(2, 'days'), 'day'));
      },
      lastMonthPosts() {
        return this.posts.filter(post => moment(post.published).isBefore(moment().subtract(1, 'month').startOf('month')));
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
          published:"2023-02-01T13:07:04+00:00"
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
          published:"2023-02-28T13:07:04+00:00"
        },
        {
          type:"post",
          title:"My Thoughts on Climate Change",
          id:"http://127.0.0.1:5454/authors/1/posts/abc",
          source:"http://example.com/posts/123",
          origin:"http://example.com/posts/123",
          description:"A brief overview of my opinion on climate change",
          contentType:"text/plain",
          content:"Climate change is a real threat to our planet and we need to take action to reduce our carbon footprint",
          author:{
            type:"author",
            id:"http://127.0.0.1:5454/authors/1",
            host:"http://127.0.0.1:5454/",
            displayName:"John Smith",
            url:"http://127.0.0.1:5454/authors/1",
            github: "http://github.com/johnsmith",
            profileImage: "https://imgur.com/gallery/2oNSn3C.jpeg"
          },
          published:"2022-02-28T10:00:00+00:00"
        },
        {
          type:"post",
          title:"The Best Vegan Restaurants in Town",
          id:"http://127.0.0.1:5454/authors/2/posts/def",
          source:"http://example.com/posts/456",
          origin:"http://example.com/posts/456",
          description:"A list of my favorite vegan restaurants in the city",
          contentType:"text/plain",
          content:"1. Veggie Grill\n2. Native Foods\n3. Cafe Gratitude",
          author:{
            type:"author",
            id:"http://127.0.0.1:5454/authors/2",
            host:"http://127.0.0.1:5454/",
            displayName:"Jane Doe",
            url:"http://127.0.0.1:5454/authors/2",
            github: "http://github.com/janedoe",
            profileImage: "https://imgur.com/gallery/2oNSn3C.jpeg"
          },
          published:"2023-02-27T15:30:00+00:00"
        },
        {
          type:"post",
          title:"My Experience with Remote Work",
          id:"http://127.0.0.1:5454/authors/3/posts/ghi",
          source:"http://example.com/posts/789",
          origin:"http://example.com/posts/789",
          description:"A personal reflection on my experience with remote work",
          contentType:"text/plain",
          content:"Working remotely has its challenges, but overall it has been a positive experience for me",
          author:{
            type:"author",
            id:"http://127.0.0.1:5454/authors/3",
            host:"http://127.0.0.1:5454/",
            displayName:"Sarah Johnson",
            url:"http://127.0.0.1:5454/authors/3",
            github: "http://github.com/sarahjohnson",
            profileImage: "https://imgur.com/gallery/2oNSn3C.jpeg"
          },
          published:"2023-02-26T09:15:00+00:00"
        },
        {
          type: "post",
          title: "The Benefits of Meditation",
          id: "http://example.com/posts/1",
          source: "http://example.com/posts/1",
          origin: "http://example.com/posts/1",
          description: "Learn about the many benefits of meditation and why it's important to make time for it in your daily life.",
          contentType: "text/plain",
          content: "Meditation has been shown to reduce stress and anxiety, improve focus and concentration, and promote feelings of calm and well-being. By taking just a few minutes each day to meditate, you can experience these benefits for yourself.",
          author: {
          type: "author",
          id: "http://example.com/authors/1",
          host: "http://example.com/",
          displayName: "John Smith",
          url: "http://example.com/authors/1",
          twitter: "https://twitter.com/johnsmith",
          profileImage: "https://example.com/images/johnsmith.jpg"
          },
          published: "2023-03-01T10:30:00+00:00"
        },
        {
          type: "post",
          title: "10 Tips for a Successful Job Interview",
          id: "http://example.com/posts/2",
          source: "http://example.com/posts/2",
          origin: "http://example.com/posts/2",
          description: "Preparing for a job interview can be nerve-wracking, but these 10 tips will help you feel confident and ready to ace your interview.",
          contentType: "text/plain",
          content: "Research the company, dress professionally, practice your answers to common interview questions, arrive early, and follow up with a thank-you note. By doing these things, you'll be well-prepared and poised to impress your interviewer.",
          author: {
          type: "author",
          id: "http://example.com/authors/2",
          host: "http://example.com/",
          displayName: "Jane Doe",
          url: "http://example.com/authors/2",
          linkedin: "https://www.linkedin.com/in/janedoe/",
          profileImage: "https://example.com/images/janedoe.jpg"
          },
          published: "2022-02-27T14:15:00+00:00"
        },
        {
          type: "post",
          title: "The Best Ways to Stay Active in the Winter",
          id: "http://example.com/posts/3",
          source: "http://example.com/posts/3",
          origin: "http://example.com/posts/3",
          description: "Don't let the winter weather keep you from staying active. Try these tips to keep moving and stay healthy during the colder months.",
          contentType: "text/plain",
          content: "Find an indoor workout that you enjoy, bundle up and go for a walk or run, try a winter sport like skiing or snowboarding, or join a fitness class. By staying active, you'll improve your mood, boost your energy levels, and stay healthy all winter long.",
          author: {
          type: "author",
          id: "http://example.com/authors/3",
          host: "http://example.com/",
          displayName: "Tom Jones",
          url: "http://example.com/authors/3",
          instagram: "https://www.instagram.com/tomjonesfitness/",
          profileImage: "https://example.com/images/tomjones.jpg"
          },
          published: "2022-02-26T09:00:00+00:00"
        },
        {
          type: "post",
          title: "The Benefits of Meditation",
          id: "http://127.0.0.1:5454/authors/6d5f6a75c12e8f97bcbbd34cc908f1baba40658e/posts/1a2b3c4d5e6f",
          source: "http://example.com/posts/abcdef",
          origin: "http://example.com/posts/abcdef",
          description: "A brief overview of the benefits of daily meditation",
          contentType: "text/plain",
          content: "Meditation has been shown to reduce stress, improve focus, and boost overall well-being.",
          author: {
            type: "author",
            id: "http://127.0.0.1:5454/authors/6d5f6a75c12e8f97bcbbd34cc908f1baba40658e",
            host: "http://127.0.0.1:5454/",
            displayName: "John Doe",
            url: "http://127.0.0.1:5454/authors/6d5f6a75c12e8f97bcbbd34cc908f1baba40658e",
            github: "http://github.com/johndoe",
            profileImage: "https://example.com/profile-images/johndoe.jpeg"
          },
          published: "2022-02-15T08:30:00+00:00"
        },
        {
          type: "post",
          title: "The Future of Virtual Reality",
          id: "http://127.0.0.1:5454/authors/8e7d6c5b4a3f2e1d0c9b8a798765432112345678/posts/abcdef12345",
          source: "http://example.com/posts/xyz",
          origin: "http://example.com/posts/xyz",
          description: "An in-depth analysis of the latest advancements in virtual reality technology and its future potential",
          contentType: "text/plain",
          content: "Virtual reality is poised to revolutionize the way we work, play, and interact with each other. With the development of new hardware and software, the possibilities are endless.",
          author: {
            type: "author",
            id: "http://127.0.0.1:5454/authors/8e7d6c5b4a3f2e1d0c9b8a798765432112345678",
            host: "http://127.0.0.1:5454/",
            displayName: "Jane Smith",
            url: "http://127.0.0.1:5454/authors/8e7d6c5b4a3f2e1d0c9b8a798765432112345678",
            github: "http://github.com/janesmith",
            profileImage: "https://example.com/profile-images/janesmith.jpeg"
          },
          published: "2022-02-28T16:45:00+00:00"
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