<script lang="ts">
import { VCButton } from '@vuecs/button';
import { VCAlert } from '@vuecs/elements';
import { VCTimeago } from '@vuecs/timeago';
import {
    type PropType, 
    defineComponent, 
    ref,
} from 'vue';
import DValidationReport from './DValidationReport';
import type { ValidationReportInfo } from '../../../domains';

export default defineComponent({
    components: {
        DValidationReport,
        VCAlert,
        VCButton,
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
    <div class="validation-report-card entity-card w-full flex flex-col gap-1">
        <div class="flex flex-row">
            <div>
                <strong>Meldung </strong>
                <small>#{{ info.id }}</small>
            </div>
            <div class="ms-auto">
                <VCButton
                    color="neutral"
                    size="xs"
                    @click.prevent="toggleExtended"
                >
                    <VCIcon :name="extended ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                </VCButton>
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
                        <div class="flex flex-col">
                            <template
                                v-for="(item, key) in props.data.issues"
                                :key="key"
                            >
                                <VCAlert
                                    color="neutral"
                                    variant="soft"
                                    size="sm"
                                    class="flex flex-wrap -mx-2"
                                >
                                    <div class="w-2/12 px-2 flex grow flex-col items-center">
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
                                    <div class="w-6/12 px-2 flex grow flex-col">
                                        <div>
                                            <strong>Nachricht</strong>
                                        </div>
                                        <div class="ms-1">
                                            {{ item.message }}
                                        </div>
                                    </div>
                                    <div class="w-4/12 px-2 flex grow flex-col">
                                        <div>
                                            <strong>Pfad</strong>
                                        </div>
                                        <div class="ms-1">
                                            {{ item.path }}
                                        </div>
                                    </div>
                                </VCAlert>
                            </template>
                        </div>
                    </template>
                </DValidationReport>
            </div>
        </template>
        <template v-else>
            <div class="flex flex-row">
                <div class="flex grow flex-col items-center">
                    <div class="severity-header severity-info">
                        <strong>{{ info.issues.info }}</strong>
                    </div>
                    <div class="severity-body">
                        Infomeldung(en)
                    </div>
                </div>
                <div class="flex grow flex-col items-center">
                    <div class="severity-header severity-warning">
                        <strong>{{ info.issues.warning }}</strong>
                    </div>
                    <div class="severity-body">
                        Warnungsmeldung(en)
                    </div>
                </div>
                <div class="flex grow flex-col items-center">
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
        <div class="flex flex-row">
            <div class="ms-auto">
                <small class="text-fg-muted">
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
