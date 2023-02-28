<template>
  <div id="makeImagePostBody">
    <!-- Note: image/jpeg != image/jpg despite identical encoding. Ensure correct MIME is sent. -->
    <input
      v-if="!imageUploaded"
      type="file"
      accept="image/jpeg,image/png"
      @change="loadImage"
    />
    <div v-else-if="imageUploaded" class="image-container">
      <img class="image-upload" :src="loadedFile" />
      <button class="btn image-cancel" @click="clearImage">x</button>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      imageUploaded: false,
      loadedFile: "",
    };
  },
  methods: {
    loadImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.loadedFile = reader.result;
        this.imageUploaded = true;
        this.$emit("update:image", this.loadedFile);
      };
      reader.readAsDataURL(file);
    },
    clearImage(event) {
      this.imageUploaded = false;
      this.loadedFile = "";
      event.src = "";
      this.$emit("update:image", this.loadedFile);
    },
  },
  computed: {
    imageBase64() {
      if (!this.loadedFile) {
        return "";
      }
      return this.loadedFile.replace("data:", "").replace(/^.+,/, "");
    },
    imageMime() {
      if (!this.loadedFile) {
        return "";
      }
      return this.loadedFile
        .replace("data:", "")
        .match(/^.+,/)[0]
        .replace(",", "");
    },
  },
  props: ["image"],
  emits: ["update:image"],
};
</script>

<style>
.image-upload {
  max-width: 100%;
  object-fit: contain;
  text-align: center;
  justify-content: center;
}

.image-cancel {
  position: absolute;
  top: 16pt;
  right: 8pt;
  border-radius: 50%;
  background-color: red;
}
</style>
