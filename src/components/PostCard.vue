<template>
    <div class="card" @click="goTo()">

        <img :src="author.profileImage" alt="profile picture">

        <div class="card-header">
            {{ post.title }}
        </div>

        <!-- If post is an image -->
        <img 
        v-if="post.type === 'image'" 
        src="post.img_link" 
        class="card-img-top" 
        alt="content image"/>

        <!-- If post is text (incl markdown)-->
        <div v-else class="card-body">
            <vue-markdown :source="post.content"></vue-markdown>
        </div>
    </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown-render'

  export default {
    data() {
        return {};
    },
    props: ['author', 'post'],
    methods: {
        //Dynamically route to post page on click
        goTo() {
            return {};
        },

        renderMarkDown() {

        }
    },
    components: {
        VueMarkdown
    },
  }  
</script>