<template>
 <div class="comment-body" >
    <p v-if="!markdown" :class="{decoration: flairDecorate}">{{ comment.comment }}</p>
    <VueMarkdown v-else :source="comment.comment" :class="{decoration: flairDecorate}"></VueMarkdown>
    <div class="commenter">
        <span>{{ displayName }}</span>
        <!-- OP, same as current session user, etc. -->
        <slot name="flair"></slot>
    </div>
    <div class="date">{{ dateFormatted }}</div>
 </div>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'
import moment from 'moment'

export default {
  props: { comment: Object },
  components: { VueMarkdown },
  computed: {
    dateFormatted () {
      const commentDate = moment(this.comment.published).format('YYYY/MM/DD')
      const now = moment().format('YYYY/MM/DD')

      return commentDate === now
        ? 'today'
        : commentDate
    },
    displayName () {
      return `@${this.comment.author.displayName}`
    },
    flairDecorate () {
      // Special behaviour when flair is present
      return !!this.$slots.flair
    },
    markdown () {
      return /markdown$/.test(this.comment.contentType)
    }
  }
}

</script>

<style>
  /* Style overall content when flair is present */
  .decoration {
    font-weight: bold;
  }

  .comment-body {
    background: #FFF;
    margin: 1em;
    padding: 0.5em 1.5em;
    width: 20svw;
    border-left: #1e1e1e solid 2pt;
    text-align: left;
    color: #1e1e1e
  }

  .commenter, .date {
    color: #736666;
    font-size: 0.8em;
  }

</style>
