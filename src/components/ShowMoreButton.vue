<template>
<button type="button" class="btn btn-outline-primary btn-lg btn-block mt-5" id="show-more" @click="myOnClick">
    <slot>Show more</slot>
        </button>
    </template>

<script>
export default {
  emits: ['showMore'],
  methods: {
    myOnClick () {
      this.$emit('showMore')
    }
  }
}
</script>

<style scoped>
#show-more {
 width: 50%;
}
</style>
