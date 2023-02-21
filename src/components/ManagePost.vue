<template>
    <button
        v-for="state in states"
        :key="state"
        :class="['btn, {active: currentState === state}']"
        @click="swapStates"
    >{{ state.toUpperCase() }}</button>

    <form action="FILLMEINLATER" method="POST">
        <input type="text" class="title" name="title" id="" placeholder="Start with a title for your post" v-model="title">
            <TextPostBody 
                v-if="currentState==='text'"
                v-model:toggle="this.markDownEnabled"
                v-model:body="this.body"
            />
            <!-- <div id="makeImagePostBody">
                Do this later since it's complicated (tm)
            </div> -->
            <button type = submit></button>
        </form>
</template>

<script>
    import TextPostBody from '@/components/TextPostBody.vue';

    export default{
        data() {
            //Defaults unless overridden by creation hook
            return {
                states: ['text', 'image'],
            };
        },
        props: ['existingPost', 'author'],
        computed: {
            title() {
                return (this.existingPost ? this.existingPost.title : '')
            },
            body() {
                return (this.existingPost ? this.existingPost.content : '')
            },
            currentState() {
                return (this.existingPost ? this.existingPost.contentType : "text")
            },
            markdownEnabled() {
                if (!this.existingPost || this.existingPost.contentType != 'text') {
                    return true
                }
                else {
                    return false
                }    
            }
        },
        components: {
            TextPostBody,
        }
    }


</script>