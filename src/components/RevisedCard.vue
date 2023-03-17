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
            :class="{ open: hovered }"
            :src="author.profileImage"
            :alt="author.profileName"
          />
          <h6 id="username" v-if="hovered">
          @{{ author.displayName }}
          </h6>
          <!-- <span
            class="content-types"
            v-for="content in post.ContentType"
            :key="content"
            >{{ content }}
          </span> -->
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
    height: 0;
    width: 100%;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
    transition: ease-in-out 0.4s
  }

  .scrim.open {
    height: 100%;
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
    display: flex;
    float: bottom;
    position: absolute;
    bottom: 0;
    height: 0;
    border: none;
    width: 100%;
    border-radius: 0 !important;
    background-color: rgba(70, 70, 70, 1);
    transition: ease-in 0.4s;
    align-items: center;
  }

  .footer.open {
    height: 20%;
    color: #FFF !important;
    background-color: rgba(70,70,70, 0.8);
    margin-left: 0;
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

    background-color: #fafafa;
    box-shadow: 0.1rem 0.25rem 0.5rem rgba(0,0,0,0.25);
  }

  h6 {
    line-height: 0;
  }

</style>
