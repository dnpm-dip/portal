<script lang="ts">
import { DFact } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import type { PatientMatch } from '../../domains';

export default defineComponent({
    components: { DFact },
    props: {
        entity: {
            type: Object as PropType<PatientMatch>,
            required: true,
        },
        queryId: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const extended = ref(true);

        const toggleExtended = () => {
            extended.value = !extended.value;
        };

        const id = computed(() => {
            if (Number.isInteger(props.index)) {
                return props.index + 1;
            }

            return props.entity.id;
        });

        const vitalStatusClass = computed(() => {
            switch (props.entity.vitalStatus.code) {
                case 'alive':
                    return 'bg-success-500/10 text-success-600';
                case 'deceased':
                    return 'bg-error-500/10 text-error-600';
                default:
                    return 'bg-bg-elevated text-fg-muted';
            }
        });

        return {
            id,
            toggleExtended,
            extended,
            vitalStatusClass,
        };
    },
});
</script>
<template>
    <div class="entity-card w-full">
        <div class="flex items-center gap-3">
            <span
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-500/10
                       text-sm font-semibold text-primary-600 dark:text-primary-200"
            >
                {{ id }}
            </span>

            <div class="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
                <DFact
                    v-if="entity.managingSite"
                    label="Standort"
                    icon="fa6-solid:hospital"
                >
                    {{ entity.managingSite.display }}
                </DFact>
                <DFact
                    label="Alter"
                    icon="fa6-solid:cake-candles"
                >
                    {{ entity.age.value }}
                </DFact>
                <DFact
                    label="Geschlecht"
                    icon="fa6-solid:venus-mars"
                >
                    {{ entity.gender.display }}
                </DFact>
                <DFact
                    label="Vitalstatus"
                    icon="fa6-solid:heart-pulse"
                >
                    <span
                        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                        :class="vitalStatusClass"
                    >
                        {{ entity.vitalStatus.display }}
                    </span>
                </DFact>
            </div>

            <div class="flex shrink-0 gap-1">
                <VCButton
                    type="button"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    :aria-expanded="extended ? 'true' : 'false'"
                    aria-label="Kriterien ein-/ausklappen"
                    @click.prevent="toggleExtended"
                >
                    <VCIcon :name="extended ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                </VCButton>

                <VCButton
                    tag="nuxt-link"
                    :to="'/rd/query/'+ queryId + '/patients/' +entity.id"
                    size="xs"
                    color="primary"
                    title="Patient öffnen"
                >
                    <VCIcon name="fa6-solid:arrow-right" />
                </VCButton>
            </div>
        </div>

        <div
            v-if="extended && entity.matchingCriteria"
            class="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-3"
        >
            <DFact
                v-if="entity.matchingCriteria.diagnoses"
                label="Diagnose Kategorien"
            >
                <span class="flex flex-wrap gap-1">
                    <template
                        v-for="item in entity.matchingCriteria.diagnoses"
                        :key="item.code"
                    >
                        <span class="inline-flex rounded-full border border-border bg-bg px-2 py-0.5 text-xs">
                            {{ item.code }}
                        </span>
                    </template>
                </span>
            </DFact>
            <DFact
                v-if="entity.matchingCriteria.hpoTerms"
                label="HPO Terme"
            >
                <span class="flex flex-wrap gap-1">
                    <template
                        v-for="item in entity.matchingCriteria.hpoTerms"
                        :key="item.code"
                    >
                        <span class="inline-flex rounded-full border border-border bg-bg px-2 py-0.5 text-xs">
                            {{ item.code }}
                        </span>
                    </template>
                </span>
            </DFact>
            <DFact
                v-if="entity.matchingCriteria.variants"
                label="Varianten"
            >
                <span class="flex flex-wrap gap-x-3 gap-y-1">
                    <template
                        v-for="(item, key) in entity.matchingCriteria.variants"
                        :key="key"
                    >
                        <template
                            v-for="(value, prop) in item"
                            :key="prop"
                        >
                            <span class="text-xs">
                                <span class="font-medium">{{ prop }}:</span> {{ value }}
                            </span>
                        </template>
                    </template>
                </span>
            </DFact>
        </div>
    </div>
</template>
