<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { RDPatientRecord, RDQuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
        },
        record: {
            type: Object as PropType<RDPatientRecord>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <template
            v-for="(item, key) in record.ngsReports"
            :key="key"
        >
            <div>
                <h5>Report <small class="text-muted">{{ item.id }}</small></h5>
            </div>
            <div class="mb-3">
                <h6>General</h6>
                <div class="row">
                    <div class="col">
                        <div>
                            <div><strong><i class="fa fa-clock" /> Recorded</strong> {{ item.recordedOn }}</div>
                            <div><strong><i class="fa fa-microscope" /> Lab</strong> {{ item.performingLab.name }}</div>
                            <div><strong><i class="fa fa-keyboard" /> Type</strong> {{ item.type.display }}</div>
                        </div>
                    </div>
                    <div class="col">
                        <div>
                            <div><strong><i class="fa fa-dna" /> Sequencing Type</strong> {{ item.metaInfo.sequencingType }}</div>
                            <div><strong><i class="fas fa-toolbox" /> Kit</strong> {{ item.metaInfo.kit }}</div>
                            <template v-if="item.autozygosity">
                                <div><strong><i class="fa fa-retweet" /> Autozygosity</strong> {{ item.autozygosity.value }}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h6>Variants</h6>
                <template
                    v-for="variant in item.variants"
                    :key="variant.id"
                >
                    <pre>{{ variant }}</pre>
                </template>
            </div>
        </template>
    </div>
</template>
