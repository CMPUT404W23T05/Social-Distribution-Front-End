<template>
  <div id="makeImagePostBody">
    <!-- Note: image/jpeg != image/jpg despite identical encoding. Ensure correct MIME is sent. -->
    <input
      v-if="!imageUploaded"
      type="file"
      accept="image/jpeg,image/png"
      @change="encodeFileBase64($event.target.files[0])"
    />
    <div v-else class="image-container">
      <img class="image-upload" :src="imageSrc" />
      <button type="button" class="btn image-cancel" @click="clearImage">x</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['image'],
  emits: ['image-uploaded', 'image-clear'],

  data () {
    return {
      imageSrc: null
    }
  },
  computed: {
    imageUploaded () {
      return this.imageSrc !== null
    },
    imageEncoded () {
      // return data portion of dataURl (e.g AwQQr8aPoiw910gmcM...)
      return this.imageUploaded
        ? this.imageSrc.replace('data:', '').replace(/^.+,/, '')
        : null
    },
    imageMime () {
      // return image/<type>;base64
      return this.imageUploaded
        ? this.imageSrc.replace('data:', '').match(/^.+,/)[0].replace(',', '')
        : null
    }
  },
  watch: {
    image: {
      immediate: true,
      handler (newValue) {
        this.imageSrc = newValue
      }
    }
  },

  methods: {
    encodeFileBase64 (file) {
      // Converts an image from a file scheme (e.g file:local/myfiles/myfile.jpg) to its base64 dataURL
      console.log(file)
      this.blobToBase64(file)
    },
    encodeURLBase64 (url) {
      // Not used for now since image field is raw64
      // Converts an image from an http scheme (e.g http://127.0.0.1/api/image/...) to its base64 dataURL
      axios.get(url, { responseType: 'blob' })
        .then(res => {
          console.log('Got blob!')
          this.blobToBase64(res.data)
        })
        .catch(err => {
          this.imageSrc = null
          console.log("The image provided from server couldn't be loaded")
          console.log(err)
        })
    },
    blobToBase64 (blob) {
      // Takes an arbitrary source (e.g file://images/etc OR http://myimageserver/image.jpg) and returns it as a data URL (data:image/jpeg;base64,<stuff>)
      // See: https://stackoverflow.com/questions/41846669/download-an-image-using-axios-and-convert-it-to-base64
      const reader = new FileReader()
      reader.onloadend = () => {
        //  Returning the value will not change the data value
        this.imageSrc = reader.result
        this.emitImageStatus()
      }
      reader.readAsDataURL(blob)
    },
    clearImage () {
      this.$emit('imageClear')
      this.imageSrc = null
    },
    emitImageStatus () {
      this.$emit('imageUploaded', {
        source: this.imageSrc, // This goes in the image tag src
        mime: this.imageMime,
        raw64: this.imageEncoded //  This is what's sent to server
      })
    }
  }
}
</script>

<style>
.image-upload {
  max-width: 100pt;
  max-height: 100pt;
  object-fit: scale-down;
  text-align: center;
  justify-content: center;
  border-radius: 3pt;
}

.image-cancel {
  position: relative;
  bottom: 100pt;
  left: 50pt;
  border-radius: 50%;
  background-color: red;
}
</style>
