<template>
  <div class="social">
    <MyRequests>Test Requests</MyRequests>
    <MyFriends>Test Friends</MyFriends>
    <MyFollowers>Test Followers</MyFollowers>
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
  }
}
</script>
