<template>
    <div class="d-flex flex-column flex-shrink-0" id="single-post-container">
      <!-- Components: Post, Comments list, profile picture -->
      <PostProper v-if="!loading" :post="postData" :author="authorData" class="col-9"></PostProper>

      <!--Left sidebar w/ features and author stuff-->
      <aside v-if="!loading" class="post-left-bar">
        <section class="author-info">
          <img :src="authorData.profileImage" class="author-picture">
          <div class="name">@{{ authorData.displayName }}</div>
          <!-- TODO: Do NOT display follow-status if the post author matches session author -->
          <span class="follow-status">
            <!-- Will always encourage person to follow through colour contrast -->
            <small :class="{activated: isFollowing}"> {{ isFollowing ? "Following" : "Not Following" }} </small>
            <small :class="{activated: !isFollowing}" @click="toggleFollow"> {{ isFollowing ? "Unfollow" : "Follow" }} </small>
          </span>
        </section>

        <ul class="btn-list">
          <li class="btn-with-label">
            <button id="like-post-button" type="button" class="btn btn-light action-button" @click="toggleLike"><i class="bi bi-heart-fill" :class="{liked: isLiked}"></i></button>
            <!-- TODO: Implement like functionality -->
            <!-- <label for="like-post-button">{{ PostProper.likes }}</label> Not sure how this works yet...-->
          </li>
          <li class="btn-with-label">
            <button id="comment-button" type="button" ref="commentButton" data-bs-toggle="modal" data-bs-target="#makeCommentModal" class="btn btn-light action-button">
              <i class="bi bi-chat-left-text-fill"></i>
            </button>
            <label for="comment-button">{{ postData.count }}</label>
          </li>
          <li>
            <!-- TODO: Implement share functionality -->
            <button type="button" class="btn btn-light action-button"><i class="bi bi-share-fill "></i></button>
          </li>
        </ul>
      </aside>

      <!-- Right comment aside -->
      <aside v-if="!loading" class="post-right-bar" :class="{expanded: expandComments}">
        <div class="right-aside-tab" @click="toggleComments">
          <i v-if="!expandComments" class="right-aside-tab-icon bi bi-caret-left-fill"></i>
          <i v-if="expandComments" class="right-aside-tab-icon bi bi-caret-right-fill"></i>
        </div>
        <div class="scrollable">
          <CommentList :post="postData" :page="currentCommentPage" :pageTotal="pageTotal" :pagination="paginationSetting" @add-comment="$refs.commentButton.click()"></CommentList>
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
          <textarea class="form-control" v-model="newComment" placeholder="Write a comment"/>
        </template>
        <template #submitButton>
          <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="submitComment">Submit</button>
        </template>
        <template #openModalButton><br/></template>
      </SlotModal>
      <!-- Overwrite openModalButton with my own -->

    </div>
    <!-- Idk if the sidebar for liking, commenting, etc should be a component, or unique to this page -->
</template>

<script>
import PostProper from '@/components/viewPostComponents/SinglePost.vue'
import CommentList from '@/components/commentComponents/CommentList.vue'
import SlotModal from '@/components/SlotModal.vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const commentTemplate = {
  type: 'comment',
  id: null, // Generate on submit
  author: null, // Add on submit
  comment: '',
  contentType: 'text/plain', // Or text/markdown
  published: '2023-03-01T21:18:38.908794Z' // Placeholder (maybe re-added on backend?)
}

export default {
  components: { PostProper, CommentList, SlotModal },
  mounted () {
    // Get the post and author
    const pid = this.$route.params.pid
    const aid = this.$route.params.aid
    this.getData(pid, aid)
  },
  computed: {
    loading () {
      return (!this.authorData || !this.postData)
    },
    pageTotal () {
      return Math.ceil(this.postData.count / this.paginationSetting) || 1 // Atleast 1 page
    }
  },
  data () {
    return {
      postData: null,
      authorData: null,
      isFollowing: false,
      isLiked: false,
      expandComments: false,
      currentCommentPage: 1,
      paginationSetting: 5, // This will acquired from user once they set their pagination
      newComment: ''
    }
  },
  methods: {
    async getData (pid, aid) {
      axios.get(`/authors/${aid}/posts/${pid}`)
        .then((res) => {
          this.postData = res.data
        })
        .catch((err) => { console.log(err) })

      axios.get(`/authors/${aid}`)
        .then((res) => {
          this.authorData = res.data
        })
        .catch((err) => { console.log(err) })
    },
    toggleFollow () {
      this.isFollowing = !this.isFollowing
    },
    toggleLike () {
      this.isLiked = !this.isLiked
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
    submitComment (content) {
      // Form the content
      const comment = commentTemplate
      const generatedId = uuidv4()
      comment.author = this.authorData
      comment.id = `${this.postData.id}/comments/${generatedId}` // postID includes the author as well
      comment.comment = this.newComment
      // comment.comment = content
      console.table(comment)
      axios.post(`${this.postData.id}/comments`, comment)
        .then(() => {
          // Navigate to last page to display the comment
          this.postData.count++
          this.currentCommentPage = this.pageTotal
          this.expandComments = true
          this.newComment = '' // clear
        })
        .catch((err) => {
          console.log(err)
          alert('Couldn\'t make comment!')
        })
    }
  }
}
</script>

<style scoped>
  #single-post-container {
    padding: 0;
    margin: 0;
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
    width: 144pt;
    height: 144pt;
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
    position: fixed;
    width: min(20%, fit-content);
  }

  textarea {
    resize: none;
    min-height: 10em;
  }

  /* Right aside */
  .post-right-bar {
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
    height: 100%;
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
</style>
