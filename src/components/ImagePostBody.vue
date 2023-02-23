<template>
    <div id="makeImagePostBody">
        <!-- Note: image/jpeg != image/jpg despite identical encoding. Ensure correct MIME is sent. -->
        <input v-if="!imageUploaded" type="file" accept="image/jpeg, image/png" @change="loadImage">
        <img v-else-if="imageUploaded" :src="loadedFile">
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      imageUploaded: false,
      loadedFile: ''
    }
  },
  methods: {
    loadImage (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        this.loadedFile = reader.result;
      }
      reader.readAsDataURL(file);
      this.imageUploaded = true;
      this.$emit('update:imageContent', this.imageBase64);
      this.$emit('update:imageType', this.imageMime);
    }
  },
  computed: {
    imageBase64 () {
      return this.loadedFile.replace('data:', '').replace(/^.+,/, '');
    },
    imageMime () {
      return this.loadedFile.replace('data:', '').match(/^.+,/);
    }
  }
}
</script>
