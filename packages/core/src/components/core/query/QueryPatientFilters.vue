<script lang="ts">
import type { PropType, Ref } from 'vue';
import {
    computed,
    defineComponent, ref, watch,
} from 'vue';
import type { PatientFilter } from '../../../domains';
import { clone } from '../../../utils';
import { DFormRangeSlider } from '../../utility';

type QueryRecord = {
    age?: {
        min?: number,
        max?: number
    },
    vitalStatus?: string[],
    gender?: string[],
    site?: string[],
};

export default defineComponent({
    components: {
        DFormRangeSlider,
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
                ageChanged.value ||
                siteChanged.value,
        );

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
        };

        reset();

        const buildQueryRecord = (skipCheck?: boolean) : QueryRecord => {
            const data : QueryRecord = {};

            if (skipCheck || ageChanged.value) {
                data.age = {
                    min: age.value.min,
                    max: age.value.max,
                };
            }

            if (skipCheck || vitalStatusChanged.value) {
                data.vitalStatus = clone(vitalStatus.value);
            } else {
                data.vitalStatus = [];
            }

            if (skipCheck || genderChanged.value) {
                data.gender = clone(gender.value);
            } else {
                data.gender = [];
            }

            if (skipCheck || siteChanged.value) {
                data.site = clone(site.value);
            } else {
                data.site = [];
            }

            return data;
        };

        const previousQuery : Ref<QueryRecord> = ref(buildQueryRecord(true));

        const handleAgeRangeChanged = (ctx: { min: number, max: number}) => {
            if (!previousQuery.value || !previousQuery.value.age) {
                return;
            }

            age.value.min = Math.round(ctx.min);
            age.value.max = Math.round(ctx.max);

            if (
                age.value.min !== previousQuery.value.age.min ||
                age.value.max !== previousQuery.value.age.max
            ) {
                ageChanged.value = true;
            }
        };

        watch(gender, (value) => {
            if (!previousQuery.value.gender) {
                genderChanged.value = true;
                return;
            }

            if (value.length !== previousQuery.value.gender.length) {
                genderChanged.value = true;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = previousQuery.value.gender.findIndex((el) => el === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            genderChanged.value = changed;
        }, { deep: true });

        watch(vitalStatus, (value) => {
            if (!previousQuery.value.vitalStatus) {
                vitalStatusChanged.value = true;
                return;
            }
            if (value.length !== previousQuery.value.vitalStatus.length) {
                vitalStatusChanged.value = true;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = previousQuery.value.vitalStatus.findIndex((el) => el === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            vitalStatusChanged.value = changed;
        }, { deep: true });

        watch(site, (value) => {
            if (!previousQuery.value.site) {
                return;
            }

            if (value.length !== previousQuery.value.site.length) {
                siteChanged.value = true;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = previousQuery.value.site.findIndex((el) => el === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            siteChanged.value = changed;
        }, { deep: true });

        const submit = () => {
            previousQuery.value = buildQueryRecord();

            emit('submit', previousQuery.value);

            genderChanged.value = false;
            vitalStatusChanged.value = false;
            siteChanged.value = false;
            ageChanged.value = false;
        };

        return {
            age,
            gender,
            vitalStatus,
            site,

            hasChanged,

            handleAgeRangeChanged,

            reset,
            submit,

            previousQuery,
        };
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="text-center">
            <h5 class="text-muted">
                Patient
            </h5>
        </div>
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
                <DFormRangeSlider
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
                    :disabled="!hasChanged"
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
    </div>
</template>
