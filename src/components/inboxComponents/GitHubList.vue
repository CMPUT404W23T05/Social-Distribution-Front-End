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
        <div class="text-center">
          <p class="gh-event-text"> {{ parseEvent(event) }}</p>
        </div>

        </template>
        <template #footer>
          <a :href = "'https://github.com/' + event.actor.display_login" target="_blank">
            <img class="profile-image ms-2" :src="event.actor.avatar_url" :class="{ open: hovered }" :title="event.actor.display_login + '\'s GitHub image'" />
          </a>
          <div class="d-flex align-items-center justify-content-between w-100 h-100 px-3 overflow-hidden">
          <div>
            <a :href = "'https://github.com/' + event.actor.display_login" target="_blank">{{ event.actor.display_login }}</a>
          </div>
          <div class="d-flex gap-2">
          <a :href = "'https://github.com/' + event.repo.name" target="_blank"><i class="bi bi-journal-code gh-card-icon"></i>
         </a>

          </div>
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
      if (parsedEvent) {
        const eventText = parseGithubEvent.compile(parsedEvent)
        return eventText
      }
      // handle unknown events
      const humanReadableEvent = event.type.replace('Event', '').replace(/([A-Z])/g, ' $1').toLowerCase() // add spaces before capital letters and convert to lowercase
      return `${event.actor.display_login} did a ${humanReadableEvent} in ${event.repo.name}`
      // console.log(parsedEvent)
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
  .bi {
    font-size: 1.5em;
  }

</style>
