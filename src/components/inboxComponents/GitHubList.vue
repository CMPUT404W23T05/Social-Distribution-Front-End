<template>

    <div class="notification-list d-flex flex-wrap">
        <!-- Anchor is where to re-direct on click -->
        <GenericCard
          @hovered="hovered=true"
          @unhover="hovered=false"
          v-for="event in feed"
          :key="event.id"
          class="m-2"
        >

        <template #card-content>
        <div>
          <p> {{ parseEvent(event) }}</p>
        </div>

        </template>
        <template #footer>
          <img class="profile-image ms-2" :src="event.actor.avatar_url" :class="{ open: hovered }" :title="event.actor.display_login + '\'s GitHub image'" />
          <div class="d-flex align-items-center justify-content-between w-100 h-100 px-3 overflow-hidden">

          <div>
          {{ event.actor.display_login }}
          </div>
          <a :href = "'https://github.com/' + event.actor.login" target="_blank">
          <i class="bi bi-github" title="Visit GitHub profile"></i>
            </a>
        </div>

        </template>

        </GenericCard>
      </div>
    </template>

<script>
import GenericCard from '@/components/GenericCard.vue'
export default {
  name: 'GitHubList',
  components: {
    GenericCard
  },
  props: {
    selectedNotifications: {
      type: Array
    }
  },
  watch: {
    selectedNotifications: function (newVal, oldVal) {
      this.feed = newVal
    }
  },
  data () {
    return {
      feed: [],
      author: null
    }
  },
  async created () {
    this.feed = this.selectedNotifications
  },
  methods: {
    parseEvent (event) {
      const parseGithubEvent = require('parse-github-event')
      const parsedEvent = parseGithubEvent.parse(event)
      const eventText = parseGithubEvent.compile(parsedEvent)
      // console.log(parsedEvent)
      return eventText
    }
  }
}
</script>
<style scoped>
 .profile-image {
    height: 0em;
    width: 0em;
    border-radius: 50%;
    object-fit: cover;
    transition: 0.4s;
  }
  .profile-image.open {
    height: 5em;
    width: 5em;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  a:hover {
    color: #4998f5
  }
  .bi-github {
    font-size: 1.5em;
  }

</style>
