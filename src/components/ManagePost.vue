<template>
  <!-- TODO: Refactor so that existing posts can be passed in as props and re-use this interface -->
  <div class="container col-6">
    <form action="gotothedesiredURL" method="POST">
      <input
        v-model="post.title"
        class="text-input"
        placeholder="Write a title for your post"
      />
      <span id="privacySettings">
        <input
          type="radio"
          name="privacy"
          id="private"
          value="private"
          v-model="post.visibility"
        />
        <label for="private">Private</label>
        <input
          type="radio"
          name="privacy"
          id="friendsonly"
          value="friends"
          v-model="post.visibility"
        />
        <label for="private">Friends Only</label>
        <input
          type="radio"
          name="privacy"
          id="public"
          value="public"
          v-model="post.visibility"
        />
        <label for="private">Public</label>
      </span>

      <TextPostBody
        class="text-input"
        :body="post.textContent"
        :toggle="markDownEnabled"
        @change-text-post="({ body, toggle }) => setText(body, toggle)"
      />
      <ImagePostBody
        class="image-upload"
        @update:image="(imageSrc) => setImage(imageSrc)"
      />
      <input
        v-model="post.description"
        class="text-input"
        placeholder="Write an (optional) description here"
      />
    </form>

    <button class="btn">Post</button>
  </div>
</template>

<script>
import TextPostBody from "@/components/TextPostBody.vue";
import ImagePostBody from "@/components/ImagePostBody.vue";
import axios from "axios";

export default {
  data() {
    return {
      // Initialize a blank post
      post: {
        objectType: "post",
        title: "",
        postSource: "",
        postOrigin: "",
        description: "",
        contentTypes: [],
        textContent: "",
        imageContent: "",
        commentCount: 0,
        comments: [],
        isUnlisted: false,
        visibility: "private",
        // Generate when post is submitted
        postId: null,
        pubDate: null,
      },
      // Won't appear in contentTypes until post is made to validate that text is entered
      // Otherwise a purely image-post may erroneously have type text/markdown
      markDownEnabled: false,
    };
  },
  props: ["author", "isExistingPost"],
  components: {
    TextPostBody,
    ImagePostBody,
  },
  methods: {
    setImage(imageSrc) {
      // data:img/jpeg;base64=..
      this.sanitizeContentTypes("image");

      if (imageSrc === "") {
        this.post.imageContent = imageSrc;
      } else {
        // a2Wt29qw021t...
        this.post.imageContent = imageSrc
          .replace("data:", "")
          .replace(/^.+,/, "");

        const imageMimeType = imageSrc
          .replace("data:", "")
          .match(/^.+,/)[0]
          .replace(",", "");
        // img/jpeg;base64
        this.post.contentTypes.push(imageMimeType);
      }
    },
    setText(body, toggle) {
      this.post.textContent = body;
      this.sanitizeContentTypes("text");
      if (body && toggle) {
        this.post.contentTypes.push("text/markdown");
      } else if (body && !toggle) {
        this.post.contentTypes.push("text/plain");
      }
    },

    fetchData() {
      axios.get(URL).then((response) => (this.post = response));
      this.markdownEnabled = this.post.contentTypes.includes("text/markdown");
    },

    sanitizeContentTypes(substring) {
      // Helper function to remove an exisiting MIME type before pushing updated one
      this.post.contentTypes = this.post.contentTypes.filter(
        (contentType) => !contentType.includes(substring)
      );
    },
  },
  mounted() {
    if (this.isExistingPost) {
      this.fetchData();
    }
  },
};
</script>

<style>
.container {
  padding-top: 25pt;
}

.active {
  background-color: #4998f5;
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
  border-bottom: 2pt solid #4998f5;
}
</style>
