<template>
  <div class="list-of-profiles" id="followees">
    <h1> Your <br/> Followees</h1>
    <ul>
      <li v-for="author in followees.items" :key="author.url">
        <template v-if="author">
        <img :src="author.profileImage">
        <p>{{displayUsername(author.displayName)}}</p>
      </template>
      </li>
    </ul>
  </div>
    </template>
  
  <script>
  import { useUserStore } from '@/stores/user'
  import { mapStores } from 'pinia'
  import axios from 'axios'
  
  export default {
    data () {
      return {
        followees: [''],
        author: null
      }
    },
    computed: {
      ...mapStores(useUserStore)
    },
    methods: {
      displayUsername (username) {
        return '@' + username
      },
      getAuthorFromStore () {
        const userStore = this.userStore
        userStore.initializeStore()
        this.author = userStore.user.author
      },
      getFollowees () {
        axios
          .get(`/authors/${this.author._id}/following/`)
          .then((res) => {
            this.followees = res.data
            console.log(this.followees)
          })
          .catch((err) => {
            console.log("Couldn't get followees!")
            console.log(err)
          })
      }
    },
    mounted () {
      this.getAuthorFromStore()
      this.getFollowees()
    }
  }
  
  </script>
  
    <style>
    /* list items that are direct children of unordered list*/
    .list-of-profiles ul>li{
      display: inline-block
    }
    /* p tags that are children of the class list of profiles */
    .list-of-profiles p{
      margin: 10px;
    }
  
    img {
      width: 100px;
      height: 100px;
      margin: 10px;
    }
    </style>