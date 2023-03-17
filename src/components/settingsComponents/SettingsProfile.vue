<template>
  <div class="alert fade show alert-dismissible" :class="[alert.type]" role="alert" v-if="alert.msg">
    {{ alert.msg }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>
  <h1>Profile</h1>
  <h2>Settings</h2>
  <div class="d-flex justify-content-center">
  <div class="d-flex">
    <!-- Profile picture and the edit overlay that shows on hover-->
    <div class="image-container">
  <img class = "settings-profile-image rounded-circle" :src="getAuthorPropertyIfDefined('profileImage')" alt = 'User profile picture'/>
  <div class="edit-overlay rounded-circle" role="button" @click="promptImageURL"><i class="bi bi-pencil-fill overlay-icon"></i></div>
</div>
    <!-- Settings for names and password -->
  <div class="d-flex flex-column p-4 text-start">
    <!-- Display name field with clickable edit icon -->
  <div><span class="display-name">Display Name: @{{ getAuthorPropertyIfDefined('displayName') }}</span>&nbsp;<i class="bi bi-pencil-fill"  role="button" @click="promptNewDisplayName"></i></div>
  <!-- Username field with clickable edit icon -->
<div><span class="username">Username: {{ this.userStore.user.username }}</span>&nbsp;<UsernameChangeModal @alert="showAlert"></UsernameChangeModal></div>
<!-- Change password botton -->
  <PasswordChangeModal @alert="showAlert"></PasswordChangeModal>
</div>

</div>

</div>

</template>
<script>
import { useUserStore } from '@/stores/user'
import PasswordChangeModal from '@/components/settingsComponents/PasswordChangeModal.vue'
import UsernameChangeModal from './UsernameChangeModal.vue'
import { mapStores } from 'pinia'
import axios from 'axios'
export default {
  name: 'SettingsProfile',
  components: {
    PasswordChangeModal,
    UsernameChangeModal
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
    showAlert (msg, type) {
      this.alert.msg = msg
      this.alert.type = 'alert-' + type
      console.log(this.alert)
    },
    promptNewDisplayName () {
      // simple javascript prompt to get new display name, replace with Vue component later
      const name = prompt('Enter a new display name')
      if (name) {
        this.updateAuthorField('displayName', name)
      }
    },
    promptImageURL () {
      // simple javascript prompt to get new image URL, replace with Vue component later
      const url = prompt('Enter a new image URL')
      if (url) {
        this.updateAuthorField('profileImage', url)
      }
    },
    updateAuthorField (type, newValue) {
      // update author field with newValue in backend and local storage
      const readableFieldNames = {
        displayName: 'Display name',
        profileImage: 'Profile image'
      }
      this.userStore.initializeStore()
      const user = this.userStore.user
      const author = user.author
      author[type] = newValue
      axios.post('/authors/' + author.id + '/', author)
        .then((response) => {
          console.log(response)
          this.showAlert(readableFieldNames[type] + ' sucessfully updated!', 'success')
          this.userStore.setUser(user) // update user store and local storage
        })
        .catch((error) => {
          console.log(error)
          this.showAlert(readableFieldNames[type] + ' update failed!', 'danger')
        })
    },
    getAuthorPropertyIfDefined (prop) {
      return this.userStore.user.author ? this.userStore.user.author[prop] : '' // return an author property only if author exists else return empty string
    }
  },
  computed: {
    ...mapStores(useUserStore)

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
