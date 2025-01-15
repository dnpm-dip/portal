<script lang="ts">
import { VCTimeago } from '@vuecs/timeago';
import {
    type PropType, defineComponent, ref,
} from 'vue';
import DValidationReport from './DValidationReport';
import type { ValidationReportInfo } from '../../../domains';

export default defineComponent({
    components: {
        DValidationReport,
        VCTimeago,
    },
    props: {
        info: {
            type: Object as PropType<ValidationReportInfo>,
            required: true,
        },
        useCase: {
            type: String,
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
    <div class="validation-report-card entity-card w-100 d-flex flex-column gap-1">
        <div class="d-flex flex-row">
            <div>
                <strong>Meldung </strong>
                <small>#{{ info.id }}</small>
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
            <div>
                <DValidationReport
                    :id="info.id"
                    :use-case="useCase"
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
                                                    'severity-danger': item.severity === 'error',
                                                    'severity-info': item.severity === 'info',
                                                    'severity-warning': item.severity === 'warning'
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
                </DValidationReport>
            </div>
        </template>
        <template v-else>
            <div class="d-flex flex-row">
                <div class="d-flex flex-grow-1 flex-column align-items-center">
                    <div class="severity-header severity-info">
                        <strong>{{ info.issues.info }}</strong>
                    </div>
                    <div class="severity-body">
                        Infomeldung(en)
                    </div>
                </div>
                <div class="d-flex flex-grow-1 flex-column align-items-center">
                    <div class="severity-header severity-warning">
                        <strong>{{ info.issues.warning }}</strong>
                    </div>
                    <div class="severity-body">
                        Warnungsmeldung(en)
                    </div>
                </div>
                <div class="d-flex flex-grow-1 flex-column align-items-center">
                    <div class="severity-header severity-danger">
                        <strong>{{ info.issues.error }}</strong>
                    </div>
                    <div class="severity-body">
                        Fehlermeldung(en)
                    </div>
                </div>
            </div>
        </template>
        <hr>
        <div class="d-flex flex-row">
            <div class="ms-auto">
                <small class="text-muted">
                    <VCTimeago :datetime="info.createdAt" />
                </small>
            </div>
        </div>
    </div>
</template>
<style scoped>
.validation-report-card hr {
    margin: 0.5rem 0;
}

.validation-report-card .severity-header {
    font-size: 1.15rem;
    font-weight: 600;
}

.validation-report-card .severity-body {
    font-size: 0.85rem;
}

.validation-report-card .severity-info {
    color: rgb(106 171 184) !important;
}

.validation-report-card .severity-warning {
    color: rgb(255 137 0) !important;
}

.validation-report-card .severity-danger {
    color: rgb(209 47 62) !important;
}
</style>
