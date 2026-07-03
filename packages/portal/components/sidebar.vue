<script lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { NavigationResolverContext } from '@vuecs/navigation';
import { VCNavItems } from '@vuecs/navigation';
import { VCCountdown } from '@vuecs/countdown';
import { VCIcon } from '@vuecs/icon';
import { injectStore } from '@authup/client-web-kit';
import { defineNuxtComponent } from '#app';
import { LayoutTopNavigationRegistryId, injectNavigation } from '../core';

export default defineNuxtComponent({
    components: {
        VCCountdown,
        VCIcon,
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

        const navigation = injectNavigation();
        const sideItems = (ctx: NavigationResolverContext) => {
            const activeTopName = ctx.registry(LayoutTopNavigationRegistryId)
                .activeTrail.value[0]?.name;

            return navigation.getSideItems(activeTopName);
        };
        const sideItemsWatch = [
            () => store.loggedIn,
            () => store.userId,
        ];

        return {
            loggedIn,
            tokenExpiresIn,
            sideItems,
            sideItemsWatch,
        };
    },
});
</script>
<template>
    <div>
        <div class="page-sidebar">
            <VCNavItems
                class="sidebar-menu flex flex-col list-none"
                :data="sideItems"
                :watch="sideItemsWatch"
                variant="pills"
                orientation="vertical"
            />
            <div class="mt-auto">
                <div
                    v-if="loggedIn"
                    class="font-light flex flex-col ms-3 me-3 mb-3 mt-auto text-sm"
                    style="color: var(--dnpm-chrome-fg-muted)"
                >
                    <span>
                        <VCCountdown :time="tokenExpiresIn">
                            <template #default="props">
                                <VCIcon
                                    name="fa6-solid:clock"
                                    class="pr-1"
                                /> Die Sitzung erneuert sich in
                                <span class="text-success-600">{{ props.minutes }} Minute(n), {{ props.seconds }} Sekunde(n)</span>.
                            </template>
                        </VCCountdown>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
