<template>
  <div class="alert fade show alert-dismissible" :class="[alert.type]" role="alert" v-if="alert.msg">
    {{ alert.msg }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>
  <h1>Profile</h1>
  <h2>Settings</h2>
  <div class="d-flex justify-content-center">
  <div class="d-flex">
    <div class="image-container">
  <img class = "settings-profile-image rounded-circle" :src="getProfileImage" alt = 'User profile picture'/>
  <div class="edit-overlay rounded-circle" role="button"><i class="bi bi-pencil-fill overlay-icon"></i></div>
</div>
  <div class="d-flex flex-column p-4 text-start">
  <span class="display-name">Display Name: @{{ getDisplayName }}</span>
  <span class="username">Username: {{ getUsername }}</span>
  <PasswordChangeModal @alert="showAlert"></PasswordChangeModal>
</div>

</div>

</div>

</template>
<script>
import { useUserStore } from '@/stores/user'
import PasswordChangeModal from '@/components/settingsComponents/PasswordChangeModal.vue'
export default {
  name: 'SettingsProfile',
  components: {
    PasswordChangeModal
  },
  data () {
    return {
      alert: {
        msg: '',
        type: ''
      }
    }
  },
  methods: {
    getUser () {
      const userStore = useUserStore()
      userStore.initializeStore()
      const user = userStore.user
      if (user) {
        return user
      } else {
        console.log('could not retrieve author property')
        return null
      }
    },
    showAlert (msg, type) {
      this.alert.msg = msg
      this.alert.type = 'alert-' + type
      console.log(this.alert)
    }
  },
  computed: {

    getDisplayName () { // get display name from user store
      return this.getUser().author.displayName
    },
    getProfileImage () { // get profile picture from user store
      return this.getUser().author.profileImage
    },
    getUsername () {
      return this.getUser().username
    }

  }
}
</script>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
.edit-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8rem;
  width: 8rem;
  transition: .5s ease;
  background-color: rgba(0, 0, 0, 0);
  opacity: 0;
  text-align: center;
}
.image-container:hover .edit-overlay {
  background-color:rgba(0, 0, 0, 0.5);
  opacity: 1;
}
.image-container {
  position: relative;
  text-align: center;
  color: white;
}
.settings-profile-image {
  height: 8rem;
  width: 8rem;
  margin: 0;
}
.overlay-icon {
  line-height: 8rem;
  font-size: 1.5em;
}

</style>
