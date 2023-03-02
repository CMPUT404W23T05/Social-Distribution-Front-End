<template>
  <!-- TODO: Just add slot to revised card for overlay -->
  <Card
    :author="author"
    :post="post"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  />
  <div :class="{ open: isHovered }" class="card-footer edit-footer">
    <button type="button" class="edit-button">Edit</button>
    <span class="divider">|</span>
    <button
      type="button"
      class="delete-button"
      @click="console.log('Button Clicked!')"
    >
      Delete
    </button>
  </div>
</template>

<script>
import Card from "@/components/RevisedCard.vue";

export default {
  data() {
    return {
      isHovered: false,
    };
  },
  props: ["author", "post"],
  components: { Card },
};
</script>

<style scoped>
.edit-footer.open {
  background-color: rgba(0, 0, 0, 0.8);
}

.edit-footer {
  width: 100%;
  position: absolute;
}
</style>
