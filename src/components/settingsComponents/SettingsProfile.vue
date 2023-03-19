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
  <!-- Edit profile picture modal -->
  <SlotModal :modal-name="'profileImageModal'" @submit-my-form="submitProfileImageForm" @clear-fields="prefillProfileImageURL">
    <template #titleText>Edit profile picture</template>
    <template #body="scoped">
      <form @submit.prevent="scoped.submitMethod" id="profileImageForm">
        <div class="mb-3">
          <label for="newProfileImage" class="form-label">New profile image URL</label>
          <input class="form-control" id="newProfileImage" v-model="fields.newProfileImageURL" type="url" required>
        </div>
          </form>
    </template>
    <template #submitButton>
      <button type="submit" class="btn btn-primary" form="profileImageForm">Change profile picture</button>
    </template>
    <template #openModalButton>
      <div class="edit-overlay rounded-circle" role="button" data-bs-toggle="modal" data-bs-target="#profileImageModal" @click="prefillProfileImageURL"><i class="bi bi-pencil-fill overlay-icon" id="edit-image-icon"></i></div>
    </template>
      </SlotModal>
  <!-- <div class="edit-overlay rounded-circle" role="button" @click="promptImageURL"><i class="bi bi-pencil-fill overlay-icon"></i></div> -->
</div>
    <!-- Settings for names and password -->
  <div class="d-flex flex-column p-4 text-start">
    <!-- Display name field with clickable edit icon -->
  <div><span class="display-name">Display Name: @{{ getAuthorPropertyIfDefined('displayName') }}</span>&nbsp;
    <!-- Edit display name modal -->
    <SlotModal :modal-name="'displaynameModal'" @submit-my-form="submitDisplaynameForm" @clear-fields="prefillDisplayName" >
    <template #openModalButton>
      <i class="bi bi-pencil-fill"  role="button" data-bs-toggle="modal" data-bs-target="#displaynameModal" @click="prefillDisplayName"></i>
    </template>
    <template #titleText>Edit display name</template>
    <template #body="scoped">
        <form @submit.prevent="scoped.submitMethod" id="displaynameForm">
            <label for="newDisplayName" class="form-label">New display name</label>
            <!-- display name input -->
            <div class="input-group mb-3">
            <div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">@</span></div>
            <input class="form-control" type="text" id="newDisplayName" v-model="fields.newDisplayName" required>
          </div>

        </form>
        </template>
          <template #submitButton>
            <button type="submit" class="btn btn-primary" form="displaynameForm">Change display name</button>
            </template>

    ></SlotModal>
  </div>
  <!-- Username field with clickable edit icon -->
<div><span class="username">Username: {{ this.userStore.user.username }}</span>&nbsp;

  <!-- Edit username modal -->
  <SlotModal
    :modal-name="'usernameModal'"
     @submit-my-form="submitUsernameForm" @clear-fields="clearFields">
    <template #titleText>Edit username</template>
    <template #body="scoped">
      <form @submit.prevent="scoped.submitMethod" id="usernameForm">
        <div class="mb-3">
        <label for="currentPassword" class="form-label">Password</label>
        <input class="form-control" type="password" id="currentPassword" v-model="fields.currentPassword" required>
        </div>
        <div class="mb-3">
          <label for="newUsername" class="form-label">New username</label>
          <input class="form-control" type="text" id="newUsername" v-model="fields.newUsername" required>
        </div>
          </form>
    </template>
    <template #submitButton>
      <button type="submit" class="btn btn-primary" form="usernameForm">Change username</button>
    </template>
    <template #openModalButton>
      <i class="bi bi-pencil-fill"  role="button" data-bs-toggle="modal" data-bs-target="#usernameModal"></i>
    </template>
      <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearFields" ref="closeModalButton"></button> -->
  </SlotModal></div>
<!-- Change password modal -->
<SlotModal :modal-name="'passwordModal'" @submit-my-form="submitPasswordForm" @clear-fields="clearFields">
  <template #titleText>Change password</template>
  <template #body="scoped">
    <form @submit.prevent="scoped.submitMethod" id="passwordForm">
    <div class="mb-3">
      <label for="currentPassword" class="form-label">Current password</label>
      <input class="form-control" type="password" id="currentPassword" v-model="fields.currentPassword" required>
    </div>
      <div class="mb-3">
        <label for="newPassword" class="form-label">New password</label>
        <input class="form-control" type="password" id="newPassword" v-model="fields.newPassword" required>
      </div>
      <div class="mb-3">
        <label for="confirmNewPassword" class="form-label">Confirm new password</label>
        <input class="form-control" type="password" id="confirmNewPassword" v-model="fields.confirmNewPassword" required>
      </div>
        </form>
  </template>
  <template #submitButton>
    <button type="submit" class="btn btn-primary" form="passwordForm">Change password</button>
  </template>
  <template #openModalButton>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#passwordModal">
  <i class="bi bi-lock-fill"></i> Change password
</button>
  </template>
  </SlotModal>
  <!-- <PasswordChangeModal @alert="showAlert"></PasswordChangeModal> -->

</div>
</div>

</div>

</template>
<script>
import { useUserStore } from '@/stores/user'
import SlotModal from '../SlotModal.vue'
import { mapStores } from 'pinia'
import axios from 'axios'
import { errorToString } from '@/util/authErrorHandler'
export default {
  name: 'SettingsProfile',
  components: {
    SlotModal
  },
  data () {
    return {
      alert: {
        msg: '',
        type: ''
      },
      errorMsg: '',
      fields: {
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        confirmNewPassword: '',
        newDisplayName: '',
        newProfileImageURL: ''
      }

    }
  },
  methods: {
    showAlert (msg, type) {
      this.alert.msg = msg
      this.alert.type = 'alert-' + type
      console.log(this.alert)
    },
    promptImageURL () {
      // simple javascript prompt to get new image URL, replace with Vue component later
      const url = prompt('Enter a new image URL')
      if (url) {
        this.updateAuthorField('profileImage', url)
      }
    },
    updateAuthorField (type, newValue, { done, e }) {
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
          done()
        })
        .catch((error) => {
          console.log(error)
          this.showAlert(readableFieldNames[type] + ' update failed!', 'danger')
          e(errorToString(error))
        })
    },
    getAuthorPropertyIfDefined (prop) {
      return this.userStore.user.author ? this.userStore.user.author[prop] : '' // return an author property only if author exists else return empty string
    },
    clearFields () {
      for (const field in this.fields) {
        this.fields[field] = ''
      }
    },
    // Methods for username change modal
    submitUsernameForm ({ done, e }) {
      // key value pairs of username and password
      const formData = {
        current_password: this.fields.currentPassword,
        new_username: this.fields.newUsername
      }
      axios
        .post('/users/set_username/', formData)
        .then(response => {
          console.log(response)
          const newName = this.fields.newUsername
          this.showAlert('Username changed successfully. Your username is now "' + newName + '".', 'success')
          this.updateLocalUsername(newName) // update local storage
          done() // tell modal to clean up and close
        })
        .catch(error => {
          console.log(error)
          const formattedFieldNames = { current_password: 'Password', new_username: 'New username' }

          const errorString = errorToString(error, formattedFieldNames)
          e(errorString) // send error to modal
        })
    },
    updateLocalUsername (newUsername) {
      const userStore = this.userStore
      userStore.initializeStore()
      const user = userStore.user
      user.username = newUsername
      localStorage.setItem('user', JSON.stringify(userStore.user))
    },

    // methods for password change modal
    submitPasswordForm ({ done, e }) {
      // key value pairs of username and password
      const formData = {
        current_password: this.fields.currentPassword,
        new_password: this.fields.newPassword,
        re_new_password: this.fields.confirmNewPassword
      }
      // client side validation
      if (this.fields.newPassword !== this.fields.confirmNewPassword) {
        e('New passwords do not match.')
      } else {
        axios
          .post('/users/set_password/', formData)
          .then(response => {
            console.log(response)
            this.showAlert('Password changed successfully.', 'success')
            done() // tell modal to clean up and close
          })
          .catch(error => {
            // server side validation or error
            console.log(error)
            const formattedFieldNames = { current_password: 'Current password', new_password: 'New password', re_new_password: 'Confirm new password', non_field_errors: 'Error' }
            const errorString = errorToString(error, formattedFieldNames)
            e(errorString) // send error to modal
          })
      }
    },
    // methods for display name change modal
    submitDisplaynameForm ({ done, e }) {
      this.updateAuthorField('displayName', this.fields.newDisplayName, { done, e })
    },
    prefillDisplayName () {
      this.fields.newDisplayName = this.getAuthorPropertyIfDefined('displayName')
    },
    // methods for profile image change modal
    submitProfileImageForm ({ done, e }) {
      this.updateAuthorField('profileImage', this.fields.newProfileImageURL, { done, e })
    },
    prefillProfileImageURL () {
      this.fields.newProfileImageURL = this.getAuthorPropertyIfDefined('profileImage')
      console.log(this.fields.newProfileImageURL)
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
}
#edit-image-icon {
  color: #fff;
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
