<!-- See Figma in case you want to know exactly what this is -->

<!-- NOTE: FOR NOW, ONLY INCOMING EVENTS ARE PLACED IN THE INBOX. ANY OUTGOING REQUESTS ARE NOT RECORDED -->

<template>
  <!-- Used for toggling the listviews -->
  <div class="btn-group-vertical" role="group">
    <button class="btn" value="all" @click="(e) => setActive(e.value)">
      <i class="bi bi-archive-fill"/>
    </button>
    <button class="btn" value="post" @click="(e) => setActive(e.value)">
      <i class="bi bi-file-earmark-post"/>
    </button>
    <button class="btn" value="Like" @click="(e) => setActive(e.value)">
      <i class="bi bi-heart-fill"/>
    </button>
    <button class="btn" value="comment" @click="(e) => setActive(e.value)">
      <i class="bi bi-left-text-fill"/>
    </button>
    <button class="btn" value="Follow" @click="(e) => setActive(e.value)">
      <i class="bi bi-person-plus-fill"/>
    </button>
  </div>

  <!-- What things are we getting? Posts, comments, all, etc -->
  <NotificationList :source="selectedNotifications"/>

</template>

<script>

import NotificationList from '@/components/inboxComponents/notificationList.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  components: [NotificationList],

  data () {
    return {
      active: 'all',
      author: null,
      allNotifications: [],
      selectedNotifications: []
    }
  },

  mounted () {
    this.getAuthorFromStore()
    axios.get(this.author.id + '/inbox')
      .then((res) => { this.allNotifications = res.data })
      .catch((err) => {
        console.log(err)
      })
  },

  computed: {
    ...mapStores(useUserStore)
  },

  methods: {
    setActive (value) {
      this.active = value
      this.filterNotifications()
    },
    filterNotifications () {
      // Filter according to select option
      if (this.active === 'all') {
        this.selectedNotifications = this.allNotifications
      } else {
        this.selectedNotifications = this.allNotifications.filter(notification => notification.type === this.active)
      }
    },
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    }
  }
}

</script>
