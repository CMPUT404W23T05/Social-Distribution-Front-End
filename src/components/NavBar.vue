<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <!-- Pass a default image if none is provided -->
    <router-link to="/settings#profile" class="user-info">
      <div>
        <img
          id="profile-picture"
          class="circle"
          :src="author.profile_image"
          alt="User profile picture"
        />
        <span id="username">@{{ author.display_name }}</span>
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
                <router-link to = "/browse" class="nav-link"> Browse </router-link>
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
    <span id="logout">Signout</span>
  </nav>
</template>

<script>
export default {
  // Author json object
  props: ['author']
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
