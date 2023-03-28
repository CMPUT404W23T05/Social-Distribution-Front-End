<template>
  <div class="social">
    <MyRequests @update-followers="updateFollowers">Test Requests</MyRequests>
    <MyFriends ref="friends">Test Friends</MyFriends>
    <MyFollowers ref="followers">Test Followers</MyFollowers>
    <MyFollowees>Test Followees</MyFollowees>
  </div>

  <br><br>
  <h3 style="text-align: left; margin-left: 12%;">My node's authors</h3>
  <div class="authors">
    <div v-for="author in authors.items" :key="author.id">
      <author_card :author="author"/>
    </div>
  </div>

  <br><br>
  <!-- <h4>{{ authors_remote }}</h4><br>
  <h4>{{ authors_remote2 }}</h4><br> -->
  <h3 style="text-align: left; margin-left: 12%;">Other node's authors</h3>
  <div class="authors">
    <div v-for="author in authors_remote.items" :key="author.id">
      <author_card :author="author"/>
    </div>
  </div>
  <!-- <h4>{{authors}}</h4> -->
</template>

<script>
import MyFriends from '@/components/socialComponents/MyFriends.vue'
import MyRequests from '@/components/socialComponents/MyRequests.vue'
import MyFollowers from '@/components/socialComponents/MyFollowers.vue'
import MyFollowees from '@/components/socialComponents/MyFollowees.vue'
import author_card from '../components/AuthorCard.vue'
import axios from 'axios'


export default {
  name: 'SocialPage',
  data() {
    return {
      authors:[],
      authors_remote:[],
      authors_remote2: []
    }
  },
  components: {
    MyRequests,
    MyFriends,
    MyFollowers,
    MyFollowees,
    author_card
  },
  methods: {
    getAuthors() {
      axios.get(
        '/authors/')
      .then((res) => {
        this.authors = res.data
        console.log(res.data)
      })
      .catch(function(err) {
        console.log(err);
      });
    },
    getRemoteAuthors2() {
      axios.request({baseURL: 'https://sd7-api.herokuapp.com/api/', url:'authors/', headers: {Authorization: 'Basic '+ btoa('node01:P*ssw0rd!')}})
      .then((res) => {
        this.authors_remote = res.data
        console.log(res.data)
      })
      .catch(function(err) {
        console.log(err);
      });
    },
    getRemoteAuthors() {
      axios.request({ baseURL: 'https://socialdistcmput404.herokuapp.com/api/', url:'authors/', headers:{ Authorization: 'Token d960c3dee9855f5f5df8207ce1cba7fc1876fedf'}})
      .then((res) => {
        this.authors_remote = res.data
        console.log(res.data)
      })
      .catch(function(err) {
        console.log(err);
      }); 

    },
    updateFollowers () {
      this.$refs.followers.getFollowers()
      this.$refs.friends.getFriends()
    }
  },
  mounted () {
    this.getAuthors()
    this.getRemoteAuthors()
    this.getRemoteAuthors2()
  }
}
</script>

<style scoped>
  .authors{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2% 2% 2% 2%;
    justify-content: space-around;
    row-gap: 20px;
    margin-left: 5%;
    margin-right: 5%;
  }
</style>