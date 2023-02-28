<!-- This ideally leverages multiple v-model bindings to reduce clutter in ManagePost -->

<template>
  <!--TODO: If feasible, have the markdown render as it's typed in when enabled (and then back to plain text when disabled)  -->
    <div id="makeTextPostBody">
        <textarea
        id="text-body"
        placeholder="Let's make a post!"
        :value="body"
        @input="$emit('update:body', $event.target.value)"
        ></textarea>
        <div class="form-check form-switch">
            <input
                class="form-check-input"
                type="checkbox"
                id="markdown-toggle"
                :checked="markDownEnabled"
                @click="$emit('update:toggle', $event.target.checked)"
            />
            <label class="form-check-label" for="markdown-toggle"> {{ markDownMessage }}</label>
        </div>
    </div>
</template>

<script>
export default {
  computed: {
    markDownMessage () {
      return (this.toggle ? 'Markdown Enabled!' : 'Markdown Disabled!')
    }
  },
  props: ['body', 'toggle'],
  emits: ['update:toggle', 'update:body']
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
