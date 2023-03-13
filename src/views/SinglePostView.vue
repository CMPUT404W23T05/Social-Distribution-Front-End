<template>
    <!-- Components: Post, Comments list, profile picture -->
    <PostProper v-if="!loading" :post="postData"></PostProper>
    <!-- Idk if the sidebar for liiking, commenting, etc should be a component, or unique to this page -->
</template>

<script>
import PostProper from '@/components/viewPostComponents/SinglePost.vue'
import axios from 'axios'

export default {
  components: { PostProper },
  mounted () {
    // Get the post and author
    const pid = this.$route.params.pid
    const aid = this.$route.params.aid

    this.getData(pid, aid)
  },
  computed: {
    loading () {
      return (!this.authorData || !this.postData)
    }
  },
  data () {
    return {
      postData: null,
      authorData: null
    }
  },
  methods: {
    async getData (pid, aid) {
      axios.get(`/authors/${aid}/posts/${pid}`)
        .then((res) => {
          this.postData = res.data
        })
        .catch((err) => { console.log(err) })

      axios.get(`/authors/${aid}`)
        .then((res) => {
          this.authorData = res.data
        })
        .catch((err) => { console.log(err) })
    }
  }
}

</script>
