<!-- Extends Generic Card (but gets its own component as it too appears in multiple views) -->

<template>
  <GenericCard
  v-if="!loading"
  @hovered="hovered=true"
  @unhover="hovered=false"
  :title="post.title"
  :anchor="{ name: 'postpage', params: { aid: this.author._id, pid: this.post._id}, query : { hostURL: this.post.id} }"
  role="button">

    <template #card-content>
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
        :src="imageSrc"
        :alt="post.description"
      />
    </template>

    <!-- This content can also change depending on the post card -->
    <template #footer>
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
        </slot>
    </template>
  </GenericCard>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'
import GenericCard from './GenericCard.vue'
import { getAxiosTarget, pathOf } from '@/util/axiosUtil'

export default {
  // doAction is an optional event handler (i.e edit post, open as view, etc.)
  components: { VueMarkdown, GenericCard },
  props: ['author', 'post'],
  async created () {
    await this.getImage()
    this.loading = false
  },

  data () {
    return {
      hovered: false,
      loading: true,
      imageSrc: null // Assign once created
    }
  },
  computed: {
    markdownEnabled () {
      return this.post.contentType?.includes('text/markdown')
    },
    hasImage () {
      return this.post.contentType?.includes('image')
    },
    hasContent () {
      return this.post.contentType?.includes('text')
    },
    imageURL () {
      return `${pathOf(this.post.id)}/image`
    },
    isSingleton () {
      return (!!this.hasImage && !this.hasContent) || (!this.hasImage && !!this.hasContent)
    }
  },

  methods: {
    async getImage () {
      if (this.hasImage) {
        const hostNode = getAxiosTarget(this.post.id)

        const postPath = new URL(this.post.id).pathname.replace(/^\/api\//, '')

        hostNode.get(`${postPath}/image`, { responseType: 'blob' })
          .then((res) => {
            const blob = new Blob([res.data], { type: this.imageMime })
            this.imageSrc = URL.createObjectURL(blob)
          })
          .catch((err) => {
            console.log(err)
            this.imageSrc = 'https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg'
          })
      }
    }
  }
}
</script>

<style scoped>
  .image-content {
    max-width: 100%;
    min-height: 100%;
    object-fit: cover;
    overflow: hidden;
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

  h6 {
    line-height: 0;
  }

</style>
