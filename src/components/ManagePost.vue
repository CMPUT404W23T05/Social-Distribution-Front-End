<template>
  <!-- TODO: Refactor so that existing posts can be passed in as props and re-use this interface -->
  <div class="container col-6">
    <button type="button" class="exit" @click="$emit('endManage')">X</button>
    <form action="gotothedesiredURL" method="POST">
      <input
        v-model="post.title"
        class="text-input"
        placeholder="Write a title for your post"
      />
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

      <TextPostBody
        class="text-input"
        :body="post.content"
        :toggle="markdownEnabled"
        @change-text-post="(text) => setText(text)"
      />
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

    <button type="submit" class="btn btn-primary" @click="submitPost">Post</button>
    <div class="error" v-show="badSubmit">{{ errorMessage }}</div>
  </div>

  <div class="backdrop"></div>
</template>

<script>
import TextPostBody from '@/components/TextPostBody.vue'
import ImagePostBody from '@/components/ImagePostBody.vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    TextPostBody,
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
        visibility: 'PRIVATE',
        author: this.author,
        // Generate when post is submitted
        comments: null, // url from server
        id: null,
        published: '2023-03-01T21:18:38.908794Z' // placeholder
      },
      // Used to validate the validaty of the post
      badSubmit: false
    }
  },
  props: ['author', 'existingPost'],

  computed: {
    validPost () {
      const length = this.post.title.length
      return length <= 30 && length > 0 && (this.post.image || this.post.content)
    },
    errorMessage () {
      if (!this.post.title) {
        return 'Your post needs a title between 1 and 30 characters!'
      } else if (!this.post.image && !this.post.content) {
        return 'Your post needs text and/or an image!'
      } else return ''
    },
    markdownEnabled () {
      return this.post.contentType.includes('text/markdown')
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
    }
  },
  methods: {
    setText (text) {
      this.post.content = text.body
      this.sanitizeContentTypes('text')
      this.appendMime(text.mime)
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
      this.post = structuredClone(this.existingPost)
      // Convert to array from string from backend
      this.post.contentType = this.post.contentType.split(',')
    }
  },
  emits: ['endManage']
}
</script>

<style scoped>
div .container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.container {
  padding-top: 25pt;
  background-color: #fff;
  border-radius: 5pt;
}

.text-input {
  width: 100%;
  resize: none;
  border-radius: 0;
}

.btn {
  width: 50%;
  text-transform: capitalize;
  border-bottom: 2pt solid #4998f5;
}
</style>
