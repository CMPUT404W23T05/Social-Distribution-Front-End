<template>
  <div class="card-body card">
    <h3 class="post-title">{{ post.title }}</h3>
    <div class="content-container">
      <p class="text-content" v-if="post.content">{{ post.content }}</p>
      <img
        class="image-content"
        v-if="post.image"
        :src="post.image"
        :alt="post.description"
      />
    </div>
    <span class="footer card-footer text-muted">
      <img
        class="profile-image"
        :src="author.profile_image"
        :alt="author.profile_name"
      />
      <h4 id="username">@{{ author.display_name }}</h4>
      <span
        class="content-types"
        v-for="content in post.ContentTypes"
        :key="content"
        >{{ content }}</span
      >
    </span>
  </div>
</template>

<script>
export default {
  //doAction is an optional event handler (i.e edit post, open as view, etc.)
  props: ["author", "post"],
};
</script>

<style scoped>
.post-title {
  font-size: 16pt;
  white-space: nowrap;
  overflow: hidden;
}

.content-container {
  display: flex;
  height: 140pt;
  text-align: left;
  align-items: center;
  justify-content: space-evenly;
}

.image-content {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.text-content {
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 5pt;
}

.footer {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 32pt;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: scale-down;
}

.card {
  width: 15%;
  min-width: 300pt;
}
</style>
