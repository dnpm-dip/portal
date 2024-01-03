<script lang="ts">
import type { CodeSystemConcept, ValueSetCoding } from '@dnpm-dip/core';
import {
    QueryRequestMode,
} from '@dnpm-dip/core';
import type { FormSelectOption } from '@vuecs/form-controls';
import type { PropType } from 'vue';
import {
    defineComponent, ref,
} from 'vue';
import { useMTBAPIClient } from '#imports';

export default defineComponent({
    props: {
        queryId: {
            type: String,
        },
        queryMode: {
            type: String as PropType<QueryRequestMode>,
        },
    },
    emits: [
        'failed',

        'preparedQueryCreated',
        'preparedQueryUpdated',

        'queryCreated',
        'queryUpdated',
    ],
    async setup(props, { emit, expose }) {
        const apiClient = useMTBAPIClient();

        const mode = ref<QueryRequestMode>(QueryRequestMode.FEDERATED);
        const modeOptions : FormSelectOption[] = [
            { id: QueryRequestMode.LOCAL, value: 'Lokal' },
            { id: QueryRequestMode.FEDERATED, value: 'Föderiert' },
        ];

        const busy = ref(false);

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            busy.value = false;
        };

        expose({
            reset,
        });

        Promise.resolve()
            .then(() => reset());

        const submit = async () => {
            if (busy.value) return;

            busy.value = true;

            const payload = {};

            try {
                let query : any;

                if (props.queryId) {
                    query = await apiClient.query.update(props.queryId, {
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
                    });

                    emit('queryUpdated', query);
                } else {
                    query = await apiClient.query.submit({
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
                    });

                    emit('queryCreated', query);
                }
            } catch (e) {
                if (e instanceof Error) {
                    emit('failed', e);
                }
            } finally {
                busy.value = false;
            }
        };

        const transformCodings = (coding: ValueSetCoding) => ({
            id: coding.code,
            value: coding.display ? `${coding.code}: ${coding.display}` : coding.code,
        });

        const transformConcepts = (concept: CodeSystemConcept) => ({
            id: concept.code,
            value: `${concept.properties.Symbol}: ${concept.display}`,
        });

        return {
            mode,
            modeOptions,

            busy,

            submit,
        };
    },
});
</script>
<template>
    <div>
        <form>
            <div>
                <h6>Suchmodus</h6>

                <VCFormSelect
                    v-model="mode"
                    :options="modeOptions"
                    :option-default="false"
                />
            </div>

            <hr>

            <div>
                <div class="row">
                    <div class="col">
                        <button
                            :disabled="busy"
                            type="button"
                            class="btn btn-block btn-dark"
                            @click.prevent="submit()"
                        >
                            <i class="fa fa-search me-1" /> Suchen
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
