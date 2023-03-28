<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky_navbar">
        <!-- Pass a default image if none is provided -->
        <router-link to="/settings#profile" class = "user-info">
            <div>
              <!-- Get profile picture from userStore - using any data variable breaks reactivity at the moment so this is the only way -->
                <img id = "profile-picture" v-if="user" class = "circle" :src="getAuthorPropertyIfDefined('profileImage')" alt = 'User profile picture' />
                <!-- Get username from userStore -->
                <span id = 'display-name'  v-if="user">@{{ getAuthorPropertyIfDefined('displayName') }}</span>
            </div>
        </router-link>

        <ul class="navbar-nav">
            <li class = 'nav-item dropdown'>
                <router-link :to="{ name: 'homepage' }" class = "nav-link">Home</router-link>
                <ul class="dropdown-menu">
                    <router-link to="/home/inbox" class = "dropdown-item"> Inbox </router-link>
                    <router-link :to="{ name: 'manageposts'}" class = "dropdown-item"> Manage Posts </router-link>
                </ul>
            </li>
            <li class = 'nav-item'>
                <router-link :to="{ name: 'browsepage' }" class="nav-link"> Browse </router-link>
            </li>
            <li class = 'nav-item dropdown'>
                <router-link to = "/social" class="nav-link"> Social </router-link>
                <ul class="dropdown-menu">
                    <router-link :to="{name: 'SocialPage', hash:'#requests'}"  class = "dropdown-item">Requests</router-link>
                    <router-link :to="{name: 'SocialPage', hash:'#friends'}" class = "dropdown-item">Friends</router-link>
                    <router-link :to="{name: 'SocialPage', hash:'#followers'}"  class = "dropdown-item">Followers</router-link>
                    <router-link :to="{name: 'SocialPage', hash:'#followees'}"  class = "dropdown-item">Followees</router-link>
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
        <span id="logout"><button class="btn btn-primary" @click="logout">Log out</button></span>

    </nav>

    <div class="justify-content-center d-flex" v-if="alreadyLoggedIn">
      <!-- alert for redirect from login/signup page -->
    <div class="alert alert-primary fade show w-50 p-2 m-3 d-flex justify-content-center login-alert position-absolute" role="alert">
      <div class="flex-grow-1">You are already logged in. To switch accounts, please <a @click="logout" href="#" class="alert-link">log&nbsp;out</a>.</div>
      <button type="button" class="btn-close py-1" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>
</template>

<script>
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import { mapStores, mapState } from 'pinia'
export default {
  name: 'NavBar',
  // Author json object
  beforeMount () {
    // this.getProfilePicture()
    this.userStore.initializeStore() // initialize user store
  },
  methods: {
    logout () {
      const token = this.tokenStore
      // post to remove token from server
      axios.post('token/logout').then(response => {
        console.log(response)
      }).catch(error => {
        console.log("'Server logout failed")
        console.log(error)
      }).finally(() => {
        // do this regardless of success or failure

        token.removeToken() // remove token from store
        localStorage.removeItem('token') // remove token from local
        // remove user from local storage and store
        localStorage.removeItem('user')
        useUserStore().removeUser()
        this.$router.push('/login') // go to login page
        // reset axios header
        axios.defaults.headers.common.Authorization = ''
      })
    },
    getAuthorPropertyIfDefined (prop) {
      return this.userStore.user.author ? this.userStore.user.author[prop] : '' // return an author property only if author exists else return empty string
    }
  },
  computed: {
    ...mapStores(useTokenStore, useUserStore),
    ...mapState(useUserStore, ['user']),
    alreadyLoggedIn () {
      const defined = typeof this.$route !== 'undefined' && this.$route !== null
      if (defined && 'hash' in this.$route) {
        return this.$route.hash === '#loggedin'
      } else {
        return false
      }
    }
  }
}

</script>

<style scoped>
.sticky_navbar {
    position: sticky;
    top: 0;
    z-index: 100;
}

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
  background-color: #4998f5;
}

/* When a dropdown item is active */
.dropdown-item:active {
  background-color: #4998f5;
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
