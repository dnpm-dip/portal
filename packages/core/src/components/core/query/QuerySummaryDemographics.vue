<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import { QueryFilterURLKey } from '../../../constants';
import type { Coding, QuerySummaryDemographics } from '../../../domains';
import { useQueryFilterStore } from '../../../stores';
import { DKVChartTableSwitch } from '../../utility';

export default defineComponent({
    components: { DKVChartTableSwitch },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryDemographics>,
            required: true,
        },
    },
    emits: ['navigate'],
    setup(_props, { emit }) {
        const queryFilterStore = useQueryFilterStore();

        const handleLocationClick = (keys: Coding[]) => {
            const [coding] = keys;
            if (typeof coding === 'undefined') {
                return;
            }

            let hasChanged : boolean;

            if (queryFilterStore.hasItem(QueryFilterURLKey.SITE, coding)) {
                hasChanged = false;
                queryFilterStore.setItems(QueryFilterURLKey.SITE, []);
            } else {
                hasChanged = true;
                queryFilterStore.setItems(QueryFilterURLKey.SITE, [coding]);
            }

            queryFilterStore.setActive('patient');
            queryFilterStore.commit();

            if (hasChanged) {
                emit('navigate');
            }
        };

        const handleGenderClick = (keys: Coding[]) => {
            const [coding] = keys;
            if (typeof coding === 'undefined') {
                return;
            }

            let hasChanged : boolean;

            if (queryFilterStore.hasItem(QueryFilterURLKey.GENDER, coding)) {
                hasChanged = false;
                queryFilterStore.setItems(QueryFilterURLKey.GENDER, []);
            } else {
                hasChanged = true;
                queryFilterStore.setItems(QueryFilterURLKey.GENDER, [coding]);
            }

            queryFilterStore.setActive('patient');
            queryFilterStore.commit();

            if (hasChanged) {
                emit('navigate');
            }
        };

        const handleAgeClick = (keys: Coding[]) => {
            const [min, max] = keys;
            if (typeof min === 'undefined' || typeof max === 'undefined') {
                return;
            }

            let hasChanged : boolean;

            if (
                queryFilterStore.hasItem(QueryFilterURLKey.AGE_MIN, min) ||
                queryFilterStore.hasItem(QueryFilterURLKey.AGE_MAX, max)
            ) {
                hasChanged = false;
                queryFilterStore.setItems(QueryFilterURLKey.AGE_MIN, []);
                queryFilterStore.setItems(QueryFilterURLKey.AGE_MAX, []);
            } else {
                hasChanged = true;
                queryFilterStore.setItems(QueryFilterURLKey.AGE_MIN, [min]);
                queryFilterStore.setItems(QueryFilterURLKey.AGE_MAX, [max]);
            }

            queryFilterStore.setActive('patient');
            queryFilterStore.commit();

            if (hasChanged) {
                emit('navigate');
            }
        };

        return {
            handleLocationClick,
            handleGenderClick,
            handleAgeClick,
        };
    },
});
</script>
<template>
    <div>
        <h5>Allgemein</h5>

        <div class="d-flex flex-row gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>
                    Patienten pro Standort
                </h6>
                <DKVChartTableSwitch
                    :type="'doughnut'"
                    :data="entity.siteDistribution.elements"
                    :clickable="true"
                    @clicked="handleLocationClick"
                />
            </div>

            <div class="entity-card text-center mb-3 w-100">
                <h6>
                    Geschlechterverteilung
                </h6>
                <DKVChartTableSwitch
                    :type="'doughnut'"
                    :data="entity.genderDistribution.elements"
                    :clickable="true"
                    @clicked="handleGenderClick"
                />
            </div>
        </div>

        <div class="entity-card text-center mb-3 w-100">
            <h6>
                Altersverteilung
            </h6>
            <DKVChartTableSwitch
                :data="entity.ageDistribution.elements"
                :clickable="true"
                @clicked="handleAgeClick"
            />
        </div>
    </div>
</template>
