<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { VCPagination } from '@vuecs/pagination';
import { defineComponent } from 'vue';
import MValidations from '../../components/core/validation/MValidations';
import MValidationReportCard from '../../components/core/validation/MValidationReportCard.vue';

export default defineComponent({
    components: { MValidationReportCard, MValidations, VCPagination },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <i class="fa fa-shield" /> Validierung
        </h1>
        <MValidations>
            <template #default="props">
                <div class="d-flex flex-row">
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
                                    <MValidationReportCard :info="item" />
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
                <VCPagination
                    :busy="props.busy"
                    :total="props.total"
                    :limit="props.limit"
                    :offset="props.offset"
                    @load="applyPagination"
                />
            </template>
        </MValidations>
    </div>
</template>
