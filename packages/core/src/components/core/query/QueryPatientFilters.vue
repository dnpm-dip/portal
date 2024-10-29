<script lang="ts">
import type { PropType } from 'vue';
import {
    defineComponent, ref,
} from 'vue';
import { VCFormRangeMultiSlider } from '@vuecs/form-controls';
import type { PatientFilter } from '../../../domains';
import { useQueryFilterStore } from '../../../stores';
import QueryFilterBox from './QueryFilterBox.vue';

export default defineComponent({
    components: {
        QueryFilterBox,
        VCFormRangeMultiSlider,
    },
    props: {
        available: {
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
        const store = useQueryFilterStore();

        const gender = ref<string[]>([]);
        const vitalStatus = ref<string[]>([]);
        const site = ref<string[]>([]);
        const age = ref({
            min: 0,
            max: 100,
        });

        const reset = () => {
            if (props.available.gender) {
                gender.value = props.available.gender.map((el) => el.code);
            }

            if (props.available.vitalStatus) {
                vitalStatus.value = props.available.vitalStatus.map((el) => el.code);
            }

            if (props.available.ageRange) {
                age.value = {
                    min: props.available.ageRange.min,
                    max: props.available.ageRange.max,
                };
            }

            if (props.available.site) {
                site.value = props.available.site.map((el) => el.code);
            }
        };

        reset();

        const handleAgeRangeChanged = (ctx: { min: number, max: number}) => {
            age.value.min = Math.round(ctx.min);
            age.value.max = Math.round(ctx.max);

            if (props.available.ageRange) {
                if (
                    props.available.ageRange.min &&
                    props.available.ageRange.min === age.value.min
                ) {
                    store.set('age[min]', []);
                } else {
                    store.set('age[min]', [`${age.value.min}`]);
                }

                if (
                    props.available.ageRange.max &&
                    props.available.ageRange.max === age.value.max
                ) {
                    store.set('age[max]', []);
                } else {
                    store.set('age[max]', [`${age.value.max}`]);
                }
            }
        };

        const handleGenderChanged = () => {
            const data : string[] = [];
            if (
                props.available &&
                props.available.gender &&
                props.available.gender.length !== gender.value.length
            ) {
                data.push(...gender.value);
            }

            store.set('gender', data);
        };

        const handleVitalStatusChanged = () => {
            const data : string[] = [];
            if (
                props.available &&
                props.available.vitalStatus &&
                props.available.vitalStatus.length !== vitalStatus.value.length
            ) {
                data.push(...vitalStatus.value);
            }

            store.set('vitalStatus', data);
        };

        const handleSiteChanged = () => {
            const data : string[] = [];
            if (
                props.available &&
                props.available.site &&
                props.available.site.length !== site.value.length
            ) {
                data.push(...site.value);
            }

            store.set('site', data);
        };

        const submit = () => {
            store.commit();

            emit('submit');
        };

        return {
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
