<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    DNav,
    type NavItem,
} from '@dnpm-dip/core';
import {
    type PropType,
} from 'vue';
import { inject, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        DNav,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    async setup(props) {
        const navItems = [
            {
                id: 'default', name: 'Demographie', icon: 'fas fa-globe', urlSuffix: '',
            },
            {
                id: 'diagnostics', name: 'Diagnostik', icon: 'fas fa-stethoscope', urlSuffix: '/diagnostics',
            },
        ];

        const navItemId = ref('default');

        const setNavItem = (item: NavItem) => {
            navItemId.value = item.id || 'default';
        };

        return {
            navItems,
            navItemId,
            setNavItem,
        };
    },
});
</script>
<template>
    <div class="content-wrapper">
        <div class="content-sidebar">
            <DNav
                :direction="'vertical'"
                :items="navItems"
                :path="'/rd/query/'+ entity.id + '/summary'"
            />
        </div>
        <div class="content-main">
            <NuxtPage
                :entity="entity"
            />
        </div>
    </div>
</template>
