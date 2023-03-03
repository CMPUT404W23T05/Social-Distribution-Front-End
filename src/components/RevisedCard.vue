<template>
  <div
    class="card-body card"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <h3 class="post-title">{{ post.title }}</h3>
    <div class="content-container">
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
        :src="post.image"
        :alt="post.description"
      />
    </div>
    <span :class="{ open: hovered }" class="footer card-footer text-muted">
      <slot name="footer">
        <img
          class="profile-image"
          :src="author.profile_image"
          :alt="author.profile_name"
        />
        <h6 id="username">@{{ author.display_name }}</h6>
        <span
          class="content-types"
          v-for="content in post.ContentTypes"
          :key="content"
          >{{ content }}
        </span>
      </slot>
    </span>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'

export default {
  // doAction is an optional event handler (i.e edit post, open as view, etc.)
  props: ['author', 'post'],
  data () {
    return {
      hovered: false
    }
  },
  computed: {
    markdownEnabled () {
      return this.post.contentTypes.includes('text/markdown')
    }
  },
  components: { VueMarkdown }
}
</script>

<style scoped>
.post-title {
  font-size: 16pt;
  white-space: nowrap;
  overflow: hidden;
}

.content-container {
  display: flex;
  height: 140pt;
  text-align: left;
  align-items: center;
  justify-content: space-evenly;
}

.image-content {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.text-content {
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
}

.footer {
  display: none;
  position: absolute;
  bottom: 0;
  height: 0;
  transition: all 1s;
}

.footer.open {
  display: flex;
  height: 25%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  margin-left: 0;
  justify-content: space-evenly;
}

.profile-image {
  width: 32pt;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: scale-down;
}

.card {
  width: 15%;
  min-width: 200pt;
  max-width: 300pt;
  margin: 5pt;
  padding: 5pt 0;
}
</style>
