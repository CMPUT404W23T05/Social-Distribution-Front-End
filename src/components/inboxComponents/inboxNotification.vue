<template>
  <!-- A generic notification for the inbox, use slots to insert content -->
  <div class="card">
    <div class="card-header">
      <slot name="notification-header"></slot>
      <h3>{{ notificationType }}</h3>
      <slot name="flair" class="position-upper-right"/>
    </div>

    <div class="card-body">
      <slot name="notification-content">Something about the notification</slot>
      <!-- If you want additional functionality, like adding a request from the inbox, or liking a post from the thumbnail, etc -->
      <slot name="add-actionables" class="d-flex justify-content-space-evenly"/>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      // What to route to when clicked, if any
      anchor: {
        default: null,
        type: String
      },
        // Comment, Post, Follow, etc
        notificationType: {
          default: 'Hello World',
          type: String
        }
      },
    }

<script>