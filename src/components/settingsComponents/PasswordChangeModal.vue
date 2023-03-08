<template>
  <!-- Password modal, starts hidden -->
  <div class="modal fade" tabindex="-1" id="passwordModal" ref="passwordModal" aria-labelledby="passwordModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="passwordModalLabel">Change password</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearFields" ref="closeModalButton"></button>
      </div>
      <div class="modal-body text-start">
        <div class="alert alert-danger" v-show="authError">{{ authError }}</div>
        <form @submit.prevent="submitForm" id="passwordForm">
    <div class="mb-3">
      <label for="currentPassword" class="form-label">Current password</label>
      <input class="form-control" type="password" id="currentPassword" v-model="currentPassword" >
    </div>
      <div class="mb-3">
        <label for="newPassword" class="form-label">New password</label>
        <input class="form-control" type="password" id="newPassword" v-model="newPassword">
      </div>
      <div class="mb-3">
        <label for="confirmNewPassword" class="form-label">Confirm new password</label>
        <input class="form-control" type="password" id="confirmNewPassword" v-model="confirmNewPassword">
      </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="clearFields">Close</button>
        <button type="submit" class="btn btn-primary" form="passwordForm">Change password</button>
      </div>
    </div>
  </div>
</div>
<!-- Button to open the password modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#passwordModal">
  <i class="bi bi-lock-fill"></i> Change password
</button>
</template>

<script>
import axios from 'axios'
import { errorToString } from '@/util/authErrorHandler'
export default {
  name: 'PasswordChangeModal',
  emits: ['alert'],
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      authError: ''
    }
  },
  methods: {
    submitForm (e) {
      // key value pairs of username and password
      const formData = {
        new_password: this.newPassword,
        current_password: this.currentPassword,
        re_new_password: this.confirmNewPassword
      }
      if (this.newPassword !== this.confirmNewPassword) {
        this.authError = 'New passwords do not match.'
        // clear the password fields
        this.newPassword = ''
        this.confirmNewPassword = ''
      } else {
        axios
          .post('/users/set_password/', formData)
          .then(response => {
            console.log(response)
            this.closeModal()
            this.clearFields()
            this.successAlert()
          })
          .catch(error => {
            console.log(error)
            const formattedFieldNames = { current_password: 'Current password', new_password: 'New password', re_new_password: 'Confirm new password', non_field_errors: 'Error' }
            const errorString = errorToString(error, formattedFieldNames)
            this.authError = errorString
          })
      }
    },
    clearFields () {
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmNewPassword = ''
      this.authError = ''
    },
    closeModal () {
      this.$refs.closeModalButton.click()
    },
    successAlert () {
      this.$emit('alert', 'Password changed successfully.', 'success')
    }
  }
}

</script>
