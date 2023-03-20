<template>
<div class="list-of-profiles" id="followers">
  <h1 id="followers"> Your <br/> Followers</h1>
  <ul>
    <li v-for="author in followers.items" :key="author.id">
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
      followers: [''],
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
    getFollowers () {
      axios
        .get(`/authors/${this.author.id}/followers/`)
        .then((res) => {
          this.followers = res.data
          console.log(this.followers)
        })
        .catch((err) => {
          console.log("Couldn't get followers!")
          console.log(err)
        })
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getFollowers()
  }
}

</script>

<style scoped>

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
