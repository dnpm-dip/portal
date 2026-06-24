<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    HGVS_CODE_REGEX,
} from '@dnpm-dip/core';
import { IFieldValidation } from '@ilingo/validup-vue';
import { useValidup } from '@validup/vue';
import { Container, ValidupError, defineIssueItem } from 'validup';
import type { Validator } from 'validup';
import {
    type PropType,
    computed,
    defineComponent,
    reactive,
    toRef,
    watch,
} from 'vue';
import { type QueryGeneAlterationSNVCriteria, QueryMutationType } from '../../../domains';

const hgvsValidator: Validator = (ctx) => {
    const value = ctx.value as string | undefined;
    if (!value) {
        return value;
    }

    HGVS_CODE_REGEX.lastIndex = 0;
    if (!HGVS_CODE_REGEX.test(value)) {
        throw new ValidupError([
            defineIssueItem({
                path: [],
                message: 'Es müssen ein oder mehrere HGVS-Codes in 3-Buchstaben-Format in der Eingabe vorkommen',
            }),
        ]);
    }

    return value;
};

class SNVCriteriaValidator extends Container<{ proteinChange: string }> {
    protected override initialize() {
        super.initialize();
        this.mount('proteinChange', { optional: true }, hgvsValidator);
    }
}

export default defineComponent({
    components: { IFieldValidation },
    props: { entity: Object as PropType<QueryGeneAlterationSNVCriteria> },
    emits: ['updated'],
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');
        const form = reactive<{
            type: `${QueryMutationType.SNV}`,
            dnaChange: string,
            proteinChange: string,
        }>({
            type: QueryMutationType.SNV,
            dnaChange: '',
            proteinChange: '',
        });

        const v = useValidup(new SNVCriteriaValidator(), form);

        const init = () => {
            if (!props.entity) return;

            form.dnaChange = props.entity?.dnaChange || '';
            form.proteinChange = props.entity?.proteinChange || '';
        };

        init();

        watch(entityRef, () => {
            init();
        });

        const isEditing = computed(() => !!entityRef.value);
        const handleChanged = () => {
            const output : QueryGeneAlterationSNVCriteria = { type: QueryMutationType.SNV };

            if (form.dnaChange) {
                output.dnaChange = form.dnaChange;
            }

            if (form.proteinChange) {
                output.proteinChange = form.proteinChange;
            }

            emit('updated', output);
        };

        return {
            form,
            isEditing,
            handleChanged,
            v,
        };
    },
});
</script>
<template>
    <VCFormGroup>
        <template #label>
            DNA-Änderung
        </template>
        <template #default>
            <VCFormInput
                v-model="form.dnaChange"
                placeholder="HGVS"
                @change="handleChanged"
            />
        </template>
    </VCFormGroup>
    <IFieldValidation
        v-slot="{ value }"
        :field="v.fields.proteinChange"
    >
        <VCFormGroup :validation="value">
            <template #label>
                Proteinänderung
            </template>
            <VCFormInput
                v-model="v.fields.proteinChange.$model.value"
                placeholder="HGVS 3-Buchstaben-Code"
                @change="handleChanged"
            />
            <!--
                <div class="alert alert-sm alert-info mt-1">
                    todo: as tooltip - info icon next to label
                    <VCLink
                        target="_blank"
                        href="https://hgvs-nomenclature.org/stable/background/standards/#amino-acid-descriptions"
                    >
                        code
                    </VCLink>
                </div>
                -->
        </VCFormGroup>
    </IFieldValidation>
</template>
