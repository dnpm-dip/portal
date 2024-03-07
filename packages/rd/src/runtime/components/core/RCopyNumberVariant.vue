<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { CopyNumberVariant } from '../../domains';
import RVariant from './RVariant.vue';

export default defineComponent({
    components: {
        RVariant,
    },
    props: {
        entity: {
            type: Object as PropType<CopyNumberVariant>,
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
            v-if="entity.startPosition"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>Start Position</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.startPosition }}</small>
            </div>
        </div>
        <div
            v-if="entity.endPosition"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>End Position</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.endPosition }}</small>
            </div>
        </div>
        <div
            v-if="entity.type"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>Typ</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.type.display || entity.type.code }}</small>
            </div>
        </div>
    </RVariant>
</template>
