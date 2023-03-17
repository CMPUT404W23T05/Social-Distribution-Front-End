<template>
  <card-totality>
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
        <div v-if="hovered" class="scrim"></div>
        <vue-markdown
          v-if="markdownEnabled"
          class="text-content"
          :source="post.content"
        ></vue-markdown>
        <!-- Post is plain text -->
        <p v-else-if="post.content" class="text-content">{{ post.content }}</p>
        <img
          class="image-content"
          v-if="post.image"
          :src="imageURL"
          :alt="post.description"
        />
      </div>
      <div :class="{ open: hovered }" class="footer card-footer text-muted">
        <slot name="footer">
          <img
            class="profile-image"
            :src="author.profileImage"
            :alt="author.profileName"
          />
          <h6 id="username">@{{ author.displayName }}</h6>
          <span
            class="content-types"
            v-for="content in post.ContentType"
            :key="content"
            >{{ content }}
          </span>
        </slot>
      </div>
    </div>
  </card-totality>
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
      return `http://localhost:8000/api/authors/${this.author.id}/posts/${this.post.id}/image`
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
    text-transform: uppercase;
  }
  .title-text {
    font-size: large;
  }
  .content-container {
    display: flex;
    height: 100%;
    padding: 0;
    margin: 0.5em 0.8em;
    text-align: left;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: content-box;
  }

  .scrim {
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3));
  }

  .decoration-accent {
    position: absolute;
    border-right: 2pt solid #4998F5;
    border-top: 2pt solid #4998F5;
    width: 90%;
    height: calc(100% + 28pt);
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
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 0 0 50%;
  }

  .footer {
    display: none;
    float: bottom;
    position: absolute;
    bottom: 0;
    height: 0;
    border: none;
    border-radius: 0 !important;
    background-color: rgba(70, 70, 70, 0.8);
    transition: all 1s;
  }

  .footer.open {
    display: flex;
    height: 20%;
    width: 100%;
    color: #FFF !important;
    margin-left: 0;
    align-items: center;
  }

  .profile-image {
    height: 5em;
    width: 5em;
    border-radius: 50%;
    object-fit: cover;
  }

  .card {
    /* width: 15%; */
    min-height: 200pt;
    min-width: 300pt;
    margin: 0pt;
    padding: 2pt 0;
    width: 120pt;
    height: 144pt;
    max-width: 120pt;
    max-height: 144pt;
    display: flex;
    border: none;
    border-radius: 0;

    background-color: #fafafa;
    box-shadow: 0.1rem 0.25rem 0.5rem rgba(0,0,0,0.25);
  }

  img {
    margin: 0;
    flex-basis: 1;
  }

</style>
