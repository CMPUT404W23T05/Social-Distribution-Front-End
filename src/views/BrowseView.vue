<template>
  <div class="browse-posts">
    <h1 class="text-left">Browse <strong>Posts</strong></h1>

    <!-- Open that modal :) -->

    <!-- Used to sort and filter -->
    <SlotModal modal-name="filterModal" v-if="!loading">
      <template #titleText>Filter Posts</template>

      <template #body>
        <!-- Filter by file type -->
        <div class="filetypes d-flex justify-content-center">
          <button @click="toggle('plain')" class='btn mx-2 filter-button' :class="active.plain ? 'btn-primary' : 'btn-outline-secondary'">
            <i class="bi bi-blockquote-left d-block"></i> Plaintext
          </button>
          <button @click="toggle('markdown')" class='btn mx-2 filter-button' :class="active.markdown ? 'btn-primary' : 'btn-outline-secondary'">
            <i class="bi bi-markdown-fill d-block"></i> Markdown
          </button>
          <button @click="toggle('image')" class='btn mx-2 filter-button' :class="active.image ? 'btn-primary' : 'btn-outline-secondary'">
            <i class="bi bi-image-fill d-block"></i> Image
          </button>
        </div>

        <!-- Reverse post order -->
        <div class="reverse d-flex justify-content-center mt-3">
          <button @click="reversePosts" class="btn btrn primary">
            <i class="bi bi-calendar"></i>
            <i class="bi" :class="reverse ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
          </button>
        </div>
      </template>

      <template #closeButtonText>Done</template>
      <template #openModalButton>
        <button type="button" class="btn btn-outline-primary open-filter-modal d-flex justify-self-start" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="bi bi-funnel-fill"></i> Filter Posts</button>
      </template>

    </SlotModal>

    <!-- List view with delimiting date headers -->
    <div v-if="!loading" class="all-posts">
      <div v-for="[date, posts] of Object.entries(postSections)" :key="date">
        <h3 class="text-primary mx-5 px-2"> {{ date === today ? 'Today' : date }} </h3>
        <hr class="date-header bg-secondary">
        <div class="card-list pb-5">
          <Card v-for="post in posts" :key="post.id" :author="post.author" :post="post"/>
        </div>
      </div>
    </div>
  </div>

  <h1>hey</h1>
  <div class="authors">
    <div v-for="author in authors.items" :key="author.id">
      <author_card :author="author"/>
    </div>
  </div>
  <!-- <h4>{{authors}}</h4> -->
  <br><br>

</template>

<script>
import Card from '../components/RevisedCard.vue'
import SlotModal from '../components/SlotModal.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DD'
import author_card from '../components/AuthorCard.vue'

export default {
  name: 'BrowsePage',
  components: { Card, SlotModal, author_card },
  data () {
    return {
      allPosts: [],
      author: null,
      loading: true,
      active: { plain: true, markdown: true, image: true },
      reverse: false,
      authors: []
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
      return moment().format(dateFormat)
    },

    filteredPosts () {
      return this.allPosts.filter(post => {
        return this.matchesActive(post)
      })
    }
  },
  methods: {
    getAuthors() {
      axios.get(
        '/authors/')
      .then((res) => {
        this.authors = res.data
        console.log(res.data)
      })
      .catch(function(err) {
        console.log(err);
      });
    },

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
        if (!activeStatus && post.contentType.includes(filetype)) {
          return false
        }
      }
      return true
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
        const key = moment(post.published).format(dateFormat) // Granulate by days
        const grouping = acc[key] ?? []

        return { ...acc, [key]: [...grouping, post] }
      }, {})
    }
  },
  mounted () {
    this.getAuthorFromStore()
    this.getPosts()
    this.getAuthors()
  }
}
</script>

<style scoped>
.authors{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2% 2% 2% 2%;
    justify-content: space-around;
    row-gap: 20px;
    margin-left: 10%;
    margin-right: 10%;
  }
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

/* Buttons inside the modal filter */
.filter-button {
  width: 20%;
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
