<template>
  <div class="d-flex flex-column align-items-center my-root">
    <SettingsProfile></SettingsProfile>
  </div>
  </template>

<script>
import SettingsProfile from '@/components/settingsComponents/SettingsProfile.vue'

export default {
  name: 'SettingsPage',
  components: {
    SettingsProfile
  }
}
</script>

<style scoped>
:deep(h1),:deep(h2) {
  text-align: start;
}

:deep(h2) {
  color: var(--bs-blue);
  font-weight: bold;
  display: flex;
  align-items: center;
  width: 100%;
}
:deep(h2::after) { /* the line after the header */
    background-color: var(--bs-blue); /* line color */
    content: '';
    flex: 1;
    margin-left: 1rem;
    height: 1.5pt;
}
.my-root {
  margin-top: 1em;
  width: 100%;
}
.child-root { /* the root class of the child components */
  width: 50%;
}
</style>
