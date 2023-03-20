<template>
  <div class="browse-posts">
    <h1 class="text-left">Browse <strong>Posts</strong></h1>

    <!-- Open that modal :) -->
    <button type="button" class="openFilterModal"><i class="bi bi-funnel-fill"></i></button>

    <!-- Used to sort and filter -->
    <SlotModal :modal-name="filterModal">
      <template #titleText>Filter Posts</template>
      <template #body>
        <!-- Filter by file type -->
        <div class="filetypes d-flex">
          <button @click="toggle('text')"><i class="bi bi-blockquote-left" :class="active.includes('text') ? 'text-primary' : 'text-secondary'"></i> Text</button>
          <button @click="toggle('md')"><i class="bi bi-markdown-fill" :class="active.includes('markdown') ? 'text-primary' : 'text-secondary'"></i> Markdown</button>
          <button @click="toggle('image')"><i class="bi bi-image-fill" :class="active.includes('image') ? 'text-primary' : 'text-secondary'"></i> Image</button>
        </div>

        <!-- Reverse post order -->
        <div class="reverse">
          <button @click=" this.reverse = !this.reverse">
            <i class="bi bi-calendar"></i>
            <i class="bi" :class="reverse ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
          </button>
        </div>
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
      filteredPosts: [], // This is what we'll draw from
      author: null,
      loading: true,
      active: ['text', 'markdown', 'image'],
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
    }
  },
  methods: {
    toggle (file) {
      const index = this.active.findIndex(file)

      index === -1
        ? this.active.splice(index, 1) // remove item
        : this.active.push(file) // add item
    },

    getPosts () {
      axios
        .get('/posts/')
        .then((res) => {
          this.allPosts = res.data
          this.filteredPosts = this.allPosts
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
