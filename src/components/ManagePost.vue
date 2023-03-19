<template>
  <div class="backdrop"></div>

  <div class="container">
    <div class="modal-header mb-3">
      <h5 class="modal-title"> {{managePostMessage}} </h5>
      <button type="button" class="close exit-btn" @mousedown="$emit('endManage')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <!-- Form -->
    <form action="gotothedesiredURL" method="POST" class="modal-body">
      <span class="title-totality">
        <input
          v-model="post.title"
          @update="setText"
          :maxlength="maxTitleLength"
          class="post-title text-input form-control"
          placeholder="Write a title for your post"
        />
        <span class="title-length-display"> {{ titleLength }} /{{ maxTitleLength }} </span>
      </span>
      <!-- Radio buttons and markdown toggle -->
      <span class="form-toggles mb-3">
        <span class="privacy-settings">
          <span class="privacy-setting-single">
            <input disabled
              type="radio"
              name="privacy"
              class="form-check-input"
              id="private"
              value="PRIVATE"
              v-model="post.visibility"
            />
            <label for="private" class="form-check-label">Private</label>
          </span>
          <span class="privacy-setting-single">
            <input disabled
              type="radio"
              name="privacy"
              class="form-check-input"
              id="friendsonly"
              value="FRIENDS"
              v-model="post.visibility"
            />
            <label for="friendsonly" class="form-check-label">Friends Only</label>
          </span>
          <span class="privacy-setting-single">
            <input
              type="radio"
              name="privacy"
              class="form-check-input"
              id="public"
              value="PUBLIC"
              v-model="post.visibility"
            />
            <label for="public" class="form-check-label">Public</label>
          </span>
        </span>
        <span class="form-check form-switch markdown-setting">
          <input v-model="markdownEnabled" @change="setText" id="markdown-toggle" class="form-check-input" type="checkbox"/>
          <label class="form-check-label" for="markdown-toggle"><i class="bi bi-markdown-fill"></i> {{ markDownMessage }}</label>
        </span>
      </span>

      <!-- Text/Image areas of post -->
      <textarea v-model="post.content" class="text-input form-control" placeholder="Give your post some body text!"></textarea>
      <ImagePostBody
        class="image-upload"
        :image="imageDataURL"
        @image-uploaded="(image) => setImage(image)"
        @image-clear="setImage(null)"
      />
      <input
        v-model="post.description"
        class="text-input form-control mb-3"
        placeholder="Write an (optional) description here"
      />
    </form>
    <!-- Using @click listener instead actually listens for mouseup, which doesn't trigger when the textarea -->
    <!-- is resized on unfocus, requiring two clicks to trigger the submit when textarea is focused -->
    <button type="submit" class="btn btn-outline-primary md-1" @mousedown="submitPost">
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
      return 100
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
    },
    managePostMessage () {
      return this.existingPost
        ? 'Edit Your Post!'
        : 'Make A New Post!'
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
  height: 1.5em;
  width: 1.5em;
  font-size: 1.5em;
  padding: 0;
  line-height: 0;
  background-color: #FFF;
  border: none;
  font-size: 1.5em;
  transition: 0.4s;
}

.exit-btn:hover {
  color: #f51212;
  text-shadow: 0 0 5pt red;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  padding: 1rem;
  background-color: #fff;
  min-width: 50%;
  max-width: 30rem;
  border-radius: 0.5rem;
}

.container.open {
  height: auto;
}

.text-input {
  width: 100%;
  resize: none;
}

.form-toggles {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  width: 10em;
  text-transform: capitalize;
  color:#4998f5;
}

.form-check-input {
  margin: 0 0.35rem;
}

textarea {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  min-height: 8em;
  overflow: hidden;
}

textarea:focus {
  min-height: 20em;
  display: block;
  overflow: auto;
}

input, textarea {
  box-shadow: none;
  border-style: none;
  border: 1pt solid #c4c4c4;
  transition: all 0.4s;
  resize: none;
  border-radius: 0.375rem;
}

.image-upload {
  height: 15em;
  padding: 1em 0;
}

.title-length-display {
  width: 100%;
  text-align: right;
  font-size: 0.75em;
}

.privacy-settings {
  gap: 0.5em;
}

.privacy-setting-single, .markdown-setting, .privacy-settings {
  display: flex;
  align-items: center;
}

</style>
