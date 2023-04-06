<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky_navbar px-5">
        <!-- Pass a default image if none is provided -->
        <div class="d-flex align-items-center gap-2">
          <!-- Get profile picture from userStore - using any data variable breaks reactivity at the moment so this is the only way -->
          <img id = "profile-picture" v-if="user" class = "circle" :src="getAuthorPropertyIfDefined('profileImage')" alt = 'User profile picture' />
          <!-- Get username from userStore -->
          <span id = 'display-name' class="fw-bold" v-if="user">@{{ getAuthorPropertyIfDefined('displayName') }}</span>
        </div>

        <ul class="navbar-nav">
            <li class = 'nav-item dropdown'>
                <router-link :to="{ name: 'homepage' }" class = "nav-link">Home</router-link>
                <ul class="dropdown-menu">
                    <router-link :to="{ name: 'manageposts'}" class = "dropdown-item"> Manage Posts </router-link>
                </ul>
            </li>
            <li class = 'nav-item'>
                <router-link :to="{ name: 'browsepage' }" class="nav-link"> Browse </router-link>
            </li>
            <li class = 'nav-item dropdown'>
                <router-link to = "/social" class="nav-link" exact> Social </router-link>
                <ul class="dropdown-menu">
                    <router-link :to="{name: 'SocialPage', hash:'#follows'}" class = "dropdown-item">Your Social</router-link>
                    <router-link :to="{name: 'SocialPage', hash:'#localNode'}" class = "dropdown-item">Local Authors</router-link>
                    <router-link :to="{name: 'SocialPage', hash:'#node7'}" class = "dropdown-item">Node 7 Authors</router-link>
                    <router-link :to="{name: 'SocialPage', hash:'#node10'}" class = "dropdown-item">Node 10 Authors</router-link>
                </ul>
            </li>
            <li class = 'nav-item dropdown'>
              <router-link to = "/Settings" class="nav-link"> Settings </router-link>
            </li>
        </ul>
        <!-- TODO: replace with actual logout -->
        <span id="logout"><button class="btn btn-primary" @click="logout">Log out <i class="bi bi-door-closed"></i> </button></span>

    </nav>

    <div class="justify-content-center d-flex" v-if="alreadyLoggedIn">
      <!-- alert for redirect from login/signup page -->
    <div class="alert alert-primary fade show w-50 p-2 m-0 mt-3 d-flex justify-content-center login-alert position-absolute" role="alert">
      <div class="flex-grow-1">You are already logged in. To switch accounts, please <a @click="logout" href="#" class="alert-link ">log&nbsp;out</a>.</div>
      <button type="button" class="btn-close " data-bs-dismiss="alert" aria-label="Close"></button>
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
  data () {
    return {
      alreadyLoggedIn: false
    }
  },
  beforeMount () {
    // this.getProfilePicture()
    this.userStore.initializeStore() // initialize user store
  },
  updated () {
    this.alreadyLoggedIn = this.alreadyLoggedInQuery()
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
    },
    alreadyLoggedInQuery () {
      return !!this.$route.query.loggedin // if query param loggedin set, return true
    }
  },
  computed: {
    ...mapStores(useTokenStore, useUserStore),
    ...mapState(useUserStore, ['user'])
  }
}

</script>

<style scoped>
.sticky_navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    border: none;
}

#profile-picture {
    height: 30pt;
    width: 30pt;
    object-fit: cover;
    border-radius: 50%;
}

/* Whether link is active home/etc/etc/ or not */
li > .active {
  background-color: #4998f5;
}

/* Force overwrite active sub-links */
.dropdown-item.active {
  background-color: #fff;
  color: #000;
}

.dropdown-item.active:hover {
  background-color: #efefef;
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
  border: none;
}

.btn {
  background-color: transparent;
  border: none;
}

.btn:hover {
  background-color: transparent;
  color: #4998f5;
}

span {
  color: #fff;
  vertical-align: middle;
}

</style>
