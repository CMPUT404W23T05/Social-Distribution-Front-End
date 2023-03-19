<template>
<div class="list-of-profiles" id="followees">
  <h1> Your <br/> Followees</h1>
  <ul>
    <li v-for="author in test_followees" :key="author.uid">
      <img :src="author.profileImage">
      <p>{{displayUsername(author.displayName)}}</p>
    </li>
  </ul>
</div>
  </template>

<script>

export default {
  data () {
    return {
      followees: [''],
      get_link: 'http://localhost:8000/api/authors/a15eb467-5eb0-4b7d-9eaf-850c3bf7970c/following/',
      test_followees: [
        {
          id: 1,
          displayName: 'followee1',
          profileImage: 'http://i.imgur.com/k7XVwpB.jpeg'
        },
        {
          id: 2,
          displayName: 'followee2',
          profileImage: 'http://i.imgur.com/k7XVwpB.jpeg'
        }
      ]
    }
  },
  methods: {
    displayUsername (username) {
      return '@' + username
    },
    async getData () {
      try {
        // who is the author following?
        const response = await this.$http.get(this.get_link)
        this.followees = response.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    // get followees when page loads
    // this.getData()
  }

}

</script>

  <style scoped>
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
