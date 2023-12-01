<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import type { PatientFilter, PatientFilterInput } from '@dnpm-dip/core';
import FormRangeSlider from '../utility/form-range-slider/FormRangeSlider.vue';

export default defineComponent({
    components: {
        FormRangeSlider,
    },
    props: {
        availableFilters: {
            type: Object as PropType<PatientFilter>,
            required: true,
        },
        busy: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['submit'],
    async setup(props, { emit }) {
        const gender = ref<string[]>([]);
        const genderChanged = ref(false);

        const vitalStatus = ref<string[]>([]);
        const vitalStatusChanged = ref(false);

        const site = ref<string[]>([]);
        const siteChanged = ref(false);

        const age = ref({
            min: 0,
            max: 100,
        });
        const ageChanged = ref(false);

        const hasChanged = computed(
            () => genderChanged.value ||
                vitalStatusChanged.value ||
                ageChanged.value,
        );
        const isSubmitted = ref(true);

        const reset = () => {
            if (props.availableFilters.gender) {
                gender.value = props.availableFilters.gender.map((el) => el.code);
            }
            if (props.availableFilters.vitalStatus) {
                vitalStatus.value = props.availableFilters.vitalStatus.map((el) => el.code);
            }

            if (props.availableFilters.ageRange) {
                age.value = {
                    min: props.availableFilters.ageRange.min,
                    max: props.availableFilters.ageRange.max,
                };
            }

            if (props.availableFilters.site) {
                site.value = props.availableFilters.site.map((el) => el.code);
            }

            genderChanged.value = false;
            vitalStatusChanged.value = false;
            siteChanged.value = false;
            ageChanged.value = false;
            isSubmitted.value = false;
        };

        reset();

        const handleAgeRangeChanged = (ctx: { min: number, max: number}) => {
            if (!props.availableFilters.ageRange) {
                return;
            }
            age.value.min = Math.round(ctx.min);
            age.value.max = Math.round(ctx.max);

            if (
                age.value.min !== props.availableFilters.ageRange.min ||
                age.value.max !== props.availableFilters.ageRange.max
            ) {
                ageChanged.value = true;
                isSubmitted.value = false;
            }
        };

        watch(gender, (value) => {
            if (!props.availableFilters.gender) {
                return;
            }

            if (value.length !== props.availableFilters.gender.length) {
                genderChanged.value = true;
                isSubmitted.value = false;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = props.availableFilters.gender.findIndex((el) => el.code === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            genderChanged.value = changed;
            if (changed) {
                isSubmitted.value = false;
            }
        }, { deep: true });

        watch(vitalStatus, (value) => {
            if (!props.availableFilters.vitalStatus) {
                return;
            }
            if (value.length !== props.availableFilters.vitalStatus.length) {
                vitalStatusChanged.value = true;
                isSubmitted.value = false;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = props.availableFilters.vitalStatus.findIndex((el) => el.code === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            vitalStatusChanged.value = changed;
            if (changed) {
                isSubmitted.value = false;
            }
        }, { deep: true });

        watch(site, (value) => {
            if (!props.availableFilters.site) {
                return;
            }
            if (value.length !== props.availableFilters.site.length) {
                siteChanged.value = true;
                isSubmitted.value = false;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = props.availableFilters.site.findIndex((el) => el.code === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            siteChanged.value = changed;
            if (changed) {
                isSubmitted.value = false;
            }
        }, { deep: true });

        const submit = () => {
            if (props.busy) return;

            isSubmitted.value = true;

            const data : PatientFilterInput = {};

            if (ageChanged.value) {
                data.ageRange = {};

                if (props.availableFilters.ageRange) {
                    if (age.value.min !== props.availableFilters.ageRange.min) {
                        data.ageRange.min = age.value.min;
                    }

                    if (age.value.max !== props.availableFilters.ageRange.max) {
                        data.ageRange.max = age.value.max;
                    }
                }
            }

            if (vitalStatusChanged.value) {
                data.vitalStatus = vitalStatus.value.map((el) => ({
                    code: el,
                }));
            }

            if (genderChanged.value) {
                data.gender = gender.value.map((el) => ({
                    code: el,
                }));
            }

            if (siteChanged.value) {
                data.site = site.value.map((el) => ({
                    code: el,
                }));
            }

            emit('submit', data);
        };

        return {
            age,
            gender,
            vitalStatus,
            site,

            hasChanged,
            isSubmitted,

            handleAgeRangeChanged,

            reset,
            submit,
        };
    },
});
</script>
<template>
    <div class="entity-card">
        <div
            v-if="availableFilters.gender"
            class="mb-3"
        >
            <h6><i class="fas fa-transgender-alt" /> Geschlecht</h6>

            <div>
                <template
                    v-for="item in availableFilters.gender"
                    :key="item.code"
                >
                    <div class="form-check">
                        <VCFormInputCheckbox
                            v-model="gender"
                            :label="true"
                            :label-content="(item.display || item.code)"
                            :value="item.code"
                        />
                    </div>
                </template>
            </div>
        </div>
        <div
            v-if="availableFilters.vitalStatus"
            class="mb-3"
        >
            <h6><i class="fas fa-heartbeat" /> Vital Status</h6>

            <div>
                <template
                    v-for="item in availableFilters.vitalStatus"
                    :key="item.code"
                >
                    <div class="form-check">
                        <VCFormInputCheckbox
                            v-model="vitalStatus"
                            :label="true"
                            :label-content="(item.display || item.code)"
                            :value="item.code"
                        />
                    </div>
                </template>
            </div>
        </div>
        <div
            v-if="availableFilters.site"
            class="mb-3"
        >
            <h6><i class="fas fa-hospital" /> Standort</h6>

            <div>
                <template
                    v-for="item in availableFilters.site"
                    :key="item.code"
                >
                    <div class="form-check">
                        <VCFormInputCheckbox
                            v-model="site"
                            :label="true"
                            :label-content="(item.display || item.code)"
                            :value="item.code"
                        />
                    </div>
                </template>
            </div>
        </div>
        <div
            v-if="availableFilters.ageRange"
            class="mb-3"
        >
            <h6><i class="fas fa-users" /> Alter <small class="text-muted">({{ age.min }} - {{ age.max }})</small></h6>

            <div class="mt-3">
                <FormRangeSlider
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
                    :disabled="isSubmitted || busy"
                    @click.prevent="submit"
                >
                    Anwenden
                </button>
            </div>
            <div v-if="hasChanged">
                <button
                    type="button"
                    class="btn btn-xs btn-secondary btn-block"
                    @click.prevent="reset"
                >
                    Zurücksetzen
                </button>
            </div>
        </div>
    </div>
</template>
