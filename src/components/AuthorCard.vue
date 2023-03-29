<template>

<div class="card" style="width: 18rem;">
  <!-- <img src= class="card-img-top" alt="Image Here!"> -->
  <div class="card-body">
    <h5 class="card-title">{{ author.displayName }}</h5>
    <p class="card-text">Host: {{ author.host }}</p>
    <button @click="followAuthor(author)" class="btn btn-primary">Send Request</button>
  </div>
</div>
<!-- <h3>{{author}}</h3>
<br>
<h3>{{curr_author}}</h3> -->
<h3>{{ follow_confirm }}</h3>


</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

    export default {
    props: ['author'],
    data() {
        return {
            curr_author: [],
            follow_confirm: null
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
            type:'Follow',
            actor:this.curr_author,
            object:auth,
            }
            )
            .then((res) => {
                console.log(res.data)
                this.follow_confirm = res.data
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
