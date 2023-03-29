<template>
  <div class="post-template container">
    <section class="post-title">
      <h1 class = post-title>{{post.title}}</h1>
    </section>

    <!-- Bootstrap icons to indicate post type -->
    <div class="supplementary-info">
      <details v-if="post.description" class="post-description" :open="descIsHovered">
        <!-- <summary @mouseenter="descIsHovered=true" @mouseleave="descIsHovered=false" @click.prevent><i class="bi bi-info-circle"></i></summary> -->
        <summary data-toggle="tooltip" data-placement="left" :title="post.description" @click.prevent><i class="bi bi-info-circle"></i></summary>
        <small>{{post.description}}</small>
      </details>

      <span class="post-icons">
        <i v-for="content in post.contentType.split(',')" :key="content" class="bi" :class=getIcon(content)></i>
      </span>
    </div>

    <section v-if="post.image" class="image-content">
      <img class="img-fluid" :src="imageSrc"/>
    </section>

    <!-- Text content (if any) -->
    <section v-if="post.content" class="text-content">
      <p v-if="post.content && !markdown" id="post-content-plain" class="text">{{post.content}}</p>
      <VueMarkdown v-else-if="post.content && markdown" id="post-content-markdown" :source="post.content" class="text"></VueMarkdown>
    </section>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'

export default {
  components: {
    VueMarkdown
  },
  props: {
    post: Object,
    author: Object
  },
  computed: {
    markdown () {
      return this.post.contentType.split(',').includes('text/markdown')
    },
    imageSrc () {
      return this.post.id + '/' + 'image'
    }
  },
  data () {
    return {
      descIsHovered: false
    }
  },
  methods: {
    getIcon (contentType) {
      // Returns additional bs class for an icon w/ regEx
      switch (true) {
        case /^text\/markdown$/.test(contentType): return ('bi-markdown-fill')
        case /^text\/plain$/.test(contentType): return ('bi-blockquote-left')
        case /^image/.test(contentType): return ('bi-image-fill')
      }
    }
  }
}
</script>

<style scoped>
/* Styles go here :) */

  .post-template {
    margin-top: 3rem;
    text-align: left;
  }

  /* Title */
  .post-title {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .text-content {
    font-size: 1rem;
    white-space: pre-wrap;
  }

  /* Post content type */
  .post-icons {
    gap: 5pt;
    color: #a3a3a3;
  }

  .supplementary-info {
    display: flex;
    justify-content: space-between;
    font-size: 1.4rem;
  }
  .image-content, .text-content {
    min-height: 25rem;
    background: #fcfafa;
  }
  .post-icons > i {
    margin: 0 0.2em;
  }

  details > small {
    display: inline-block;
    text-align: left;
    position: absolute;
  }

  img {
    display: block;
    margin: 0 auto;
    object-fit: contain;
    width: 70%;
  }

  /* Description */
  summary {
    list-style: none;
    color: #736666;
  }

  summary:hover {
    color: #4998F5;
  }

  small {
    font-size: 0.75em;
  }

  section {
    border-bottom: 0.5em solid transparent;
    box-sizing: content-box;
    box-shadow: 0 3px 0 -1px #4998F5;
    background: padding-box;
    padding: 0.4rem 0.75rem;
    margin-bottom: 0.5rem;
  }

</style>
