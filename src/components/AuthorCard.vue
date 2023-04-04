<template>
    <GenericCard :title=" author.displayName ">
    <template #card-content>
      <p class="card-text">Host: {{ author.host }}</p>
    </template>
    <template #footer>
      <button @click="followAuthor(author)" class="btn d-flex justify-content-center text-light">Send Request</button>
    </template>
    </GenericCard>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import GenericCard from './GenericCard.vue'

const followTemplate = {
  type: 'Follow',
  object: Object, // Who am I sending this to?
  actor: Object, // Who am I?
  summary: 'A wants to follow B'
}

export default {
  components: { GenericCard },
  props: ['author'],
  data () {
    return {
      curr_author: [],
      follow_confirm: null
    }
  },
  methods: {
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.curr_author = userStore.user.author
    },
    followAuthor (auth) {
      const authIdString = auth.host
      const appLocalName = authIdString.slice(8, 18)
      if (appLocalName === 'social-t30') {
        if (auth.id === this.curr_author.id) {
          alert('Can\'t follow yourself')
        } else {
          axios.post(`/authors/${auth._id}/inbox/`,
            {
              type: 'Follow',
              actor: this.curr_author,
              object: auth
            }
          )
            .then((res) => {
              console.log(res)
              alert(`Request sent to ${auth.displayName}`)
              this.follow_confirm = res.data
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      } else if (appLocalName === 'sd-7-433-a') {
        axios.request({
          method: 'POST',
          baseURL: `${auth.id}/inbox/`,
          headers: {
            'Content-Type': 'Application/JSON',
            Authorization: 'Basic ' + btoa('node01:P*ssw0rd!')
          },
          data: {
            context: 'https://www.w3.org/ns/activitystreams',
            summary: 'string',
            type: 'Follow',
            author: { url: `${this.curr_author.id}` },
            object: { url: `${this.curr_author.id}` }
          }
        })
          .then((res) => {
            this.follow_confirm = res.data
            alert(`Request sent to ${auth.displayName}`)
            console.log(res)
          })
          .catch(function (err) {
            console.log(err)
          })

        axios.put(`/authors/${this.curr_author._id}/remote-requests/`,
          {
            type: 'Follow',
            actor: this.curr_author,
            object: auth
          }
        )
          .then((res) => {
            console.log(res)
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        const auth_id_list = auth.id.split('/')
        const auth_id = auth_id_list[auth_id_list.length - 1]
        axios.request({
          method: 'POST',
          baseURL: `${auth.host}api/authors/${auth_id}/inbox/`,
          headers: {
            'Content-Type': 'Application/JSON',
            Authorization: 'Token d960c3dee9855f5f5df8207ce1cba7fc1876fedf'
          },
          data: {
            type: 'Follow',
            summary: `${this.curr_author.displayName} wants to follow ${auth.displayName}`,
            actor: this.curr_author,
            object: auth

          }
        })
          .then((res) => {
            this.follow_confirm = res.data
            alert(`Request sent to ${auth.displayName}`)
            console.log(res)
          })
          .catch(function (err) {
            console.log(err)
          })

        axios.put(`/authors/${this.curr_author._id}/remote-requests/`,
          {
            type: 'Follow',
            actor: this.curr_author,
            object: auth
          }
        )
          .then((res) => {
            console.log(res)
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  mounted () {
    this.getAuthorFromStore()
  }
}
</script>

<style scoped>
</style>
