<template>
  <!-- TODO: Refactor so that existing posts can be passed in as props and re-use this interface -->
  <div class="container col-6">
    <form action="gotothedesiredURL" method="POST">

      <input v-model="title" class='text-input' placeholder = "Write a title for your post">
      <span id="privacySettings">
        <input type="radio" name="privacy" id="private" value="private" v-model="privacySetting">
        <label for="private">Private</label>
        <input type="radio" name="privacy" id="friendsonly" value="friends" v-model="privacySetting">
        <label for="private">Friends Only</label>
        <input type="radio" name="privacy" id="public" value="public" v-model="privacySetting">
        <label for="private">Public</label>
      </span>

      <TextPostBody class ='text-input' v-model:body="textContent" v-model:toggle="markDownEnabled"/>
      <ImagePostBody class = 'image-upload' @update:image="(image) => imageURL64 = image"/>

    </form>
    <button class="btn">Post</button>
  </div>
</template>

<script>
import TextPostBody from '@/components/TextPostBody.vue'
import ImagePostBody from '@/components/ImagePostBody.vue'

export default {
  data () {
    return {
      title: '',
      textContent: '',
      markDownEnabled: false,
      imageURL64: '',
      privacySetting: 'private'
    }
  },
  computed: {
    contentTypes () {
      const contentTypes = []

      if (this.textContent && this.markDownEnabled) {
        contentTypes.push('text/markdown')
      } else if (this.textContent && !this.markDownEnabled) {
        contentTypes.push('text/plain')
      }

      if (this.imageMime) {
        contentTypes.push(this.imageMime)
      }

      return contentTypes
    },
    rawImage64 () {
      if (!this.imageURL64) {
        return ''
      }
      else {
        return this.imageURL64.replace('data:', '').replace(/^.+,/, '')
      }
    },
    imageMime () {
      if (!this.imageURL64) {
        return ''
      }
      else {
        return this.imageURL64.replace('data:', '').match(/^.+,/)[0].replace(',', '')
      }
    }
  },
  props: ['author'],
  components: {
    TextPostBody,
    ImagePostBody
  },
  methods: {

  },
  created () {
    // TODO: Receive JSON from backend and unpack

  },
  unmounted () {
    // TODO: Pack and send JSON to backend

  }
}
</script>

<style>

  .container {
    padding-top: 25pt;
  }

  .active {
    background-color: #4998F5;
    color: white;
  }

  .text-input {
    width: 100%;
    resize: none;
    border-radius: 0;
  }

  .btn {
    width: 50%;
    text-transform: capitalize;
    border-bottom: 2pt solid #4998F5;
  }
</style>
