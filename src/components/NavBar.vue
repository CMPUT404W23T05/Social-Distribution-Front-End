<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <!-- Pass a default image if none is provided -->
        <router-link to="/settings#profile" class = "user-info">
            <div>
                <img id = "profile-picture" class = "circle" :src="author.profile_image" alt = 'User profile picture'/>
                <span id = username>@{{ author.display_name }}</span>
            </div>
        </router-link>

        <ul class="navbar-nav">
            <li class = 'nav-item dropdown'>
                <router-link :to="{ name: 'homepage' }" class = "nav-link">Home</router-link>
                <ul class="dropdown-menu">
                    <router-link to="/home/inbox" class = "dropdown-item"> Inbox </router-link>
                    <router-link to="/home/managePosts" class = "dropdown-item"> Manage Posts </router-link>
                </ul>
            </li>
            <li class = 'nav-item'>
                <router-link to = "/browse" class="nav-link"> Browse </router-link>
            </li>
            <li class = 'nav-item dropdown'>
                <router-link to = "/social" class="nav-link"> Social </router-link>
                <ul class="dropdown-menu">
                    <router-link to="/social#requests" class = "dropdown-item">Requests</router-link>
                    <router-link to="/social#friends" class = "dropdown-item">Friends</router-link>
                    <router-link to="/social#followers" class = "dropdown-item">Followers</router-link>
                    <router-link to="/social#followees" class = "dropdown-item">Followees</router-link>
                </ul>
            </li>
            <li class = 'nav-item dropdown'>
                <router-link to = "/Settings" class="nav-link"> Settings </router-link>
                <ul class="dropdown-menu">
                    <router-link to="/settings#profile" class = "dropdown-item">Profile</router-link>
                    <router-link to="/settings#preferences" class = "dropdown-item">Preferences</router-link>
                </ul>
            </li>
        </ul>
        <!-- TODO: replace with actual logout -->
        <span id="logout"><button @click="logout">Logout</button></span>

    </nav>
</template>

<script>
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
export default {
  // Author json object
  props: ['author'],
  methods: {
    logout () {
      const token = useTokenStore()
      token.removeToken() // remove token from store
      localStorage.removeItem('token') // remove token from local storage
      // post to remove token from server
      axios.post('token/logout').then(response => {
        console.log(response)
        this.$router.push('/login') // go to login page
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
    #profile-picture {
        height: 32pt;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 50%;
    }

    .user-info {
        margin: 0 3pt;
    }

    /* Whether link is active home/etc/etc/ or not */
    .active {
        background-color: #4998F5;
    }

    /* When a dropdown item is active */
    .dropdown-item:active {
        background-color: #4998F5;
    }

    .nav-item {
        flex: 1;
        margin: 0;
        padding: 0;
    }

    .dropdown:hover .dropdown-menu {
    display: block;
    margin: 0 0;
    padding: 0;
    text-align: center;
    justify-self: center;
    width: 100%;
    min-width: none;
    border-radius: 0;
    }

    .navbar-nav {
        flex: 0.5;
        padding: 0;
    }

    .navbar {
        padding: 0;
    }

    .navbar .navbar-nav {
        vertical-align: top;
        justify-content: center;
        margin: 0 auto;
        padding: 0;
    }

    span {
        color: #fff;
        margin: 5pt;
        vertical-align: middle;
    }

</style>
