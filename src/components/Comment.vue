<template>
 <div class="comment-body" :class="{decoration: flairDecorate}">
    <p>{{ comment.comment }}</p>
    <div class="commenter">
        <span>{{ displayName }}</span>
        <!-- OP, same as current session user, etc. -->
        <slot name="flair"></slot>
    </div>
    <div class="date">{{ dateFormatted }}</div>
 </div>
</template>

<script>
import moment from 'moment'

export default {
  props: { comment: Object },
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
    }
  }
}

</script>

<style>
  /* Style overall content when flair is present */
  .decoration {
    font-weight: bold;
  }

</style>
