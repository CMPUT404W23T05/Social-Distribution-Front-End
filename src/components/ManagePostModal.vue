<template>
  <div class="modal fade bd-example-modal-lg" ref="managePost" id="managePost" tabindex="-1" role="dialog" aria-labelledby=":3" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" ref="Close" aria-label="Close" @mousedown="$emit('dismiss')">
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div class="modal-body">
          <form>
            <!-- Post Title -->
            <div class="form-group">
              <label for="post-title" class="d-flex justify-content-left" aria-autocomplete="off">Post Title</label>
              <input v-model="post.title" type="text" class="form-control" id="post-title" aria-describedby="postTitle" placeholder="Something fun goes here!"/>
              <small class="d-flex justify-content-center form-text text-muted"> {{ post.title.length }}/{{ titleMaxLength }} </small>
            </div>

            <!-- Privacy Settings and Markdown Setting-->
            <div class="row">
              <!-- Privacy -->
              <div class="col">
                <div class="form-check form-check-inline">
                  <input v-model="post.visibility" id="privacy-private" class="form-check-input" type="radio" value="PRIVATE"/>
                  <label for="privacy-private" class="form-check-label">Private</label>
                </div>
                <div class="form-check form-check-inline">
                  <input v-model="post.visibility" id="privacy-friends" class="form-check-input" type="radio" value="FRIENDS"/>
                  <label for="privacy-friends" class="form-check-label">Friends</label>
                </div>
                <div class="form-check form-check-inline">
                  <input v-model="post.visibility" id="privacy-public" class="form-check-input" type="radio" value="PUBLIC"/>
                  <label for="privacy-public" class="form-check-label">Public</label>
                </div>
              </div>
              <!-- Markdown setting -->
              <div class="col">
                <div class="form-check form-switch d-flex justify-content-center gap-3 mb-2">
                  <input v-model="markDownEnabled" @change="setText" id="markdown-toggle" class="form-check-input pr-2" type="checkbox"/>
                  <label class="form-check-label" for="markdown-toggle"><i class="bi bi-markdown-fill"></i> {{ markDownMessage }}</label>
                </div>
              </div>
            </div>

            <!-- Textbody -->
            <textarea v-model="post.content" class="text-input form-control" placeholder="Give your post some body text!"></textarea>

            <!-- Image custom component-->
            <ImagePostBody class="image-upload" :image="imageDataURL" @image-uploaded="(image) => setImage(image)" @image-clear="setImage(null)"/>

            <!-- Description -->
            <input v-model="post.description" class="text-input form-control mb-3" placeholder="Write an (optional) description here"/>

            <div class="modal-footer">
              <div v-if="invalidSubmit" class="error-container">
                <small v-for="error in errors" :key="error" class="error-message text-danger" :class="{visible: invalidSubmit}">{{ error + " "}} </small>
              </div>
              <button type="button" class="btn btn-outline-primary" @mousedown="submitPost">Post <i class="bi bi-send-fill"></i></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ImagePostBody from '@/components/ImagePostBody.vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: { ImagePostBody },
  props: ['existingPost'], // Create pass-by-value copy to avoid mutating original post
  emits: ['createPost', 'editPost', 'dismiss'],
  data () {
    return {
      // Initialize a default post
      post: null,
      markDownEnabled: false,
      invalidSubmit: false
    }
  },
  computed: {
    modalTitle () {
      return this.existingPost
        ? 'Edit Your Post!'
        : 'Make A New Post!'
    },
    titleMaxLength () {
      return 30
    },
    markDownMessage () {
      return this.markDownEnabled
        ? 'Markdown Enabled!'
        : 'Markdown Disabled'
    },
    errors () {
      const messages = []

      if (this.post.title.length > this.titleMaxLength || this.post.title.length === 0) {
        messages.push('Your post needs a title between 1 and 30 characters!')
      }
      if (!this.post.image && !this.post.content) {
        messages.push('You need text and/or image content!')
      }
      return messages
    },
    imageDataURL () {
      if (this.existingPost && this.post.image) {
        const imageMime = this.post.contentType.find(contentType => contentType.includes('image'))
        // Template literals give undefined in child component
        return String.raw`data:${imageMime},${this.post.image}`
      } else {
        return null
      }
    }
  },

  created () {
    this.post = this.getTemplate()
  },

  mounted () {
    const modalEl = this.$refs.managePost
    modalEl.addEventListener('show.bs.modal', () => {
      // Load a copy of an existing post if supplied
      if (this.existingPost) {
        this.post = structuredClone(this.existingPost)
        // Convert from contentType backend string-representation to an iterable
        this.post.contentType = this.post.contentType.split(',')
        if (this.post.contentType.includes('text/markdown')) {
          this.markDownEnabled = true
        }
      } else {
        this.post = this.getTemplate()
      }
    })

    modalEl.addEventListener('hidden.bs.modal', () => {
      // Clear form
      this.post = this.getTemplate()
    })
  },
  methods: {
    setText () {
      this.sanitizeContentTypes('text')
      this.appendMime(this.markDownEnabled ? 'text/markdown' : 'text/plain')
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

    getTemplate () {
      return {
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
      console.log('emittting!')
      // Emit post back to parent for respective AJAX call
      if (this.errors.length === 0) {
        // Re-format to to spec format
        this.post.contentType = this.post.contentType.toString()
        console.table(this.post)

        this.$refs.Close.click()
        if (this.existingPost) {
          this.$emit('editPost', this.post)
          this.$emit('dismiss')
        } else {
          this.post.id = uuidv4()
          this.$emit('createPost', this.post)
          this.$emit('dismiss')
        }
      } else {
        this.invalidSubmit = true
      }
    }
  }
}

</script>

<style>
  textarea.text-input {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  min-height: 8em;
  overflow: hidden;
  transition: 0.4s;
  resize: none;
}

textarea.text-input:focus {
  min-height: 15em;
  display: block;
  overflow: auto;
}

.image-upload {
  height: 20em;
  padding: 1em 0;
}

</style>
