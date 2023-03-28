<!-- This represents the most basic card with only hover functionality -->

<template>
  <div id="card-totality" v-if="title">
    <div class="post-title">
      <h3 class="title-text">{{ title }}</h3>
    </div>
    <div
      class="card-body card"
      @mouseover="toggleHover"
      @mouseleave="toggleHover"
    >
      <div class="content-container">
        <div class="decoration-accent" v-if="title"></div>
        <div class="scrim" :class="{open: hovered}"></div>
        <slot name="card-content">
          Placeholder Content :3
        </slot>
      </div>
      <div :class="{ open: hovered }" class="footer card-footer text-muted">
        <!-- Won't appear unless supplied -->
        <slot name="footer" :class="{ open: hovered }"></slot>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  emits: ['hovered', 'unhover'],
  props: ['title'],
  methods: {
    toggleHover () {
      this.hovered = !this.hovered
      this.$emit(this.hovered ? 'hovered' : 'unhover')
    }
  },
  data () {
    return {
      hovered: false
    }
  }
}

</script>

<style scoped>
  .post-title {
    font-size: 16pt;
    white-space: nowrap;
    overflow: hidden;
    color: #2c2c2c;
    font-weight: bold;
    text-transform: none;
  }
  .title-text {
    font-size: large;
  }
  .content-container {
    display: flex;
    height: 100%;
    padding: 0;
    margin: 0.5em 0.8em;
    background-color: #f7f7f7;
    text-align: left;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: content-box;
  }

  .scrim {
    position: absolute;
    height: 60%;
    width: 100%;
    bottom: 0;
    opacity: 0;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
    transition: 0.35s
  }
/* Hover transition shadow */
  .scrim.open {
    opacity: 100;
  }

  .decoration-accent {
    position: absolute;
    border-right: 2pt solid #4998F5;
    border-top: 2pt solid #4998F5;

    width: 92.5%;
    height: calc(100% + 20pt);
    top: -28pt;
    right: 0.8em;
  }

  .footer {
    display: flex;
    position: absolute;
    bottom: 0;
    height: 0;
    border: none;
    width: 100%;
    border-radius: 0 !important;
    background-color: rgba(70, 70, 70, 1);
    transition: 0.35s;
    align-items: center;
    overflow: hidden;
    padding:0;
  }

  .footer.open {
    height: 20%;
    color: #FFF !important;
    background-color: rgba(70,70,70, 0.8);
    margin-left: 0;
    overflow: visible;

  }

  .card {
    /* width: 15%; */
    min-height: 200pt;
    min-width: 300pt;
    margin: 0pt;
    padding: 2pt 0;
    width: 120pt;
    height: 144pt;
    display: flex;
    border: none;
    border-radius: 0;
    background-color: #ffffff;

    box-shadow: 0.1rem 0.25rem 0.5rem rgba(0,0,0,0.25);
  }

</style>
