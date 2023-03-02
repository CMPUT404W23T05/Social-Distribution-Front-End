<template>
  <div class="pop-up">
    <div class="pop-up-content">
      <slot />
      <button class="exit btn" @click="($event) => $emit('clickOut')">
        No, Take me back!
      </button>
      <button class="accept btn">Yep!</button>
      <input
        type="checkbox"
        checked="false"
        id="dismiss"
        @click="($event) => $emit('dismissPrompt', $event.target.checked)"
      />
      <label for="dismiss">Don't show me again</label>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['dismissPrompt']
}
</script>

<style scoped>
.pop-up {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  backdrop-filter: blur(2pt);
  backdrop-filter: brightness(45%);

  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-up-content {
  background: #fff;
  padding: 16pt;
}
</style>
