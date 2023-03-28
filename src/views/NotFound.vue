<template>
    <div class="about pt-5 pb-5 d-flex justify-content-center">
      <div class="d-flex flex-column justify-content-center gap-4">
    <div class="d-flex rounded-circle justify-content-center align-items-center" id="circle-404">
      <h1 id="text-404">404</h1>
    </div>
    <span id="message">
      <h1>Whoops!</h1>
      <h2>We couldn't find this page.</h2>
    </span>
    <a href="#" @click="this.$router.push('/home')">Take me home!</a>

  </div>

    </div>
  </template>

<style scoped>
.about {
  color:lightgray
}
#circle-404 {
  /* background-color: #f8f9fa; */
  height: 30vw;
  width: 30vw;
  line-height: 200px;
  border-width: 0.5vw;
  border-style: solid;
  transform: rotate(10deg);
}
#text-404 {
  font-size: 15vw;
  font-weight: bold;
}
#message {
  color: #a0a0a0;
}

h1 {
  font-size: 2.1vw;
}
h2 {
  font-size: 1.5vw;
}
a {
  color: var(--bs-primary);
  text-decoration: none;
  font-size: 1.2vw;
}
</style>
