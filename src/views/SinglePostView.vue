<template>
    <div class="d-flex flex-shrink-0" id="single-post-container">
      <!--Left sidebar w/ features and author stuff-->
      <aside v-if="!loading" class="post-left-bar">
        <section class="author-info">
          <img :src="!!authorData.profileImage ? authorData.profileImage : defaultImage" class="author-picture">
          <div class="name">@{{ authorData.displayName }}</div>
          <span class="likers">
            <img v-for="like in likes" :key = "like" class="like-profile-picture" :src="!!like.author.profileImage ? like.author.profileImage : defaultImage"  :title="'@' + like.author.displayName"/>
            <small><small v-if="overflowLikes > 0">+ {{overflowLikes}}</small>likes this post</small>
          </span>
        </section>

        <ul class="btn-list">
          <li class="btn-with-label">
            <button
            id="like-post-button"
            type="button"
            class="btn btn-light action-button"
            @click="addLike"
            >
              <i class="bi bi-heart-fill"  :class="{liked: isLiked}"></i>
            </button>
            <label for="like-post-button">{{ likes?.length }}</label>
          </li>
          <li class="btn-with-label">
            <button id="comment-button" type="button" ref="commentButton" data-bs-toggle="modal" data-bs-target="#makeCommentModal" class="btn btn-light action-button">
              <i class="bi bi-chat-left-text-fill"></i>
            </button>
            <label for="comment-button">{{ postData.count }}</label>
          </li>
          <li>
            <button type="button" class="btn btn-light action-button" data-bs-toggle="modal" data-bs-target="#sharePostModal"><i class="bi bi-share-fill "></i></button>
          </li>
        </ul>
      </aside>
      <!-- Components: Post, Comments list, profile picture -->
      <PostProper v-if="!loading" :post="postData" :author="authorData" class="col-9"></PostProper>

      <!-- Right comment aside -->
      <aside v-if="!loading" class="post-right-bar" :class="{expanded: expandComments}">
        <div class="right-aside-tab" @click="toggleComments">
          <i v-if="!expandComments" class="right-aside-tab-icon bi bi-caret-left-fill"></i>
          <i v-if="expandComments" class="right-aside-tab-icon bi bi-caret-right-fill"></i>
        </div>
        <div class="scrollable">
          <CommentList :post="postData" :axiosTarget="postHost" :page="currentCommentPage" :pageTotal="pageTotal" :pagination="paginationSetting" @add-comment="$refs.commentButton.click()"></CommentList>
          <div class="move-page-wrapper">
            <div v-if="pageTotal > 1" class="move-page">
              <i class="bi bi-caret-left-fill" :class="{activated: currentCommentPage > 1}" @click="changeCommentPage(-1)"></i>
              <span class="pages-count">{{ currentCommentPage }}/{{ pageTotal }}</span>
              <i class="bi bi-caret-right-fill" :class="{activated: currentCommentPage !== pageTotal}" @click="changeCommentPage(1)"></i>
            </div>
          </div>
        </div>
      </aside>

      <!-- Modal for adding comment -->
      <SlotModal modalName="makeCommentModal" sizing="modal-lg" justification="modal-dialog-centered">
        <template #titleText>Add a <strong>Comment</strong></template>
        <template #body>
          <div class="form-check form-switch d-flex justify-content-center gap-3 mb-2">
            <input v-model="markDownEnabled" @change="setText" id="markdown-toggle" class="form-check-input pr-2" type="checkbox"/>
            <label class="form-check-label" for="markdown-toggle">
              <i class="bi-markdown-fill"></i>
              Use Markdown
            </label>
          </div>
          <textarea class="form-control" v-model="newComment" placeholder="Write a comment"/>
        </template>
        <template #submitButton>
          <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="submitComment">Submit</button>
        </template>
         <!-- Overwrite openModalButton with my own -->
        <template #openModalButton><br/></template>
      </SlotModal>

      <!-- v-if so that we don't make API calls when this isn't open -->
      <SlotModal modalName="sharePostModal" justification="modal-dialog-centered">
        <template #titleText>Share <strong>Post</strong></template>
        <template #body>
          <h4>Your <strong>Followers</strong></h4>
          <!-- Switch w/ cards later on -->
          <div id="followers-container">
              <ul class="list-group">
              <li class="list-group-item" v-for="friend in friends" :key="friend.id">
              <div class="d-flex w-100 h-100 align-items-center justify-content-between">
                <div class="d-flex">
                  <img :src="friend.profileImage" class="rounded-circle follower-pic" >
                  <div>
                    <h5 class="mb-1">@{{ friend.displayName }}</h5>
                    <small>{{ friend.host }}</small>
                  </div>
                </div>
              <button v-if="!friend.shareStatus" class="btn btn-primary" @click="sharePost(friend)">Share</button>
              <button disabled v-else class="btn btn-outline-primary">{{friend.shareStatus}}</button>
              </div>
              </li>
              <p v-if="friends.length === 0 ">You have no followers :C</p>
            </ul>
          </div>
        </template>
        <!-- Overwrite openModalButton with my own -->
        <template #openModalButton><br/></template>
      </SlotModal>

    </div>
    <!-- Idk if the sidebar for liking, commenting, etc should be a component, or unique to this page -->
</template>

<script>
import PostProper from '@/components/viewPostComponents/SinglePost.vue'
import CommentList from '@/components/commentComponents/CommentList.vue'
import SlotModal from '@/components/SlotModal.vue'
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'
import { getAxiosTarget } from '@/util/axiosUtil.js'

const commentTemplate = {
  type: 'comment',
  id: null, // Generate on submit
  author: null, // Add on submit
  comment: '',
  contentType: 'text/plain', // Or text/markdown
  published: '2023-03-01T21:18:38.908794Z' // Placeholder (maybe re-added on backend?)
}

const likersToShow = 3 // How many profile pictures to show before giving a +x for the remainder

export default {
  components: { PostProper, CommentList, SlotModal },
  async mounted () {
    // Get the post and author
    const pid = this.$route.params.pid
    const aid = this.$route.params.aid
    this.getAuthorFromStore()
    await this.getData(pid, aid)
    await this.getLikes()
  },
  computed: {
    ...mapStores(useUserStore),
    loading () {
      return (!this.authorData || !this.postData)
    },
    pageTotal () {
      return Math.ceil(this.postData.count / this.paginationSetting) || 1 // Atleast 1 page
    },
    // Below are all for displaying liked status
    isLiked () {
      for (const like of this.likes) {
        console.log(like)
        if (like?.author?.id === this.currentAuthor.id) {
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
      // Basic information to load post stuff
      postData: null,
      authorData: null, // Get from post
      currentAuthor: null, // Load from store
      defaultImage: '/defaultProfileImage.png',

      // Used for seeing likes
      likes: [],

      // Used for social stuff
      isFollowing: false,
      friends: [], // Update when modal is opened
      friendsLoading: true,

      // Used for comment list
      comments: [],
      commentsLoading: true, // Lots of requests need to be made for comments (one per comment to get likes) so separate loading
      expandComments: false,
      currentCommentPage: 1,
      paginationSetting: 5, // This will acquired from user once they set their pagination

      // Used for creating a new comment
      newComment: '',
      markDownEnabled: false,

      // Where does this post?
      postHost: getAxiosTarget(this.$route.query.hostURL)
    }
  },
  methods: {
    async getData (pid, aid) {
      await this.postHost.get(`/authors/${aid}/posts/${pid}/`)
        .then((res) => {
          this.postData = res.data
        })
        .catch((err) => { console.log(err) })

      await this.postHost.get(`/authors/${aid}/`)
        .then((res) => {
          this.authorData = res.data
        })
        .catch((err) => { console.log(err) })

      // Get friends
      this.$localNode.get(`${this.currentAuthor.id}/followers/`)
        .then((res) => {
          this.friends = res.data.items// .concat(res.data.items).concat(res.data.items).concat(res.data.items).concat(res.data.items)
          // add sent property to each friend
          for (const friend of this.friends) {
            friend.shareStatus = ''
          }
          this.friendsLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.friendsLoading = false
        })
    },

    async getLikes () {
      const postPath = new URL(this.postData.id).pathname
      this.postHost.get(`${postPath}/likes`)
        .then((res) => {
          this.likes = res.data.items
        }
        )
        .catch((err) => {
          console.log(err)
        })
    },

    // async getComments () {
    //   const postPath = new URL(this.postData.id).pathname
    //   await this.postHost.get(`${postPath}/comments`)
    //     .then((res) => {
    //       this.comments = res.data.items
    //     })
    //     .catch((err) => {
    //       console.log('Couldn\'t get comments.')
    //       console.log(err)
    //     })
    // },

    toggleFollow () {
      this.isFollowing = !this.isFollowing
      alert('Sorry! You can\'t follow people yet')
    },
    addLike () {
      if (!this.isLiked) {
        const newLike = {
          type: 'Like',
          context: 'https://www.w3.org/ns/activitystreams',
          author: this.currentAuthor,
          summary: `@${this.currentAuthor.displayName} liked your post`,
          object: this.postData.id
        }
        const authorPath = new URL(this.authorData.id).pathname
        console.log(authorPath)
        this.postHost.post(`${authorPath}/inbox/`, newLike)
          .then((res) => {
            console.log('Like sent to ' + `${authorPath}/inbox/`)
            this.likes.push(newLike) // Update local
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    toggleComments () {
      this.expandComments = !this.expandComments
    },
    changeCommentPage (n) {
      // Check if the currentPage will put the user out of bounds
      if (n < 0 && this.currentCommentPage + n > 0) {
        this.currentCommentPage += n
      } else if (n > 0 && this.currentCommentPage + n <= this.pageTotal) {
        this.currentCommentPage += n
      }
    },
    submitComment () {
      // Form the content
      const comment = commentTemplate
      const generatedId = uuidv4()
      comment.author = this.currentAuthor
      comment.id = `${this.postData.id}/comments/${generatedId}` // postID includes the author as well
      comment.comment = this.newComment
      comment.content = this.newComment // Team 10 uses content property instead
      comment.contentType = this.markDownEnabled ? 'text/markdown' : 'text/plain'
      const postPath = new URL(this.postData.id).pathname

      console.log(comment)
      this.postHost.post(`${postPath}/comments`, comment)
        .then(() => {
          // Navigate to last page to display the comment
          this.postData.count++
          this.currentCommentPage = this.pageTotal
          this.expandComments = true
          this.newComment = '' // clear
        })
        .catch((err) => {
          console.log(this.postHost.defaults)
          console.log(err)
          alert('Couldn\'t make comment!')
        })
    },
    sharePost (friend) {
      this.postHost.post(`${friend.id}/inbox/`, this.postData)
        .then(() => {
          friend.shareStatus = 'Shared'
        })
        .catch((e) => {
          if (e.response.status === 409) {
            friend.shareStatus = 'Already shared'
          } else {
            friend.shareStatus = 'Error'
            console.log(e)
          }
        })
    },
    getAuthorFromStore () {
      const userStore = this.userStore
      userStore.initializeStore()
      this.currentAuthor = userStore.user.author
    }
  }
}
</script>

<style scoped>
  #single-post-container {
    padding: 0;
    margin: 0;
  }
  #followers-container {
    max-height: 20vw;
    overflow-y: auto;
  }
  .liked {
    color: #FF0000;
  }

  .activated {
    color: #4998F5;
    font-weight: bold;
  }

  /* Left aside */

  .post-left-bar {

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin: 2em 4em;
  }

  .like-profile-picture {
    width: 16pt;
    height: 16pt;
    border-radius: 50%;
    margin: 0.1em;
  }

  .btn-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    gap: 3rem;
    margin: 5em 0;
  }
  .author-picture {
    border-radius: 50%;
    width: 128pt;
    height: 128pt;
  }

  .btn-with-label {
    margin: 0.5em 0;
  }

  .follow-status {
    display: flex;
    justify-content: space-around;
  }
  .name {
    font-weight: bold;
    font-size: 1.2em;
  }

  .action-button {
    display: block;
    border-radius: 50%;
    background-color: #ebebeb;
    aspect-ratio: 1/1;
    width: 5em;
  }

  i:hover {
    filter: drop-shadow(10px, 10px, #797979);
  }

  i {
    color: #3a3a3a;
    font-size: 2.2rem;
    padding: 0;
    line-height: 0;
    cursor: pointer;
  }

  small {
    font-size: 0.75em;
    display: block;
  }

  li {
    list-style: none;
  }

  aside {
    position: relative;
    width: min(20%, fit-content);
  }

  textarea {
    resize: none;
    min-height: 10em;
  }
  small {
    color: grey;
  }

  /* Right aside */
  .post-right-bar {
    position: fixed;
    right: 0;
    background-color: rgba(0,0,0,0.7);
    height: 100%;
    padding: 0 1em;
    width: 0%;
    transition: 0.4s ease-in-out;
  }
  .post-right-bar.expanded {
    width: 33%
  }

  .scrollable {
    overflow-y: scroll;
    height: calc(100% - 11em);
  }
  .scrollable::-webkit-scrollbar {
    display: none;
  }

  .right-aside-tab {
    float: left;
    position: relative;
    background-color: rgba(0,0,0,0.7);
    width: 1.5em;
    height: 15em;
    right: 2.5em;
    top: calc(50% - 7.5em);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .right-aside-tab-icon {
    color: #4998F5;
  }

  .move-page {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .move-page-wrapper {
    position: absolute;
    bottom: 2em;
    margin-bottom: 5em;
    width: 100%;
  }

  .pages-count {
    color: #FFF;
    font-size: 1.2em;
  }
  .follower-pic {
    width: 4em;
    height: 4em;
    margin: 0;
    margin-right: 2em;
  }
</style>
