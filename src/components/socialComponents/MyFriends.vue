<template>
<div class="list-of-profiles" id="friends">
  <h1> Your <br/> Friends</h1>
  <ul>
    <li v-for="author in friends.items" :key="author.id">
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
      friends: [''],
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
    getFriends () {
      axios
        .get(`/authors/${this.author.id}/friends/`)
        .then((res) => {
          this.friends = res.data
          console.log(this.friends)
        })
        .catch((err) => {
          alert("Couldn't get friends!")
          console.log(err)
        })
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getFriends()
  }
}

</script>

  <style>

  .list-of-profiles ul>li{
    display: inline-block
  }

  .list-of-profiles p{
    margin: 10px;
  }

  img {
    width: 100px;
    height: 100px;
    margin: 10px;
  }
  </style>
