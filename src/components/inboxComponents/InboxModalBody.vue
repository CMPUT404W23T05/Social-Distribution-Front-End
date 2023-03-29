<!-- See Figma in case you want to know exactly what this is -->

<!-- NOTE: FOR NOW, ONLY INCOMING EVENTS ARE PLACED IN THE INBOX. ANY OUTGOING REQUESTS ARE NOT RECORDED -->

<template>
  <!-- Used for toggling the listviews -->
  <div class="btn-group-vertical d-flex flex-column justify-content-space-around border-primary" role="group">
    <button class="btn" :class="{'btn-primary': active === 'all'}" @click="setActive('all') ">
      <i class="bi bi-archive-fill"/>
    </button>
    <button class="btn" :class="{'btn-primary': active === 'post'}" @click="setActive('post')">
      <i class="bi bi-file-earmark-post"/>
    </button>
    <button class="btn" :class="{'btn-primary': active === 'Like'}" @click="setActive('Like')">
      <i class="bi bi-heart-fill"/>
    </button>
    <button class="btn" :class="{'btn-primary': active === 'comment'}" @click="setActive('comment')">
      <i class="bi bi-chat-left-fill"/>
    </button>
    <button class="btn" :class="{'btn-primary': active === 'Follow'}" @click="setActive('Follow')">
      <i class="bi bi-person-plus-fill"/>
    </button>
  </div>

  <!-- What things are we getting? Posts, comments, all, etc -->
  <NotificationList :selectedNotifications="selectedNotifications"/>

</template>

<script>

import NotificationList from '@/components/inboxComponents/NotificationList.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  components: { NotificationList },
  props: ['allNotifications'],

  computed: {
    ...mapStores(useUserStore),
    selectedNotifications () {
      return this.active === 'all'
        ? this.allNotifications
        : this.allNotifications.filter(notification => notification.type === this.active)
    }
  },
  data () {
    return {
      active: 'all',
      author: null
    }
  },

  // mounted () {
  //   this.getAuthorFromStore()
  //   axios.get(this.author.id + '/inbox/')
  //     .then((res) => { this.allNotifications = res.data.items })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // },
  methods: {
    setActive (value) {
      this.active = value
    },
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    }
  }
}

</script>
<style>
  .btn-group-vertical {
    float: left;
    margin-right: 0.75em;
  }

  .active {
    color: var(--bs-blue);
  }

  .list-wrapper {
    position: relative;
    left: 1em;
    margin: 0;
  }

</style>
