<template>
  <div id="card-totality">
    <div class="post-title">
        <h3 class="title-text">{{ post.title }}</h3>
    </div>
    <div
      class="card-body card"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
    >
      <div class="content-container">
        <div class="decoration-accent"></div>
        <div class="scrim" :class="{open: hovered}"></div>
        <vue-markdown
          v-if="markdownEnabled"
          class="text-content"
          :class="{singleton: isSingleton}"
          :source="post.content"
        ></vue-markdown>
        <!-- Post is plain text -->
        <p v-else-if="post.content" class="text-content" :class="{singleton: isSingleton}">{{ post.content }}</p>
        <img
          class="image-content"
          :class="{singleton: isSingleton}"
          v-if="post.image"
          :src="imageURL"
          :alt="post.description"
        />
      </div>
      <div :class="{ open: hovered }" class="footer card-footer text-muted">
        <slot name="footer" :class="{ open: hovered }">
          <img
            class="profile-image"
            :class="{ open: hovered }"
            :src="author.profileImage"
            :alt="author.profileName"
          />
          <h6 id="username" v-if="hovered">
          @{{ author.displayName }}
          </h6>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'

export default {
  // doAction is an optional event handler (i.e edit post, open as view, etc.)
  components: { VueMarkdown },
  props: ['author', 'post'],
  data () {
    return {
      hovered: false
    }
  },
  computed: {
    markdownEnabled () {
      return this.post.contentType.includes('text/markdown')
    },
    imageURL () {
      return `http://localhost:8000/api/authors/${this.author._id}/posts/${this.post._id}/image`
    },
    isSingleton () {
      return (!!this.post.image && !this.post.content) || (!this.post.image && !!this.post.content)
    }
  }
}
</script>

<style scoped>
  .post-title {
    font-size: 16pt;
    white-space: nowrap;
    overflow: hidden;
    color: #2c2c2c;
    font-weight: bold;
    text-transform: none;
  }
  .title-text {
    font-size: large;
  }
  .content-container {
    display: flex;
    height: 100%;
    padding: 0;
    margin: 0.5em 0.8em;
    background-color: #f7f7f7;
    text-align: left;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: content-box;
  }

  .scrim {
    position: absolute;
    height: 60%;
    width: 100%;
    bottom: 0;
    opacity: 0;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
    transition: 0.35s
  }
/* Hover transition shadow */
  .scrim.open {
    opacity: 100;
  }

  .decoration-accent {
    position: absolute;
    border-right: 2pt solid #4998F5;
    border-top: 2pt solid #4998F5;

    width: 92.5%;
    height: calc(100% + 20pt);
    top: -28pt;
    right: 0.8em;
  }

  .image-content {
    max-width: 100%;
    min-height: 100%;
    object-fit: cover;
    flex: 0 0 50%;
  }

  .text-content {
    display: -webkit-box;
    -webkit-line-clamp: 9;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 90%; /* Jank to get it to line up with image */
    flex: 0 0 50%;
    padding-left: 1em;
    white-space: pre-wrap;
  }

  *.singleton{
    flex: 0 0 100%;
  }
  .footer {
    display: flex;
    position: absolute;
    bottom: 0;
    height: 0;
    border: none;
    width: 100%;
    border-radius: 0 !important;
    background-color: rgba(70, 70, 70, 1);
    transition: 0.35s;
    align-items: center;
    overflow: hidden;
    padding:0;
  }

  .footer.open {
    height: 20%;
    color: #FFF !important;
    background-color: rgba(70,70,70, 0.8);
    margin-left: 0;
    overflow: visible;

  }

  .profile-image {
    height: 0em;
    width: 0em;
    border-radius: 50%;
    object-fit: cover;
    transition: 0.4s;
  }

  .profile-image.open {
    height: 5em;
    width: 5em;
  }

  .card {
    /* width: 15%; */
    min-height: 200pt;
    min-width: 300pt;
    margin: 0pt;
    padding: 2pt 0;
    width: 120pt;
    height: 144pt;
    display: flex;
    border: none;
    border-radius: 0;
    background-color: #ffffff;

    box-shadow: 0.1rem 0.25rem 0.5rem rgba(0,0,0,0.25);
  }

  h6 {
    line-height: 0;
  }

</style>
