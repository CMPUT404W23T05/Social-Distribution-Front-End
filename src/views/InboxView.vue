<template>
  <h1> Your <strong>Feed</strong></h1>
  <NotificationList :selectedNotifications="stream"></NotificationList>

	<SlotModal modalName="inboxModal" sizing="modal-xl" justification="model-dialog-centered">
		<template #titleText><h2>Inbox</h2></template>
		<template #body>
			<InboxModalBody/>
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
import SlotModal from '@/components/SlotModal'
import NotificationList from '@/components/inboxComponents/notificationList.vue'
import InboxModalBody from '@/components/inboxComponents/InboxModalBody.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import axios from 'axios'

export default {
  components: [SlotModal, NotificationList, InboxModalBody],
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
