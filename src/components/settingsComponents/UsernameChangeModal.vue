<template>
    <!-- Password modal, starts hidden -->
    <div class="modal fade" tabindex="-1" id="usernameModal" ref="usernameModal" aria-labelledby="usernameModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="usernameModalLabel">Change username</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearFields" ref="closeModalButton"></button>
        </div>
        <div class="modal-body text-start">
          <div class="alert alert-danger" v-show="authError">{{ authError }}</div>
          <form @submit.prevent="submitForm" id="usernameForm">
      <div class="mb-3">
        <label for="currentPassword" class="form-label">Password</label>
        <input class="form-control" type="password" id="currentPassword" v-model="currentPassword" >
      </div>
        <div class="mb-3">
          <label for="newUsername" class="form-label">New username</label>
          <input class="form-control" type="text" id="newUsername" v-model="newUsername">
        </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="clearFields">Close</button>
          <button type="submit" class="btn btn-primary" form="usernameForm">Change username</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Button to open the username modal -->
  <i class="bi bi-pencil-fill"  role="button" data-bs-toggle="modal" data-bs-target="#usernameModal"></i>
  </template>

<script>
import axios from 'axios'
import { errorToString } from '@/util/authErrorHandler'
import { useUserStore } from '@/stores/user'
export default {
  name: 'UsernameChangeModal',
  emits: ['alert'],
  data () {
    return {
      currentPassword: '',
      newUsername: '',
      authError: ''
    }
  },
  methods: {
    submitForm (e) {
      // key value pairs of username and password
      const formData = {
        new_username: this.newUsername,
        current_password: this.currentPassword,
        re_new_password: this.confirmNewPassword
      }

      axios
        .post('/users/set_username/', formData)
        .then(response => {
          console.log(response)
          const newName = this.newUsername
          this.closeModal()
          this.updateLocalUsername(newName)
          this.successAlert(newName)
          this.clearFields()
        })
        .catch(error => {
          console.log(error)
          const formattedFieldNames = { current_password: 'Password', new_username: 'New username' }

          const errorString = errorToString(error, formattedFieldNames)
          this.authError = errorString
        })
    },
    clearFields () {
      this.currentPassword = ''
      this.newUsername = ''
      this.authError = ''
    },
    closeModal () {
      this.$refs.closeModalButton.click()
    },
    successAlert (newName) {
      this.$emit('alert', 'Username changed successfully. Your username is now "' + newName + '".', 'success')
    },
    updateLocalUsername (newUsername) {
      const userStore = useUserStore()
      userStore.initializeStore()
      const user = userStore.user
      user.username = newUsername
      localStorage.setItem('user', JSON.stringify(userStore.user))
    }
  }
}

</script>
