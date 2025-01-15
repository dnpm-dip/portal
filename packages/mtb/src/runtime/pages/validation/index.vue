<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineComponent } from 'vue';
import { DValidationReportCard, DValidations } from '@dnpm-dip/core';

export default defineComponent({
    components: {
        DValidationReportCard,
        DValidations,
    },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <i class="fa fa-shield" /> Validierungsmeldungen
        </h1>
        <DValidations :use-case="'mtb'">
            <template #default="props">
                <div class="d-flex flex-row mb-2">
                    <div class="ms-auto">
                        Es gibt insgesamt {{ props.total }} Meldung(en).
                    </div>
                </div>
                <template v-if="props.data.length > 0">
                    <div class="list">
                        <ul class="list-body list-unstyled">
                            <template
                                v-for="item in props.data"
                                :key="item.id"
                            >
                                <li class="list-item flex-row">
                                    <DValidationReportCard
                                        :use-case="'mtb'"
                                        :info="item"
                                    />
                                </li>
                            </template>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <div class="alert alert-sm alert-info">
                        Es liegen keine Meldungen vor.
                    </div>
                </template>
            </template>
        </DValidations>
    </div>
</template>
