<script lang="ts">
import { VCFormRangeMultiSlider } from '@vuecs/form-controls';
import { defineComponent, ref } from 'vue';
import { QueryFilterURLKey } from '../../../constants';
import { injectHTTPClient } from '../../../core';
import type { PatientFilter } from '../../../domains';
import { useQueryFilterStore } from '../../../stores';
import QueryFilterBox from './QueryFilterBox.vue';

export default defineComponent({
    components: {
        QueryFilterBox,
        VCFormRangeMultiSlider,
    },
    props: {
        queryId: {
            type: String,
            required: true,
        },
        useCase: {
            type: String,
            required: true,
        },
        busy: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['submit'],
    async setup(props, { emit }) {
        const store = useQueryFilterStore();
        const httpClient = injectHTTPClient();

        const available = ref<PatientFilter>({});
        const availableInitialized = ref<boolean>(false);

        const load = async () => {
            try {
                available.value = await httpClient.query.getPatientFilter(props.useCase, props.queryId);
            } catch (e) {
                available.value = [];
            } finally {
                availableInitialized.value = true;
            }
        };

        const gender = ref<string[]>([]);
        const vitalStatus = ref<string[]>([]);
        const site = ref<string[]>([]);
        const age = ref({
            min: 0,
            max: 100,
        });

        const resetGender = () => {
            gender.value = available.value.gender ?
                available.value.gender.map((el) => el.code) :
                [];

            store.set(QueryFilterURLKey.GENDER, []);
        };

        const resetVitalStatus = () => {
            vitalStatus.value = available.value.vitalStatus ?
                available.value.vitalStatus.map((el) => el.code) :
                [];

            store.set(QueryFilterURLKey.VITAL_STATUS, []);
        };

        const resetSite = () => {
            site.value = available.value.site ?
                available.value.site.map((el) => el.code) :
                [];

            store.set(QueryFilterURLKey.SITE, []);
        };

        const resetAgeMin = () => {
            age.value.min = available.value.ageRange ?
                available.value.ageRange.min :
                0;

            store.set(QueryFilterURLKey.AGE_MIN, []);
        };

        const resetAgeMax = () => {
            age.value.max = available.value.ageRange ?
                available.value.ageRange.max :
                100;

            store.set(QueryFilterURLKey.AGE_MAX, []);
        };

        const reset = () => {
            resetGender();

            resetVitalStatus();

            resetSite();

            resetAgeMin();

            resetAgeMax();
        };

        const init = () => {
            let items = store.get(QueryFilterURLKey.GENDER)
                .flat()
                .map((el) => el.code);
            if (items.length > 0) {
                gender.value = items;
            } else {
                resetGender();
            }

            items = store.get(QueryFilterURLKey.VITAL_STATUS)
                .flat()
                .map((el) => el.code);
            if (items.length > 0) {
                vitalStatus.value = items;
            } else {
                resetVitalStatus();
            }

            items = store.get(QueryFilterURLKey.SITE)
                .flat()
                .map((el) => el.code);
            if (items.length > 0) {
                site.value = items;
            } else {
                resetSite();
            }

            items = store.get(QueryFilterURLKey.AGE_MIN)
                .flat()
                .map((el) => el.code);
            if (items.length > 0) {
                age.value.min = parseInt(items[0], 10);
            } else {
                resetAgeMin();
            }

            items = store.get(QueryFilterURLKey.AGE_MAX)
                .flat()
                .map((el) => el.code);
            if (items.length > 0) {
                age.value.max = parseInt(items[0], 10);
            } else {
                resetAgeMax();
            }
        };

        Promise.resolve()
            .then(() => load())
            .then(() => init());

        const handleAgeRangeChanged = (ctx: { min: number, max: number}) => {
            age.value.min = Math.round(ctx.min);
            age.value.max = Math.round(ctx.max);

            if (available.value.ageRange) {
                if (
                    available.value.ageRange.min &&
                    available.value.ageRange.min === age.value.min
                ) {
                    store.set(QueryFilterURLKey.AGE_MIN, []);
                } else {
                    store.set(QueryFilterURLKey.AGE_MIN, [`${age.value.min}`]);
                }

                if (
                    available.value.ageRange.max &&
                    available.value.ageRange.max === age.value.max
                ) {
                    store.set(QueryFilterURLKey.AGE_MAX, []);
                } else {
                    store.set(QueryFilterURLKey.AGE_MAX, [`${age.value.max}`]);
                }
            }
        };

        const handleGenderChanged = () => {
            const data : string[] = [];
            if (
                available.value &&
                available.value.gender &&
                available.value.gender.length !== gender.value.length
            ) {
                data.push(...gender.value);
            }

            store.set(QueryFilterURLKey.GENDER, data);
        };

        const handleVitalStatusChanged = () => {
            const data : string[] = [];
            if (
                available.value &&
                available.value.vitalStatus &&
                available.value.vitalStatus.length !== vitalStatus.value.length
            ) {
                data.push(...vitalStatus.value);
            }

            store.set(QueryFilterURLKey.VITAL_STATUS, data);
        };

        const handleSiteChanged = () => {
            const data : string[] = [];
            if (
                available.value &&
                available.value.site &&
                available.value.site.length !== site.value.length
            ) {
                data.push(...site.value);
            }

            store.set(QueryFilterURLKey.SITE, data);
        };

        const submit = () => {
            store.commit();

            emit('submit');
        };

        return {
            available,
            availableInitialized,

            age,
            gender,
            vitalStatus,
            site,

            handleAgeRangeChanged,
            handleGenderChanged,
            handleVitalStatusChanged,
            handleSiteChanged,

            reset,
            submit,
        };
    },
});
</script>
<template>
    <QueryFilterBox>
        <template #title>
            <h5 class="text-muted mb-0">
                Patient
            </h5>
        </template>
        <template #default>
            <div
                v-if="available.gender"
                class="mb-3"
            >
                <h6><i class="fas fa-transgender-alt" /> Geschlecht</h6>

                <div>
                    <template
                        v-for="item in available.gender"
                        :key="item.code"
                    >
                        <div class="form-check">
                            <VCFormInputCheckbox
                                v-model="gender"
                                :label="true"
                                :label-content="(item.display || item.code)"
                                :value="item.code"
                                @change="handleGenderChanged"
                            />
                        </div>
                    </template>
                </div>
            </div>
            <div
                v-if="available.vitalStatus"
                class="mb-3"
            >
                <h6><i class="fas fa-heartbeat" /> Vital Status</h6>

                <div>
                    <template
                        v-for="item in available.vitalStatus"
                        :key="item.code"
                    >
                        <div class="form-check">
                            <VCFormInputCheckbox
                                v-model="vitalStatus"
                                :label="true"
                                :label-content="(item.display || item.code)"
                                :value="item.code"
                                @change="handleVitalStatusChanged"
                            />
                        </div>
                    </template>
                </div>
            </div>
            <div
                v-if="available.site"
                class="mb-3"
            >
                <h6><i class="fas fa-hospital" /> Standort</h6>

                <div>
                    <template
                        v-for="item in available.site"
                        :key="item.code"
                    >
                        <div class="form-check">
                            <VCFormInputCheckbox
                                v-model="site"
                                :label="true"
                                :label-content="(item.display || item.code)"
                                :value="item.code"
                                @change="handleSiteChanged"
                            />
                        </div>
                    </template>
                </div>
            </div>
            <div
                v-if="available.ageRange"
                class="mb-3"
            >
                <h6><i class="fas fa-users" /> Alter <small class="text-muted">({{ age.min }} - {{ age.max }})</small></h6>

                <div class="mt-3">
                    <VCFormRangeMultiSlider
                        :min="age.min"
                        :max="age.max"
                        @change="handleAgeRangeChanged"
                    />
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <button
                        type="button"
                        class="btn btn-xs btn-primary btn-block"
                        @click.prevent="submit"
                    >
                        Anwenden
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        class="btn btn-xs btn-secondary btn-block"
                        @click.prevent="reset"
                    >
                        Zurücksetzen
                    </button>
                </div>
            </div>
        </template>
    </QueryFilterBox>
</template>
