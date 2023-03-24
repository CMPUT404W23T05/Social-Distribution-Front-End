<template>

    <div class="card" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title" style="size:10%; font-weight: bold;">{{git_feed.type}}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{ git_feed?.repo?.url }}</h6>
        <p class="card-text">{{ git_feed?.payload?.commits?.[0]?.message }}</p>
        <!-- <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a> -->
    </div>
    </div>

</template>

<script>
    export default {
        props: ['git_feed'],
    }
</script>

<style scoped>
</style>
