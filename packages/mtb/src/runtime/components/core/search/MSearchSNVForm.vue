<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    type CodeSystemConcept,
    HGVS_CODE_REGEX, toCoding, transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import { IVuelidate } from '@ilingo/vuelidate';
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import {
    type PropType, computed, defineComponent, reactive, toRef, watch,
} from 'vue';
import { FormMutationType, type QueryGeneAlterationSNVCriteria } from '../../../domains';

export default defineComponent({
    components: {
        IVuelidate,
    },
    props: {
        entity: Object as PropType<QueryGeneAlterationSNVCriteria>,
    },
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');
        const form = reactive<Partial<QueryGeneAlterationSNVCriteria<string>>>({
            type: FormMutationType.SNV,
            dnaChange: '',
            proteinChange: '',
        });

        const vuelidate = useVuelidate({
            gene: {

            },
            dnaChange: {

            },
            proteinChange: {
                hgvs: helpers.regex(HGVS_CODE_REGEX),
            },
            supporting: {

            },
        }, form);

        const init = () => {
            if (!props.entity) return;

            form.dnaChange = props.entity?.dnaChange?.code || '';
            form.proteinChange = props.entity?.proteinChange?.code || '';
        };

        init();

        watch(entityRef, () => {
            init();
        });

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        const isEditing = computed(() => !!entityRef.value);
        const handleChanged = () => {
            const output : QueryGeneAlterationSNVCriteria = {
                type: FormMutationType.SNV,
            };

            if (form.dnaChange) {
                output.dnaChange = toCoding(form.dnaChange);
            }

            if (form.proteinChange) {
                output.proteinChange = toCoding(form.proteinChange);
            }

            emit('updated', output);
        };

        return {
            form,
            transformConcepts,
            isEditing,
            handleChanged,
            vuelidate,
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
    <IVuelidate :validation="vuelidate.proteinChange">
        <template #default="props">
            <VCFormGroup
                :validation-messages="props.data"
                :validation-severity="props.severity"
            >
                <template #label>
                    Proteinänderung
                </template>
                <template #default>
                    <VCFormInput
                        v-model="vuelidate.proteinChange.$model"
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
                </template>
            </VCFormGroup>
        </template>
    </ivuelidate>
</template>
