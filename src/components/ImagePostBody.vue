<template>
  <div id="makeImagePostBody">
    <!-- Note: image/jpeg != image/jpg despite identical encoding. Ensure correct MIME is sent. -->
    <div v-if="!imageUploaded" class="image-upload-wrapper image-container">
      <div class = "wrapper-text">
        <i class="bi bi-upload"></i>
        <small>Upload an image</small>
      </div>
      <!-- Actual functionality -->
        <input
          type="file"
          accept="image/jpeg,image/png"
          class="image-container"
          @change="encodeFileBase64($event.target.files[0])"
        />
    </div>
    <div v-else class="image-container">
      <img class="image-upload img-fluid" :src="imageSrc" />
      <button type="button" class="btn image-cancel" @click="clearImage">
        <i class="bi bi-x-lg"></i>
      </button>
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

<style scoped>

.image-container {
  width: 100%;
  height: 100%;
}

.image-cancel {
  position: relative;
  width: 1.5em;
  height: 1.5em;
  /* Sussy position, but it gets the job done on all images. */
  left: -2.5em;
  top: -42%;
  padding: 0;
  line-height: 0;
  border-radius: 50%;
  border: 2pt #FFF solid;
  background-color: rgba(68, 68, 68, 0.8);
  color: #FFF;
  transition: 0.4s;
}

.image-cancel:hover {
  color: #f51212;
  text-shadow: 0 0 5pt red;
}

/* File inputs are notoriously hard to style - style wrapper instead */
input[type=file] {
  opacity: 0;
}
.image-upload-wrapper {
  border: 2pt solid #dadada;
}

.wrapper-text {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #afafaf;
  font-size: 0.8em;
}

.image-upload {
  max-height: 100%;
  width: auto
}

.wrapper-text:hover {
  color: #f51212;
}

.bi-upload {
  font-size: 3.6em;
}

</style>
