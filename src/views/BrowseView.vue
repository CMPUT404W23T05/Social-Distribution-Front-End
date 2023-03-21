<template>
  <div class="browse-posts">
    <h1 class="text-left">Browse <strong>Posts</strong></h1>

    <!-- Open that modal :) -->

    <!-- Used to sort and filter -->
    <SlotModal modal-name="filterModal" v-if="!loading">
      <template #titleText>Filter Posts</template>

      <template #body>
        <!-- Filter by file type -->
        <div class="filetypes d-flex">
          <button @click="toggle('plain')"><i class="bi bi-blockquote-left" :class="active.plain ? 'text-primary' : 'text-secondary'"></i> Text</button>
          <button @click="toggle('markdown')"><i class="bi bi-markdown-fill" :class="active.markdown ? 'text-primary' : 'text-secondary'"></i> Markdown</button>
          <button @click="toggle('image')"><i class="bi bi-image-fill" :class="active.image ? 'text-primary' : 'text-secondary'"></i> Image</button>
        </div>

        <!-- Reverse post order -->
        <div class="reverse">
          <button @click="reversePosts">
            <i class="bi bi-calendar"></i>
            <i class="bi" :class="reverse ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
          </button>
        </div>
      </template>

      <template #closeButtonText>Done</template>
      <template #openModalButton>
        <button type="button" class="btn btn-outline-primary open-filter-modal" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="bi bi-funnel-fill"></i> Filter Posts</button>
      </template>

    </SlotModal>

    <!-- List view with delimiting date headers -->
    <div v-if="!loading" class="all-posts">
      <div v-for="[date, posts] of Object.entries(postSections)" :key="date">
        <h3 class="text-primary mx-5 px-2"> {{ date === today ? today : date }} </h3>
        <hr class="date-header bg-secondary">
        <div class="card-list pb-5">
          <Card v-for="post in posts" :key="post.id" :author="post.author" :post="post"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Card from '../components/RevisedCard.vue'
import SlotModal from '../components/SlotModal.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import moment from 'moment'

export default {
  name: 'BrowsePage',
  components: { Card, SlotModal },
  data () {
    return {
      allPosts: [],
      author: null,
      loading: true,
      active: { plain: true, markdown: true, image: true },
      reverse: false
    }
  },
  computed: {
    ...mapStores(useUserStore),

    postSections () {
      // Reduce posts down into unique published dates
      const sections = this.groupPostsByDate(this.filteredPosts)
      return sections
    },

    today () {
      return moment().format('DD/MM/YYYY')
    },

    filteredPosts () {
      return this.allPosts.filter(post => {
        return this.matchesActive(post)
      })
    }
  },
  methods: {
    toggle (file) {
      this.active[file] = !this.active[file]
    },

    reversePosts () {
      this.reverse = !this.reverse
      this.allPosts = this.allPosts.reverse()
    },

    matchesActive (post) {
      // Helper to check if content type has atleast one of the filtered types
      for (const [filetype, activeStatus] of Object.entries(this.active)) {
        // Match atleast one
        if (activeStatus && post.contentType.includes(filetype)) {
          return true
        }
      }
      return false
    },

    getPosts () {
      axios
        .get('/posts/')
        .then((res) => {
          this.allPosts = res.data
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.author = userStore.user.author
    },
    groupPostsByDate (array) {
      // Splits array into object sorted by unique (date) keys
      return array.reduce((acc, post) => {
        const key = moment(post.published).format('DD/MM/YYYY') // Granulate by days
        const grouping = acc[key] ?? []

        return { ...acc, [key]: [...grouping, post] }
      }, {})
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getPosts()
  }
}
</script>

<style scoped>
.browse-posts {
  margin: 2rem 5%;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  margin: 15pt 10%;
  gap: 3em;
}

.date-header {
  width: 85%;
  margin: 0 auto;
}

h1 strong {
  color: var(--bs-blue);
}

hr {
  position: relative;
  top: -1.5rem;
  z-index: -9;
}

h3 {
  transform: translateX(10rem);
  width: fit-content;
  background-color: #FFF;
}

h1 {
  text-align: left;
  color: #1e1e1e;
}

</style>
