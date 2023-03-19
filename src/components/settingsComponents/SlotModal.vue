<template>
    <!-- modal starts hidden -->
    <div class="modal fade" tabindex="-1" id="slotModal" ref="slotModal" aria-labelledby="slotModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <!-- Title text -->
          <h5 class="modal-title" id="slotModalLabel">
            <slot name="titleText">Modal title</slot>
          </h5>
          <!-- Top right close button -->
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearFields" ref="closeModalButton"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body text-start">
          <!-- Alert dialog -->
          <div class="alert alert-danger" v-show="errorMsg">{{ errorMsg }}</div>
          <!-- Start of content, can be a form -->
          <slot name="body" :submitMethod="submitForm"></slot>
        </div>
        <div class="modal-footer">
          <!-- Bottom button to close the modal -->
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="clearFields">
          <slot name="closeButtonText">Close</slot>
          </button>
          <!-- Bottom button to submit the form -->
          <slot name="submitButton"></slot>
            <!-- Example submit button to slot in -->
              <!-- <button type="submit" class="btn btn-primary" form="modalForm">
              submit
            </button> -->
        </div>
      </div>
    </div>
  </div>
  <!-- Button to open the modal -->
  <slot name="openModalButton">
    <!-- fallback button -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#slotModal">
      Open modal
    </button>
</slot>
  </template>

<script>
export default {
  name: 'SlotModal',
  emits: ['alert', 'submitMyForm', 'clearFields'],
  props: ['inputFields'],
  data () {
    return {
      errorMsg: ''
    }
  },
  methods: {
    submitForm (e) {
      console.log('submitting form')
      this.$emit('submitMyForm', {
        // function to call when the form is successfully submitted
        done: () => {
          this.clearFields()
          this.errorMsg = ''
          this.closeModal()
        },
        // retrieve error info
        e: (e) => {
          this.errorMsg = e
        }
      })
    },
    clearFields () {
      this.$emit('clearFields') // clear the fields in the parent component
    },
    closeModal () {
      this.$refs.closeModalButton.click()
    }
  }
}

</script>
