<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { SmallVariant, Variant } from '../../domains';
import RVariant from './RVariant.vue';

export default defineComponent({
    components: {
        RVariant,
    },
    props: {
        entity: {
            type: Object as PropType<SmallVariant>,
            required: true,
        },
    },
});
</script>
<template>
    <RVariant :entity="entity">
        <div
            v-if="entity.chromosome"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>Chromosme</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.chromosome.display || entity.chromosome.code }}</small>
            </div>
        </div>
        <div
            v-if="entity.position"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>Position</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.position }}</small>
            </div>
        </div>
        <div
            v-if="entity.ref"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>Ref</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.ref }}</small>
            </div>
        </div>
        <div
            v-if="entity.alt"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>Alt</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.alt }}</small>
            </div>
        </div>
    </RVariant>
</template>
