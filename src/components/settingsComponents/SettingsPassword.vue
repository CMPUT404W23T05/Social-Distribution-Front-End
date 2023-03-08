<template>
    <div class="container">
    <form @submit.prevent="submitForm">
    <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔑</span></div><input class="form-control" type="password" name="currentPassword" v-model="currentPassword"  placeholder="Current password"></div>
      <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔒</span></div><input class="form-control" type="password" name="newPassword" v-model="newPassword"  placeholder="New password"></div>
      <div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="password-icon">🔐</span></div><input class="form-control" type="password" name="confirmNewPassword" v-model="confirmNewPassword"  placeholder="Confirm new password"></div>
        <button class="btn btn-primary" type="submit">Change Password</button>
        </form>
        </div>
</template>

<script>
export default {
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  }
}
</script>
