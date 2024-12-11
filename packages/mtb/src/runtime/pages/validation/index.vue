<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineComponent } from 'vue';
import MValidations from '../../components/core/validation/MValidations';

export default defineComponent({
    components: { MValidations },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <i class="fa fa-shield" /> Validierung
        </h1>
        <MValidations>
            <template #default="props">
                {{ props.data }}
            </template>
        </MValidations>
    </div>
</template>
