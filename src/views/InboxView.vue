<template>
  <h1> Your <strong>Feed</strong></h1>
  <br>
    <h3 style="text-align: left; margin-left: 15%;"> GitHub <strong>Events</strong></h3>
    <div class="main_center">
      <div class="feeds">
        <div v-for="feed in git_feeds" :key="feed.id">
          <git_card :git_feed="feed"/>
        </div>
      </div>
    </div>
  <br><br>

  <NotificationList :selectedNotifications="stream.items"></NotificationList>

  <SlotModal modalName="inboxModal" sizing="modal-xl" justification="modal-dialog-centered">
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
import SlotModal from '@/components/SlotModal.vue'
import NotificationList from '@/components/inboxComponents/NotificationList.vue'
import InboxModalBody from '@/components/inboxComponents/InboxModalBody.vue'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import axios from 'axios'
import git_card from '../components/GitHubFeed.vue'
  
const github_data = {
  "token": "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",
  "username": "kirat21"
};
const baseURL = "https://api.github.com/users/kirat21/events";
const headers = {
  "Accept": "application/vnd.github+json",
  "Content-Type": "application/json",
  Authorization: "Bearer "+github_data["token"],
  // "X-GitHub-Api-Version": "2022-11-28"
}

export default {
  components: { SlotModal, NotificationList, InboxModalBody, git_card },
  computed: {
    ...mapStores(useUserStore)
  },

  mounted () {
    this.getAuthorFromStore()
    this.get_github_feed()
    axios.get(this.author.id + '/inbox')
      .then((res) => { this.stream = res.data })
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
    get_github_feed () {
      axios.get(baseURL, { headers })
      .then((res) => {
        this.git_feeds = res.data
        console.log(res.data)
      })
      .catch(function(err) {
        console.log(JSON.stringify(err));
      });
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
  .main_center {
    display: flex;
    flex-direction: column;
    margin-left: 10%;
    margin-right: 10%;
    width: 62%;
  }
  .feeds{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2% 2% 2% 2%;
    justify-content: space-around;
    row-gap: 20px;
  }
</style>
