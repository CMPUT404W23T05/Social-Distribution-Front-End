<!-- This ideally leverages multiple v-model bindings to reduce clutter in ManagePost -->

<template>
    <div id="makeTextPostBody">
            <textarea
            id="text-body"
            placeholder="Let's make a post!"
            :value="body"
            @input="$emit('update:body', $event.target.value)"
            ></textarea>
            <div class="form-check form-switch">
                <input 
                class="form-check-input" 
                type="checkbox"
                :value="Markdown"
                id="markdownToggle"
                :checked="markDownEnabled"
                @click="$emit('update:markDownEnabled, $event.target.checked')"
                />
                <label class="form-check-label markdown-message" for="markdownToggle"> {{ markDownMessage }}</label>
            </div>
        </div>
</template>

<script>
    export default {
        data() {
            return {
                body: this.body,
                markDownEnabled: this.markDownEnabled,
            }
        },
        props: ['body', 'markDownEnabled'],
        computed: {
            markDownMessage() { 
                return (this.markDownEnabled ? 'Markdown Enabled!' : 'Markdown Disabled!')
            },
        },
        emits: ['update:body', 'update:markDownEnabled']
    }
</script>