<template>
    <div class="card" @click="goTo()">

        <img :src="author.profileImage"  id='profile-picture' alt="profile picture">

        <div class="card-header" id = "title">
            {{ post.title }}
        </div>

        <!-- Post is an image -->
        <img
        v-if="post.type === 'image'"
        :src="post.postSource"
        class="card-img-top"
        alt="content image"/>
        <!-- Post is markdown-->
        <div v-else-if="post.type === 'markdown'" class="card-body">
            <vue-markdown :source="post.content"></vue-markdown>
        </div>
        <!-- Post is plain text -->
        <div v-else class="card-body">
            <p>{{ post.content }}</p>
        </div>
    </div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'

export default {
  data () {
    return {}
  },
  props: ['author', 'post'],
  methods: {
    // Dynamically route to post page on click
    goTo () {
      return {}
    }
  },
  components: {
    VueMarkdown
  }
}
</script>

<style>
    /* Largely for preliminary testing, see how it looks with flex when added to parent container */
    #profile-picture {
        width: 32pt;
        aspect-ratio: 1/1;
        border-radius: 50%;
        object-fit: scale-down;
        position: absolute;
        top: -16pt;
        right: 12pt;
        border: black solid 2pt;
    }

    #title {
        font-weight: bold;
        font-size: larger;
        text-align: left;
        text-transform: capitalize;
    }

    .card {
        width: 15%;
        min-width: 120pt;
        aspect-ratio: 5/6;
    }

    .card-body {
        height: 140pt;
        text-align: left;
    }
</style>
