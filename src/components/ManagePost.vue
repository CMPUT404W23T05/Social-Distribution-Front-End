<template>
  <div class="container col-6">
    <span v-for="(state, i) in states" :key="i">
      <button class="btn" :class= "{'active': state === currentState}" @click="updateState(state)">
        {{state}}
      </button>
    </span>
    <form action="gotothedesiredURL" method="POST">
      <input v-model="title" class='text-input' placeholder = "Write a title for your post">
      <TextPostBody v-if="isText" class ='text-input' v-model:body="content" v-model:toggle="markDownEnabled"/>
    </form>
    <button class="btn">Post</button>
  </div>
</template>

<script>
import TextPostBody from '@/components/TextPostBody.vue'

export default {
  data () {
    return {
      states: ['text', 'image'],
      title: '',
      content: '',
      markDownEnabled: false,
      isText: true
    }
  },
  props: ['author'],
  components: {
    TextPostBody
  },
  methods: {
    updateState (state) {
      this.isText = (state === 'text')
    }
  },
  computed: {
    currentState () {
      return (this.isText ? 'text' : 'image')
    }
  }
}
</script>

<style>

  .container {
    padding-top: 25pt;
  }

  .active {
    background-color: #4998F5;
    color: white;
  }

  .text-input {
    width: 100%;
    resize: none;
    border-radius: 0;
  }

  .btn {
    width: 50%;
    text-transform: capitalize;
    border-bottom: 2pt solid #4998F5;
  }
</style>
