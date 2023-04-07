<template>
    <div class="about pt-5 pb-5 d-flex justify-content-center">
      <div class="d-flex flex-column gap-4 align-items-center">
        <div class="d-flex rounded-circle justify-content-center align-items-center" id="circle-404">
          <h1 id="text-404">404</h1>
        </div>
    <div id="message">
      <h1>Whoops!</h1>
      <h2>We couldn't find this page.</h2>
      <h2>The link you followed may be invalid, or the page may have been moved or deleted.</h2>
    </div>
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
  font-size: calc(0.7em + 1.5vw);
}
h2 {
  font-size:calc(0.1em + 1vw); /* maintain minimum font size */
}
a {
  color: var(--bs-primary);
  text-decoration: none;
  font-size: calc(0.3em + 0.8vw)
}
</style>
