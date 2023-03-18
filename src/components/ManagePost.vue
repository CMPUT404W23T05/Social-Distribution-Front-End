<template>
  <div class="backdrop"></div>

  <div class="container">
    <button type="button" class="exit-btn" @click="$emit('endManage')">
      <i class="bi bi-x"></i>
    </button>

    <!-- Form -->
    <form action="gotothedesiredURL" method="POST">
      <input
        v-model="post.title"
        @update="setText"
        class="text-input"
        placeholder="Write a title for your post"
      />
      <!-- Radio buttons and markdown toggle -->
      <span class="form-toggles">
        <span id="privacySettings">
          <input disabled
            type="radio"
            name="privacy"
            id="private"
            value="PRIVATE"
            v-model="post.visibility"
          />
          <label for="private">Private</label>
          <input disabled
            type="radio"
            name="privacy"
            id="friendsonly"
            value="FRIENDS"
            v-model="post.visibility"
          />
          <label for="friendsonly">Friends Only</label>
          <input
            type="radio"
            name="privacy"
            id="public"
            value="PUBLIC"
            v-model="post.visibility"
          />
          <label for="public">Public</label>
        </span>
        <span>
          <input v-model="markdownEnabled" @change="setText" class="form-check-input" type="checkbox"/>
          <label class="form-check-label" for="markdown-toggle">{{ markDownMessage }}</label>
        </span>
      </span>

      <!-- Text/Image areas of post -->
      <textarea v-model="post.content" class=text-input placeholder="Give your post some body text!"></textarea>
      <ImagePostBody
        class="image-upload"
        :image="imageDataURL"
        @image-uploaded="(image) => setImage(image)"
        @image-clear="setImage(null)"
      />
      <input
        v-model="post.description"
        class="text-input"
        placeholder="Write an (optional) description here"
      />
    </form>

    <button type="submit" class="btn btn-outline-primary" @click="submitPost">
    Post <i class="bi bi-send-fill"></i>
    </button>
    <div class="error" v-show="badSubmit">{{ errorMessage }}</div>
  </div>
</template>

<script>
import ImagePostBody from '@/components/ImagePostBody.vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    ImagePostBody
  },
  data () {
    return {
      // Initialize a blank post
      post: {
        type: 'post',
        title: '',
        source: 'http://placeholderurlfornow.yummy/',
        origin: 'http://anotherplaceholderurlfornow.yucky/',
        description: '',
        contentType: [],
        content: '',
        image: null,
        count: 0,
        unlisted: false,
        visibility: 'PUBLIC', // Public by default for now
        author: this.author,
        // Generate when post is submitted
        comments: null, // url from server
        id: null,
        published: '2023-03-01T21:18:38.908794Z' // placeholder
      },
      // Used to validate the validaty of the post
      badSubmit: false,
      markdownEnabled: false
    }
  },
  props: ['author', 'existingPost'],

  computed: {
    titleLength () {
      return this.post.title.length
    },
    maxTitleLength () {
      return 30
    },
    validPost () {
      return this.titleLength < this.maxTitleLength && this.titleLength > 0 && (!!this.post.image || !!this.post.content)
    },
    errorMessage () {
      if (!this.post.title) {
        return 'Your post needs a title between 1 and 30 characters!'
      } else if (!this.post.image && !this.post.content) {
        return 'Your post needs text and/or an image!'
      } else return ''
    },
    contentTypeAsStr () {
      return this.post.contentType.toString()
    },
    imageDataURL () {
      if (this.existingPost && this.post.image) {
        const imageMime = this.post.contentType.find(type => type.includes('image'))
        // Template literals give undefined in child component
        return String.raw`data:${imageMime},${this.post.image}`
      } else {
        return null
      }
    },
    markDownMessage () {
      return this.markdownEnabled
        ? 'Markdown Enabled!'
        : 'Markdown Disabled'
    }
  },
  methods: {
    setText () {
      this.sanitizeContentTypes('text')
      this.appendMime(this.markdownEnabled ? 'text/markdown' : 'text/plain')
    },

    setImage (image) {
      this.sanitizeContentTypes('image')
      if (image) {
        this.post.image = image.raw64
        this.appendMime(image.mime)
      } else {
        this.post.image = null
      }
    },

    appendMime (mime) {
      this.sanitizeContentTypes(mime)
      if (mime) {
        this.post.contentType.push(mime)
      }
    },

    sanitizeContentTypes (mimeSuper) {
      // Helper function to remove an exisiting MIME type before pushing updated one
      this.post.contentType = this.post.contentType.filter(
        (contentType) => !contentType.includes(mimeSuper)
      )
    },

    submitPost () {
      if (this.validPost) {
        this.post.contentType = this.contentTypeAsStr
        console.table(this.post)

        if (this.existingPost) {
          console.log(this.post)
          console.log(`/authors/${this.post.author.id}/posts/${this.post.id}/`)
          axios
            .post(`/authors/${this.post.author.id}/posts/${this.post.id}/`, this.post)
            .then((res) => console.log(res))
            .catch((err) => {
              alert("Couldn't edit the post!")
              console.log(err)
            })
        } else {
          const uniqueID = uuidv4()
          this.post.id = uniqueID
          console.log(this.post)
          axios
            .post(`/authors/${this.post.author.id}/posts/create-post/`, this.post)
            .then((res) => console.log(res))
            .catch((err) => {
              alert("Couldn't make the post!")
              console.log(err)
            })
        }
        this.$emit('endManage')
      } else {
        this.badSubmit = true
      }
    }
  },
  mounted () {
    if (this.existingPost) {
      // Pass by value. (If user exits before submitting, do not update the existing post)
      this.post = structuredClone(this.existingPost)
      // Convert to array from string from backend
      this.post.contentType = this.post.contentType.split(',')
      if (this.post.contentType.includes('text/markdown')) {
        this.markdownEnabled = true
      }
    }
  },
  emits: ['endManage']
}
</script>

<style scoped>

.backdrop {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(0.5em) brightness(25%);
}

.exit-btn {
  position: absolute;
  top: -0.8em;
  right: 1em;
  border-radius: 50%;
  border: none;
  height: 1.5em;
  width: 1.5em;
  font-size: 1.5em;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  padding-top: 25pt;
  background-color: #fff;
  min-width: 50%;
  max-width: 30rem;
  border-radius: 5pt;
  padding: 2em;
}

.text-input {
  width: 100%;
  resize: none;
  border-radius: 0;
  box-sizing: content-box;
}

.form-toggles {
  display: flex;
}

.markdown-toggle {
  justify-self: flex-end;
}

.btn {
  width: 10em;
  text-transform: capitalize;
  color:#4998f5;
  border-radius: 0pt;
}

*:focus {
  outline: none;
  border: 2pt solid #4998f5;
  border-radius: 0pt;
}

/* All this for just textarea smh */

textarea {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  min-height: 8em;
  overflow: hidden;
}

textarea:focus {
  min-height: 30em;
  display: block;
  overflow: auto;
}

textarea::-webkit-scrollbar-thumb {
  background-color: #4998f5;
}

input, textarea {
  box-shadow: none;
  border-style: none;
  border: 2pt solid #dadada;
  transition: all 0.4s;
  resize: none;
}

</style>
