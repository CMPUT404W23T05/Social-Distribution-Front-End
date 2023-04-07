<template>
  <div class="modal fade bd-example-modal-lg" ref="managePost" id="managePost" tabindex="-1" role="dialog" aria-labelledby=":3" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitleMode }}  <strong>{{ modalTitlePostName }}</strong></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" ref="Close" aria-label="Close" @mousedown="$emit('dismiss')">
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div class="modal-body">
          <form>
            <!-- Post Title -->
            <div class="form-group">
              <label for="post-title" class="d-flex justify-content-left" aria-autocomplete="off">Post Title</label>
              <input v-model="post.title" type="text" class="form-control" id="post-title" aria-describedby="postTitle" placeholder="Write a title for your post"/>
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
                  <label class="form-check-label" for="markdown-toggle">
                    <i class="bi-markdown-fill"></i>
                     Use Markdown
                  </label>
                </div>
              </div>
            </div>

            <div v-if="post.visibility == 'PRIVATE'" class="mb-2">
              <!-- <button type="button" class="btn btn-primary btn-sm" @click="selectAuthor(author)">select</button> -->
              <label for="follower-list" class="d-flex justify-content-left" aria-autocomplete="off">Share with your Followers</label>
              <ul id="follower-list" class="list-group">
                <li class="list-group-item d-flex justify-content-start" v-for="follower, index in followers" :key="follower.id">
                  <input class="form-check-input me-1" type="checkbox" value="" aria-label="..." :id="follower.id" @change="updateSelected(follower, index)">
                  <label :for="follower.id" class="mx-3"> <strong>{{ follower.displayName }}</strong> ({{ follower.host }})</label>
                </li>
              </ul>
            </div>

            <!-- Textbody -->
            <textarea v-model="post.content" @input="setText" class="text-input form-control" placeholder="Give your post some body text"></textarea>

            <!-- Image custom component-->
            <ImagePostBody class="image-upload" :image="imageDataURL" @image-uploaded="(image) => setImage(image)" @image-clear="setImage(null)"/>

            <!-- Description -->
            <input v-model="post.description" class="text-input form-control mb-3" placeholder="Write an (optional) description here"/>

            <!-- Tag system -->
            <div>
              <!-- Won't error on posts w/o categories -->
              <span v-for="tagVal, index in this.post?.categories" :key="index">
                <span class="tag badge rounded-pill border border-primary text-primary mx-1">
                  {{ tagVal }}
                  <button type="button" class="btn btn-close clear-tag-button" @click="removeTag(index)"></button>
                </span>
              </span>
            </div>
            <input @keyup.enter="addTag($event)" placeholder="Add a tag (ENTER to save)" class="text-input form-control mt-2"/>

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
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  components: { ImagePostBody },
  props: ['existingPost'], // Create pass-by-value copy to avoid mutating original post
  emits: ['createPost', 'editPost', 'dismiss', 'createPrivatePost'],
  data () {
    return {
      // Initialize a default post
      post: null,
      markDownEnabled: false,
      invalidSubmit: false,
      followers: [],
      sessionAuthor: [],
      selectedFollowers: []
    }
  },
  computed: {
    ...mapStores(useUserStore),

    modalTitleMode () {
      return this.existingPost
        ? 'Edit'
        : 'Make a'
    },

    modalTitlePostName () {
      return this.existingPost
        ? this.existingPost.title
        : 'New Post'
    },

    titleMaxLength () {
      return 30
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
    this.getAuthorFromStore()
    this.getFollowers()
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
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.sessionAuthor = userStore.user.author
    },

    updateSelected (author, index) {
      !this.selectedFollowers.includes(author) ? this.selectedFollowers.push(author) : this.selectedFollowers.splice(index, 1)
    },

    getFollowers () {
      this.$localNode.get(`/authors/${this.sessionAuthor._id}/followers/`)
        .then(response => {
          console.log(response)
          this.followers = response.data.items
        })
        .catch(function (err) {
          console.log(err)
        })
    },

    addTag (event) {
      this.post.categories.push(event.target.value)
      event.target.value = '' // Clear
    },
    removeTag (index) {
      this.post.categories.splice(index, 1)
    },
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
        source: 'https://social-t30.herokuapp.com',
        origin: 'https://social-t30.herokuapp.com',
        description: '',
        contentType: [],
        content: '',
        image: null,
        categories: [],
        count: 0,
        unlisted: false,
        visibility: 'PUBLIC', // Public by default for now
        author: this.author,
        // Generate when post is submitted
        comments: null, // url from server
        id: null,
        _id: null,
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
      // Helper function to remove an existing MIME type before pushing updated one
      this.post.contentType = this.post.contentType.filter(
        (contentType) => !contentType.includes(mimeSuper)
      )
    },

    submitPost () {
      // Emit post back to parent for respective AJAX call
      if (this.errors.length === 0) {
        // Re-format to to spec format
        this.post.contentType = this.post.contentType.toString()
        // console.table(this.post)

        this.$refs.Close.click()
        if ((this.existingPost)) {
          this.$emit('editPost', this.post)
          this.$emit('dismiss')
        } else {
          this.$emit('createPost', this.post)
          this.$emit('dismiss')
        }
        if (this.post.visibility === 'PRIVATE') {
          console.log('private post made')
          this.$emit('createPrivatePost', { post: this.post, authors: this.selectedFollowers })
        }
      } else {
        this.invalidSubmit = true
      }
    }
  }
}

</script>

<style scoped>

  .rounded-pill {
    min-width: 2rem;
  }

  .clear-tag-button {
    /* Shrink size of x per tag */
    font-size: 0.8em;
  }
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

strong {
  color: #4998F5;
}

</style>
