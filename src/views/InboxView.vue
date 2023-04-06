<template>
  <div class="inbox-view pb-5 mt-5">
    <h1 class="text-left"> Your <strong>Feed</strong></h1>
    <SlotModal v-if="!loading" modalName="inboxModal" sizing="modal-xl" justification="modal-dialog-centered">
      <template #titleText><h2>Inbox</h2></template>
      <template #body>
        <InboxModalBody :allNotifications="stream.items"/>
      </template>
      <template #closeButtonText>Done</template>
      <template #openModalButton>
        <button type="button" class="btn btn-outline-primary d-flex justify-self-start" data-bs-toggle="modal" :data-bs-target="'#inboxModal'">
          Inbox
        </button>
      </template>
    </SlotModal>
    <NotificationList v-if="!loading && stream.items?.length > 0" :selectedNotifications="stream.items" class="list pb-2"></NotificationList>
    <p v-else-if="!loading && stream.items?.length === 0">There's nothing here for you yet</p>
    <ShowMoreButton v-if="!loading && stream.items?.length > 0 && !stream.noMore" @show-more="getInbox(++stream.page)">
      Show more posts
          </ShowMoreButton>
          <!-- if out of items -->
    <p v-else-if="!loading && stream.noMore">No more notifications to show!</p>
      <!-- GitHub Feed  -->
    <div class="github-container  w-100">
        <h1 class="mt-5 text-left"> Your <strong>GitHub Events Feed</strong> </h1>
        <GitHubList v-if="!loading && stream_gh.items?.length > 0" :selectedNotifications="stream_gh.items" class="list pb-2"></GitHubList>
        <!-- If error loading GitHub feed -->
        <p v-if="gh_error" class="mt-3 mb-1 text-danger">{{gh_error}}</p>
        <!-- Show more button for GitHub feed -->
        <ShowMoreButton v-if="this.author?.github" @show-more="getGitHubEvents(++stream_gh.page)">
          <span v-if="stream_gh.items?.length == 0">Load feed</span>
          <span v-else-if="stream_gh.items?.length > 0">Show more events</span>
          </ShowMoreButton>
          <!-- If no github username set -->
        <p v-if="!this.author?.github">No GitHub username set! Add your GitHub username in <RouterLink to="/settings">profile settings</RouterLink> to use this feature.</p>
    </div>
  </div>
</template>

<script>
import SlotModal from '@/components/SlotModal.vue'
import NotificationList from '@/components/inboxComponents/NotificationList.vue'
import InboxModalBody from '@/components/inboxComponents/InboxModalBody.vue'
import ShowMoreButton from '@/components/ShowMoreButton.vue'
import GitHubList from '@/components/inboxComponents/GitHubList.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import { pathOf } from '@/util/axiosUtil.js'

export default {
  components: { SlotModal, NotificationList, InboxModalBody, GitHubList, ShowMoreButton },
  computed: {
    ...mapStores(useUserStore)
  },

  created () {
    this.getAuthorFromStore()
    this.getInbox(this.stream.page) // start at page 1
  },
  data () {
    return {
      stream: {
        items: [],
        size: 12,
        page: 1,
        noMore: false
      },
      stream_gh: {
        items: [],
        size: 10,
        page: 0
      },
      author: null,
      loading: true,
      gh_error: ''
    }
  },
  methods: {
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    },
    getGitHubEvents (page) {
      const githubUsername = this.author.github.split('/').pop()
      this.$github
        .get(githubUsername + '/received_events/public', {
          params: {
            per_page: this.stream_gh.size,
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
          if (err.response.status === 404) {
            this.gh_error = 'GitHub user not found, please check your GitHub username and try again.'
          } else if (err.response.status === 403) {
            this.gh_error = 'GitHub API rate limit exceeded, please try again later.'
          }
        })
    },
    getInbox (page) {
      this.$localNode
        .get(`${pathOf(this.author.id)}/inbox/`, {
          params: {
            size: this.stream.size,
            page: page
          }
        })
        .then((res) => {
          console.log(res)
          this.stream.items = this.stream.items.concat(res.data.items.reverse())
          this.loading = false
          if (res.data.items.length < this.stream.size) { // if we got less than the max size, we're at the end
            this.stream.noMore = true
          }
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
