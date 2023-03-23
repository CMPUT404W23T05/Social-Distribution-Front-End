<template>
  <h1> Your <strong>Feed</strong></h1>
  <notificationList :selectedNotifications="stream"></notificationList>

</template>

<script>
import SlotModal from '@/components/SlotModal'
import notificationList from '@/components/inboxComponents/notificationList.vue'
import inboxModalBody from '@/components/inboxComponents/inboxModalBody.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  components: [SlotModal, notificationList, inboxModalBody],
  computed: {
    ...mapStores(useUserStore)
  },

  mounted () {
    axios.get(this.author.id + '/inbox')
      .then((res) => { this.allNotifications = res.data })
      .catch((err) => {
        console.log(err)
      })
  },
  data () {
    return {
      stream: [],
      author: null
    }
  },
  methods: {
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    }
  }

}

</script>

<style>

</style>
