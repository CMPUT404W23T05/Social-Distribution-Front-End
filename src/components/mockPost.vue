<template>
    <div class="post">
        <div class="post-innner">
            <div class="post-text-wrap">
                <h2 class="bg-text">
                    {{ post.name }}
                </h2>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Post',
    props: ['post']
  }
</script>