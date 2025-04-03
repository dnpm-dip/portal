<script lang="ts">
import { storeToRefs } from 'pinia';
import { PageMetaKey, useToast } from '@dnpm-dip/core';
import { AUserPasswordForm, injectStore } from '@authup/client-web-kit';
import { definePageMeta } from '#imports';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        AUserPasswordForm,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
        });

        const toast = useToast();

        const store = injectStore();
        const { userId } = storeToRefs(store);

        const handleUpdated = () => {
            if (toast) {
                toast.show({ variant: 'success', body: 'The account was successfully updated.' });
            }
        };

        const handleFailed = (e: Error) => {
            if (toast) {
                toast.show({ variant: 'warning', body: e.message });
            }
        };

        return {
            id: userId,
            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <div>
        <h6 class="title">
            Password
        </h6>
        <AUserPasswordForm
            :id="id"
            @updated="handleUpdated"
            @failed="handleFailed"
        />
    </div>
</template>
