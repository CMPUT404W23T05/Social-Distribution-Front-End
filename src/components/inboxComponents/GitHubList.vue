<template>

    <div class="notification-list d-flex flex-wrap">
        <!-- Anchor is where to re-direct on click -->
        <GenericCard
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
          <h6 class="notification-type">
           {{ event.type }} : {{ event.repo.url }}
          </h6>
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
