<script lang="ts">
import { VCTimeago } from '@vuecs/timeago';
import {
    type PropType, computed, defineComponent, ref,
} from 'vue';
import MValidationReport from './MValidationReport';
import type { ValidationReportInfo } from '../../../domains/validation';

export default defineComponent({
    components: {
        MValidationReport,
        VCTimeago,
    },
    props: {
        info: {
            type: Object as PropType<ValidationReportInfo>,
            required: true,
        },
    },
    setup() {
        const extended = ref<boolean>(false);

        const toggleExtended = () => {
            extended.value = !extended.value;
        };

        return {
            toggleExtended,
            extended,
        };
    },
});
</script>
<template>
    <div class="entity-card w-100">
        <div class="d-flex flex-row">
            <div>
                <strong># {{ info.id }}</strong>
            </div>
            <div class="ms-auto">
                <button
                    class="btn btn-dark btn-xs"
                    @click.prevent="toggleExtended"
                >
                    <i :class="{'fa fa-chevron-down': !extended, 'fa fa-chevron-up': extended}" />
                </button>
            </div>
        </div>
        <hr>
        <template v-if="extended">
            <div class=" mb-2 mt-2">
                <MValidationReport
                    :id="info.id"
                    :lazy-load="true"
                >
                    <template #default="props">
                        <div class="d-flex flex-column">
                            <template
                                v-for="(item, key) in props.data.issues"
                                :key="key"
                            >
                                <div class="alert alert-sm alert-secondary row">
                                    <div class="col-2 d-flex flex-grow-1 flex-column align-items-center">
                                        <div>
                                            <strong>Level</strong>
                                        </div>
                                        <div class="ms-1">
                                            <span
                                                :class="{
                                                    'text-danger': item.severity === 'error',
                                                    'text-info': item.severity === 'info',
                                                    'text-warning': item.severity === 'warning'
                                                }"
                                            >
                                                {{ item.severity }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-6 d-flex flex-grow-1 flex-column">
                                        <div>
                                            <strong>Nachricht</strong>
                                        </div>
                                        <div class="ms-1">
                                            {{ item.message }}
                                        </div>
                                    </div>
                                    <div class="col-4 d-flex flex-grow-1 flex-column">
                                        <div>
                                            <strong>Pfad</strong>
                                        </div>
                                        <div class="ms-1">
                                            {{ item.path }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </MValidationReport>
            </div>
        </template>
        <template v-else>
            <div class="d-flex flex-row">
                <div class="d-flex flex-grow-1 flex-column align-items-center">
                    <div>
                        <strong>Info</strong>
                    </div>
                    <div class="ms-1 text-info">
                        {{ info.issues.info }}
                    </div>
                </div>
                <div class="d-flex flex-grow-1 flex-column align-items-center">
                    <div>
                        <strong>Warnung</strong>
                    </div>
                    <div class="ms-1 text-warning">
                        {{ info.issues.warning }}
                    </div>
                </div>
                <div class="d-flex flex-grow-1 flex-column align-items-center">
                    <div>
                        <strong>Fehler</strong>
                    </div>
                    <div class="ms-1 text-danger">
                        {{ info.issues.error }}
                    </div>
                </div>
            </div>
        </template>
        <hr>
        <div class="d-flex flex-row">
            <div class="ms-auto">
                <span class="text-muted">
                    <VCTimeago :datetime="info.createdAt" />
                </span>
            </div>
        </div>
    </div>
</template>
