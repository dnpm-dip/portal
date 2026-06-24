<script lang="ts">
import { useValidup } from '@validup/vue';
import { createValidator } from '@validup/zod';
import { Container } from 'validup';
import { z } from 'zod';
import { VCFormGroup, VCFormInput } from '@vuecs/forms';

import { IFieldValidation } from '@ilingo/validup-vue';
import type { PropType } from 'vue';
import {
    computed,
    defineComponent,
    reactive,
    ref,
    toRef,
    watch,
} from 'vue';
import type { PreparedQuery } from '../../../domains';
import { PreparedQueryAPI } from '../../../domains';
import { injectHTTPClient } from '../../../core';

class PreparedQueryValidator extends Container<{ name: string }> {
    protected override initialize() {
        super.initialize();
        this.mount('name', createValidator(z.string().min(3).max(128)));
    }
}

export default defineComponent({
    components: {
        IFieldValidation,
        VCFormGroup,
        VCFormInput,
    },
    props: {
        criteria: { type: Object as PropType<Record<string, unknown>> },
        entity: { type: Object as PropType<PreparedQuery> },
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
        const form = reactive({ name: '' });

        const init = () => {
            form.name = props.entity?.name || '';
        };

        init();

        watch(entityId, () => init());

        const v = useValidup(new PreparedQueryValidator(), form);

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
            emit('changed', { name });
        };

        return {
            handleChanged,
            isBusy,
            submit,
            v,
        };
    },
});
</script>
<template>
    <div>
        <IFieldValidation
            v-slot="{ value }"
            :field="v.fields.name"
        >
            <VCFormGroup :validation="value">
                <template #label>
                    Name
                </template>
                <VCFormInput
                    v-model="v.fields.name.$model.value"
                    @change="handleChanged"
                />
            </VCFormGroup>
        </IFieldValidation>
    </div>
    <div>
        <slot
            name="default"
            :is-busy="isBusy"
            :is-invalid="v.$invalid.value"
            :submit="submit"
        >
            <button
                type="button"
                class="btn btn-xs btn-dark"
                :disabled="isBusy || v.$invalid.value"
                @click.prevent="submit"
            >
                Speichern
            </button>
        </slot>
    </div>
</template>
