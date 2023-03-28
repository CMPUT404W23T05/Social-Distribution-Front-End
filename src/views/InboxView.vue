<template>
  <h1> Your <strong>Feed</strong></h1>
  <NotificationList v-if="!loading" :selectedNotifications="stream.items"></NotificationList>

  <SlotModal v-if="!loading" modalName="inboxModal" sizing="modal-xl" justification="modal-dialog-centered">
    <template #titleText><h2>Inbox</h2></template>
    <template #body>
      <InboxModalBody :allNotifications="stream.items"/>
    </template>
    <template #closeButtonText>Done</template>
    <template #openModalButton>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#inboxModal'">
        Inbox
      </button>
    </template>
  </SlotModal>
</template>

<script>
import SlotModal from '@/components/SlotModal.vue'
import NotificationList from '@/components/inboxComponents/NotificationList.vue'
import InboxModalBody from '@/components/inboxComponents/InboxModalBody.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  components: { SlotModal, NotificationList, InboxModalBody },
  computed: {
    ...mapStores(useUserStore)
  },

  created () {
    this.getAuthorFromStore()
    axios.get(this.author.id + '/inbox/')
      .then((res) => {
        this.stream = res.data
        this.loading = false
      })
      .catch((err) => {
        console.log(err)
      })
  },
  data () {
    return {
      stream: [],
      author: null,
      loading: true
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
