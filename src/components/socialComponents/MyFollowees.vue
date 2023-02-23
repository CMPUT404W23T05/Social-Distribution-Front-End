<template>
<div class="list-of-profiles" id="followees">
  <h1> Your <br/> Followees</h1>
  <ul>
    <li v-for="author in authors" :key="author.id">
      <img :src="author.profile_image">
      <p>{{displayUsername(author.display_name)}}</p>
    </li>
  </ul>
</div>
  </template>

<script>

export default {
  data () {
    return {
      authors: [
        {
          id: 1,
          display_name: 'followee1',
          profile_image: 'http://i.imgur.com/k7XVwpB.jpeg'
        },

        {
          id: 2,
          display_name: 'followee2',
          profile_image: 'http://i.imgur.com/k7XVwpB.jpeg'
        }
      ]
    }
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    }
  }

}

</script>

  <style>
  /* list items that are direct children of unordered list*/
  .list-of-profiles ul>li{
    display: inline-block
  }
  /* p tags that are children of the class list of profiles */
  .list-of-profiles p{
    margin: 10px;
  }

  img {
    width: 100px;
    height: 100px;
    margin: 10px;
  }
  </style>
