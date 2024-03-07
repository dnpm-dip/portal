<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { StructuralVariant } from '../../domains';
import RVariant from './RVariant.vue';

export default defineComponent({
    components: {
        RVariant,
    },
    props: {
        entity: {
            type: Object as PropType<StructuralVariant>,
            required: true,
        },
    },
});
</script>
<template>
    <RVariant :entity="entity">
        <div
            v-if="entity.iscnDescription"
            class="d-flex flex-grow-1 align-items-center flex-row"
        >
            <div>
                <strong>ISCN</strong>
            </div>
            <div class="ms-1">
                <small>{{ entity.iscnDescription.display || entity.iscnDescription.code }}</small>
            </div>
        </div>
    </RVariant>
</template>
