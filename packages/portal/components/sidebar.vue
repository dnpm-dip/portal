<script>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { VCNavItems } from '@vuecs/navigation';
import { VCCountdown } from '@vuecs/countdown';
import { injectStore } from '@authup/client-web-kit';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCCountdown,
        VCNavItems,
    },
    setup() {
        const store = injectStore();
        const { loggedIn, accessTokenExpireDate: tokenExpireDate } = storeToRefs(store);

        const tokenExpiresIn = computed(() => {
            if (!tokenExpireDate.value) {
                return 0;
            }

            return tokenExpireDate.value.getTime() - Date.now();
        });

        return {
            loggedIn,
            tokenExpiresIn,
        };
    },
});
</script>
<template>
    <div>
        <div class="page-sidebar">
            <VCNavItems
                class="sidebar-menu navbar-nav"
                :level="1"
            />
            <div class="mt-auto">
                <div
                    v-if="loggedIn"
                    class="d-flex flex-column ms-3 me-3 mb-3 mt-auto"
                    style="color: #848484"
                >
                    <small>
                        <VCCountdown :time="tokenExpiresIn">
                            <template #default="props">
                                <i class="fa fa-clock pr-1" /> Die Sitzung erneuert sich in
                                <span class="text-success">{{ props.minutes }} Minute(n), {{ props.seconds }} Sekunde(n)</span>.
                            </template>
                        </VCCountdown>
                    </small>
                </div>
            </div>
        </div>
    </div>
</template>
