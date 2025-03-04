<script lang="ts">
import useVuelidate from '@vuelidate/core';
import { maxLength, minLength, required } from '@vuelidate/validators';
import { VCFormGroup, VCFormInput } from '@vuecs/form-controls';

import { IVuelidate } from '@ilingo/vuelidate';
import type { PropType } from 'vue';
import {
    computed, defineComponent, reactive, ref, toRef, watch,
} from 'vue';
import type { PreparedQuery } from '../../../domains';
import { PreparedQueryAPI } from '../../../domains';
import { injectHTTPClient } from '../../../core';

export default defineComponent({
    components: {
        IVuelidate,
        VCFormGroup,
        VCFormInput,
    },
    props: {
        criteria: {
            type: Object as PropType<Record<string, any>>,
        },
        entity: {
            type: Object as PropType<PreparedQuery>,
        },
        useCase: {
            type: String,
            required: true,
        },
    },
    emits: ['changed', 'updated', 'created', 'failed'],
    setup(props, { emit }) {
        const httpClient = injectHTTPClient();
        const preparedQueryAPI = new PreparedQueryAPI({
            client: httpClient,
            useCase: props.useCase,
        });

        const entity = toRef(props, 'entity');
        const entityId = computed(() => {
            if (entity.value) {
                return entity.value.id;
            }

            return null;
        });

        const isBusy = ref(false);
        const form = reactive({
            name: '',
        });

        const init = () => {
            form.name = props.entity?.name || '';
        };

        init();

        watch(entityId, () => init());

        const vuelidate = useVuelidate({
            name: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(128),
            },
        }, form);

        const submit = async () => {
            if (isBusy.value) return;

            isBusy.value = true;

            try {
                if (props.entity) {
                    const response = await preparedQueryAPI.update(
                        props.entity.id,
                        {
                            criteria: props.criteria,
                            name: form.name,
                        },
                    );

                    emit('updated', response);
                } else {
                    const response = await preparedQueryAPI.create({
                        criteria: props.criteria,
                        name: form.name,
                    });

                    emit('created', response);
                }
            } catch (e) {
                emit('failed', e);
            } finally {
                isBusy.value = false;
            }
        };

        const handleChanged = (name: string) => {
            emit('changed', {
                name,
            });
        };

        return {
            handleChanged,
            isBusy,
            submit,
            vuelidate,
        };
    },
});
</script>
<template>
    <div>
        <IVuelidate :validation="vuelidate.name">
            <template #default="props">
                <VCFormGroup
                    :validation-messages="props.data"
                    :validation-severity="props.severity"
                >
                    <template #label>
                        Name
                    </template>
                    <VCFormInput
                        v-model="vuelidate.name.$model"
                        @change="handleChanged"
                    />
                </VCFormGroup>
            </template>
        </IVuelidate>
    </div>
    <div>
        <slot
            name="default"
            :is-busy="isBusy"
            :is-invalid="vuelidate.$invalid"
            :submit="submit"
        >
            <button
                type="button"
                class="btn btn-xs btn-dark"
                :disabled="isBusy || vuelidate.$invalid"
                @click.prevent="submit"
            >
                Speichern
            </button>
        </slot>
    </div>
</template>
