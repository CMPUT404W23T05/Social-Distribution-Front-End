<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <!-- Pass a default image if none is provided -->
        <img id = "profile-picture" class = "circle" src = https://cdn.allthings.how/wp-content/uploads/2020/10/allthings.how-how-to-change-your-profile-picture-on-google-meet-profile-photo-759x427.png alt = 'User profile picture'>
        <span id = username>@username</span>
        
        <ul class="navbar-nav">
            <li class = 'nav-item dropdown active'>
                <router-link to = "/Home" class = "nav-link">Home</router-link>
                <ul class="dropdown-menu">
                    <router-link to="/Home/Inbox" class = "dropdown-item"> Inbox </router-link>
                    <router-link to="/Home/ManagePosts" class = "dropdown-item"> Manage Posts </router-link>
                </ul>
            </li>
            <li class = 'nav-item'>
                <router-link to = "/Browse" class="nav-link" > Browse </router-link>
            </li>
            <li class = 'nav-item dropdown'>
                <router-link to = "/Social" class="nav-link"> Social </router-link>
                <ul class="dropdown-menu">
                    <router-link to="/Social#Requests" class = "dropdown-item">Requests</router-link>
                    <router-link to="/Social#Friends" class = "dropdown-item">Friends</router-link>
                    <router-link to="/Social#Followers" class = "dropdown-item">Followers</router-link>
                    <router-link to="/Social#Followees" class = "dropdown-item">Followees</router-link>
                </ul>
            </li>
            <li class = 'nav-item dropdown'>
                <router-link to = "/Settings" class="nav-link"> Settings </router-link>
                <ul class="dropdown-menu">
                    <router-link to="/Settings#Profile" class = "dropdown-item">Profile</router-link>
                    <router-link to="/Settings#Preferences" class = "dropdown-item">Preferences</router-link>
                </ul>
            </li>
        </ul>

        <span id="logout">Signout</span>

    </nav>
</template>

<script>
export default {}
</script>

<style scoped>

    #profile-picture {
        height: 32pt;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 50%;
        vertical-align: middle;
        padding: 2pt;
    }

    .active {
        background-color: #4998F5;
    }

    .nav-item {
        flex: 1;
        margin: 0;
        padding: 0;
    }

    .dropdown:hover .dropdown-menu {
    display: block;
    margin-top: 0;
    padding-top: 0;
    text-align: center;
    width: 100%;
    border-radius: 0;
    }

    .navbar-nav {
        flex: 0.5
    }

    .navbar {
        padding: 0 5pt 0 0;
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
