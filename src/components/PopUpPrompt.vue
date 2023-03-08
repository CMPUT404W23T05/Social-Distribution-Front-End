<template>
  <div class="pop-up">
    <div class="pop-up-content">
      <slot />
      <button class="exit btn" @click="($event) => $emit('dismiss')">
        No, Take me back!
      </button>
      <button class="accept btn" @click="$emit('accept')">Yep!</button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['dismiss', 'accept']
}
</script>

<style scoped>
.pop-up {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  backdrop-filter: blur(1pt) brightness(25%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-up-content {
  background: #fff;
  padding: 16pt;
}

.exit {
  font-weight: bold;
  color: #921007;
}
</style>
