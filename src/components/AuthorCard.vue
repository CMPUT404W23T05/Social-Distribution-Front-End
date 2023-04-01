<template>
    <GenericCard :title=" author.displayName ">
    <template #card-content>
      <p class="card-text">Host: {{ author.host }}</p>
    </template>
    <template #footer>
      <button @click="followAuthor(author)" class="btn d-flex justify-content-center text-light">Send Request</button>
    </template>
    </GenericCard>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import GenericCard from './GenericCard.vue'

const followTemplate = {
  type: 'Follow',
  object: Object, // Who am I sending this to?
  actor: Object, // Who am I?
  summary: 'A wants to follow B'
}

export default {
  components: { GenericCard },
  props: ['author'],
  data () {
    return {
      currAuthor: Object
    }
  },
  methods: {
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.currAuthor = userStore.user.author
    },

    followAuthor (author) {
      // (http://www.abc.com/some-path/q=def => www.abc.com)
      const authorURL = new URL(author.id)
      const hostname = authorURL.host // Get the hostname substring from the URL

      const recipient = axios.create()
      // Set destination
      if (hostname.includes('social-t30')) {
        Object.assign(recipient.defaults, this.$localNode.defaults)
      } else if (hostname.includes('sd-7-433-api')) {
        Object.assign(recipient.defaults, this.$node7.defaults)
      } else if (hostname.includes('socialdistcmput404')) {
        Object.assign(recipient.defaults, this.$node10.defaults)
      }
      if (author.id === this.currAuthor.id) {
        alert('Can\'t follow yourself')
      } else {
        // Make the new follow object
        followTemplate.object = author
        followTemplate.actor = this.currAuthor
        followTemplate.summary = `${followTemplate.actor} wants to follow ${followTemplate.actor}`

        // Post the object
        // Matches t10, t7, and our own: https://[hostname].com/api/authors/${auth._id/inbox/}
        const authorPath = authorURL.pathname.replace(/^\/api/, '') // strip preceding 'api'
        recipient.post(`${authorPath}/inbox/`, followTemplate)
          .then((res) => {
            console.log(res)
            alert(`Request sent to ${author.displayName}`)
          })
          .catch((err) => {
            console.log(err)
            alert("Couldn't send the request 😢")
          })
      }
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  mounted () {
    this.getAuthorFromStore()
  }
}
</script>

<style scoped>
</style>
