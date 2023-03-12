<template>
  <!-- A read-only version of a single post -->
  <h1 class = post-title>{{post.title}}</h1>

  <img v-if="post.image" :src="post.image"/>

  <!-- Bootstrap icons to indicate post type -->
  <span class="post-icons">
    <i v-for="content in post.contentType.split(',')" :key="content" class="bi" :class=getIcon(content)></i>
  </span>

  <!-- Text content (if any) -->
  <p v-if="post.content && !markdown" id="post-content-plain" class="text">{{post.content}}</p>
  <VueMarkdown v-else-if="post.content && markdown" id="post-content-markdown" :source="post.content" class="text"></VueMarkdown>

  <p v-if="post.description" class=subtext>{{post.description}}</p>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'

export default {
  components: {
    VueMarkdown
  },
  props: {
    post: Object
  },
  computed: {
    markdown () {
      return this.post.contentType.split(',').includes('text/markdown')
    }
  },
  methods: {
    getIcon (contentType) {
      // Returns additional bs class for an icon w/ regEx
      switch (contentType) {
        case /^text\/markdown$/: return ('bi-markdown')
        case /^text\/plain$/: return ('bi-blockquote-left')
        case /^image/: return ('bi-image')
      }
    }
  }
}
</script>

<style>
/* Styles go here :) */

</style>
