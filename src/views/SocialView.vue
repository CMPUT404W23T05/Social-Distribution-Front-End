<template>
  <div class="social">
    <MyRequests @update-followers="updateFollowers">Test Requests</MyRequests>
    <MyFriends ref="friends">Test Friends</MyFriends>
    <MyFollowers ref="followers">Test Followers</MyFollowers>
    <MyFollowees>Test Followees</MyFollowees>
  </div>
</template>

<script>
import MyFriends from '@/components/socialComponents/MyFriends.vue'
import MyRequests from '@/components/socialComponents/MyRequests.vue'
import MyFollowers from '@/components/socialComponents/MyFollowers.vue'
import MyFollowees from '@/components/socialComponents/MyFollowees.vue'

export default {
  name: 'SocialPage',
  components: {
    MyRequests,
    MyFriends,
    MyFollowers,
    MyFollowees
  },
  methods: {
    updateFollowers () {
      this.$refs.followers.getFollowers()
      this.$refs.friends.getFriends()
    }
  }
}
</script>