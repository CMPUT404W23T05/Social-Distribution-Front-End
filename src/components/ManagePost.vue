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
      <ImagePostBody class = 'image' v-model:imageContent="imageContent" v-model:imageMime="imageType"></ImagePostBody>

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
      imageContent: '',
      imageType: '',
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

      // Images
      return contentTypes
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
