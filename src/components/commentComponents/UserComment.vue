<template>
 <div class="card text-start my-2">
  <div class="card-body pb-0">
    <div class="content">
      <p v-if="!markdown" class="mb-0" :class="{decoration: flairDecorate}">{{ comment.comment }}</p>
      <VueMarkdown v-else :source="comment.comment" :class="{decoration: flairDecorate}"></VueMarkdown>
      <div class="commenter">
          <span class="display-name">@{{ comment.author.displayName }}</span>
          <!-- OP, same as current session user, etc. -->
          <slot name="flair"></slot>
      </div>
      <small class="date text-muted">{{ dateFormatted }}</small>
    </div>
  </div>
  <div class="card-footer py-1">
    <span class="likers">
      <button type="button" class="btn btn-sm btn-light action-button text-muted d-inline justify-content-center m-0" @click="addLike">
        <i class="bi bi-heart-fill" :class="{liked: isLiked}"></i>
      </button>
      <img v-for="like, index in likes" :key="index" class="like-profile-picture d-inline" :src="!!like.author.profileImage ? like.author.profileImage : defaultImage"/>
      <small class="d-inline pl-2" v-if="likes?.length > 0">
        <span v-if="overflowLikes > 0">+ {{overflowLikes}}</span>likes this post
      </small>
    </span>
  </div>

 </div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'
import moment from 'moment'
import { getAxiosTarget } from '@/util/axiosUtil'

const likersToShow = 3

const likeTemplate = {
  type: 'Like',
  context: 'https://www.w3.org/ns/activitystreams',
  author: null,
  summary: null, // null to be filled upon action
  object: null
}

export default {
  props: { comment: Object, sessionUser: Object },
  components: { VueMarkdown },

  async mounted () {
    await this.getLikes()
    this.loading = false
  },
  computed: {
    dateFormatted () {
      const commentDate = moment(this.comment.published).format('YYYY/MM/DD')
      const now = moment().format('YYYY/MM/DD')

      return commentDate === now
        ? 'Today'
        : commentDate
    },
    flairDecorate () {
      // Special behaviour when flair is present
      return !!this.$slots.flair
    },
    markdown () {
      return /markdown$/.test(this.comment.contentType)
    },
    isLiked () {
      for (const like of this.likes) {
        console.log(like)
        if (like?.author?.id === this.sessionUser.id) {
          return true
        }
      }
      return false
    },
    firstFewLikers () {
      return this.likes.slice(0, likersToShow - 1) // Show the first n authors
    },
    overflowLikes () {
      // The number to append for the likers whose profile images were not shown
      return this.likes?.length <= likersToShow ? 0 : this.likes?.length - likersToShow
    }
  },
  data () {
    return {
      likes: [],
      loading: true,
      hostNode: getAxiosTarget(this.comment.id),
      commentPath: new URL(this.comment.id).pathname
    }
  },
  methods: {
    async getLikes () {
      this.hostNode.get({ url: `${this.commentPath}/likes`, validateStatus: null }) // node 10 doesn't have trailing slash
        .then((res) => {
          this.likes = res.data.items
        })
        .catch((res) => {
          console.log(res)
        })
    },

    addLike () {
      // Generate a Like
      if (!this.isLiked) {
        const newLike = likeTemplate
        newLike.author = this.sessionUser
        newLike.object = this.comment.id
        newLike.summary = `${newLike.author.displayName} liked your comment`

        const authorPath = new URL(this.comment.author.id).pathname
        this.hostNode.post(`${authorPath}/inbox/`, newLike)
          .then(() => {
            console.log('Sent like to inbox')
            this.likes.push(newLike) // Update local
          })
          .catch((err) => {
            console.log('Couldn\'t send like to comment')
            console.log(err)
          })
      }
    }
  }
}

</script>

<style scoped>
  /* Style overall content when flair is present */
  .decoration {
    font-weight: bold;
  }

  .btn {
    border-radius: 50%;
  }

  .comment-body {
    background: #FFF;
    font-size: 1.2em;
    padding: 0.5em 0;
    text-align: left;
    color: #1e1e1e;
    max-height: fit-content;
    white-space: pre-wrap;
  }

  .like-profile-picture {
    width: 16pt;
    height: 16pt;
    border-radius: 50%;
    margin: 0.1em;
  }

  .commenter, .date {
    color: #736666;
    font-size: 0.8em;
  }

  .date {
    font-size: 0.8em;
  }

  .display-name {
    margin-right: 0.5em;
  }

  .liked {
    color: red;
  }

  small {
    font-size: 0.8em;
    display: inline;
  }

</style>
