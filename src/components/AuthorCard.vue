<template>

<div class="card" style="width: 18rem;">
  <!-- <img src= class="card-img-top" alt="Image Here!"> -->
  <div class="card-body">
    <h5 class="card-title">{{ author.displayName }}</h5>
    <p class="card-text">Host: {{ author.host }}</p>
    <button @click="followAuthor(author)" class="btn btn-primary">Send Request</button>
  </div>
</div>
<!-- <h3>{{author}}</h3> -->
<h3>{{curr_author}}</h3>


</template>

<script>
// import send_follow from '@views/BrowseView.vue'
// { "type": "author", "id": "http://127.0.0.1:8000/api/authors/07e7050f-4bf6-4249-8cde-6d254bddce9e", 
// "_id": "07e7050f-4bf6-4249-8cde-6d254bddce9e", 
// "url": "http://127.0.0.1:8000/api/authors/07e7050f-4bf6-4249-8cde-6d254bddce9e",
// "host": "http://127.0.0.1:8000/", "displayName": "testsocial123", "github": "", 
// "profileImage": "https://i.imgur.com/k7XVwpB.jpeg" }
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

    export default {
    props: ['author'],
    data() {
        return {
            curr_author: []
        }
    },
    methods: {
        getAuthorFromStore () {
            const userStore = this.userStore
            userStore.initializeStore()
            this.curr_author = userStore.user.author
        },
        followAuthor(auth) {
            axios.post(`/authors/${auth._id}/inbox/`,
            {
            'type':'Follow',
            'actor':`${this.curr_author}`,
            'object':`${auth}`,
            }
            )
            .then((res) => {
                this.authors = res.data
                console.log(res.data)
            })
            .catch(function(err) {
                console.log(err);
            });
        }
    },
    computed: {
        ...mapStores(useUserStore)
    },
    mounted() {
        this.getAuthorFromStore()
    }
    }
</script>

<style scoped>
</style>
