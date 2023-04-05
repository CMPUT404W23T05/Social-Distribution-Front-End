<template>
  <div class="inbox-view">
    <h1 class="mt-5 text-left"> Your <strong>Feed</strong></h1>
    <SlotModal v-if="!loading" modalName="inboxModal" sizing="modal-xl" justification="modal-dialog-centered">
      <template #titleText><h2>Inbox</h2></template>
      <template #body>
        <InboxModalBody :allNotifications="stream"/>
      </template>
      <template #closeButtonText>Done</template>
      <template #openModalButton>
        <button type="button" class="btn btn-outline-primary d-flex justify-self-start" data-bs-toggle="modal" :data-bs-target="'#inboxModal'">
          Inbox
        </button>
      </template>
    </SlotModal>

    <NotificationList v-if="!loading && stream?.length > 0" :selectedNotifications="stream" class="list pb-2"></NotificationList>
    <p v-else-if="!loading && stream?.length == 0">There's nothing here for you yet</p>
    <h1 class="mt-5 text-left"> Your <strong>GitHub</strong> Events</h1>
    <GitHubList v-if="!loading && stream_gh.items?.length > 0" :selectedNotifications="stream_gh.items" class="list pb-2"></GitHubList>
    <!-- Show more button for GitHub feed -->
    <button v-if="this.author?.github" type="button" class="btn btn-outline-primary d-flex justify-self-start" @click="getGitHubEvents(++stream_gh.page)">
      <span v-if="stream_gh.items?.length == 0">Load stream</span>
      <span v-else-if="stream_gh?.length > 0">Show more</span>
      </button>
    <p v-else>No GitHub username provided! Set one in your <RouterLink to="/settings">profile settings</RouterLink> to continue.</p>
  </div>
</template>

<script>
import SlotModal from '@/components/SlotModal.vue'
import NotificationList from '@/components/inboxComponents/NotificationList.vue'
import InboxModalBody from '@/components/inboxComponents/InboxModalBody.vue'
import GitHubList from '@/components/inboxComponents/GitHubList.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import { pathOf } from '@/util/axiosUtil.js'

export default {
  components: { SlotModal, NotificationList, InboxModalBody, GitHubList },
  computed: {
    ...mapStores(useUserStore)
  },

  created () {
    this.getAuthorFromStore()
    this.$localNode
      .get(`${pathOf(this.author.id)}/inbox/`)
      .then((res) => {
        console.log(res)
        this.stream = res.data.items.reverse()
        this.loading = false
      })
      .catch((err) => {
        console.log(err)
      })
  },
  data () {
    return {
      stream: [],
      stream_gh: {
        items: [],
        per_page: 10,
        page: 0
      },
      author: null,
      loading: true
    }
  },
  methods: {
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    },
    getGitHubEvents (page) {
      this.$github
        .get(this.author.github + '/received_events/public', {
          params: {
            per_page: this.stream_gh.per_page,
            page: page
          }
        })
        .then((res) => {
          console.log(page)
          console.log(res)
          this.stream_gh.items = this.stream_gh.items.concat(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}

</script>

<style scoped>
  .inbox-view {
    margin: 2rem 5%;
  }

  strong {
    color: var(--bs-blue)
  }

  h1 {
    text-align: left;
  }

</style>
