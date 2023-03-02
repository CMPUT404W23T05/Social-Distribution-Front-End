<!-- This ideally leverages multiple v-model bindings to reduce clutter in ManagePost -->

<template>
  <!--TODO: If feasible, have the markdown render as it's typed in when enabled (and then back to plain text when disabled)  -->
  <div id="makeTextPostBody">
    <textarea
      id="text-body"
      placeholder="Let's make a post!"
      :value="localBody"
      @input="updateBody"
    ></textarea>
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="markdown-toggle"
        :checked="localToggle"
        @click="updateToggle"
      />
      <label class="form-check-label" for="markdown-toggle">
        {{ markDownMessage }}</label
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ['body', 'toggle'],
  data () {
    return {
      localBody: '',
      localToggle: false
    }
  },
  computed: {
    markDownMessage () {
      return this.localToggle ? 'Markdown Enabled!' : 'Markdown Disabled!'
    }
  },
  methods: {
    updateToggle (event) {
      this.localToggle = event.target.checked
      this.emitStatus()
    },
    updateBody (event) {
      this.localBody = event.target.value
      this.emitStatus()
    },
    emitStatus () {
      this.$emit('changeTextPost', {
        body: this.localBody,
        toggle: this.localToggle
      })
    }
  },
  emits: ['change-text-post'],
  watch: {
    body: {
      immediate: true,
      handler (newValue, oldValue) {
        this.localBody = newValue
      }
    },
    toggle: {
      immediate: true,
      handler (newValue, oldValue) {
        this.localToggle = newValue
      }
    }
  }
}
</script>

<style>
#markdown-toggle {
  float: none;
}
#text-body {
  width: 100%;
  height: 20em;
  resize: none;
  border-radius: 0;
}
</style>
