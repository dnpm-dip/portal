<script lang="ts">
import {
    type CodeSystemConcept,
    type FormTab,
    HGVS_CODE_REGEX,
    transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import { IVuelidate } from '@ilingo/vuelidate';
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import {
    type PropType, computed, defineComponent, reactive, toRef, watch,
} from 'vue';
import { VCFormSelectSearch } from '@vuecs/form-controls';
import { DCodeSystem, DCollectionTransform } from '@dnpm-dip/core';
import type { QueryCriteriaVariant } from '../../domains';

export default defineComponent({
    components: {
        IVuelidate, DCollectionTransform, DCodeSystem, VCFormSelectSearch,
    },
    emit: ['saved'],
    props: {
        entity: {
            type: Object as PropType<FormTab<QueryCriteriaVariant<string>>>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const entity = toRef(props, 'entity');

        const form = reactive({
            gene: '',
            cDNAChange: '',
            gDNAChange: '',
            proteinChange: '',
        });

        const init = () => {
            form.gene = props.entity?.data?.gene || '';
            form.cDNAChange = props.entity?.data?.cDNAChange || '';
            form.gDNAChange = props.entity?.data?.gDNAChange || '';
            form.proteinChange = props.entity?.data?.proteinChange || '';
        };

        init();

        const vuelidate = useVuelidate({
            gene: {

            },
            cDNAChange: {

            },
            gDNAChange: {

            },
            proteinChange: {
                hgvs: helpers.regex(HGVS_CODE_REGEX),
            },
        }, form);

        watch(entity, () => {
            init();
        }, { deep: true });

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        const isEditing = computed(() => !!entity.value?.data);
        const submit = () => {
            if (vuelidate.value.$invalid) {
                emit('saved', {
                    ...props.entity,
                    data: null,
                });
            } else {
                emit('saved', {
                    ...props.entity,
                    data: { ...form },
                });
            }
        };

        return {
            form,
            transformConcepts,
            vuelidate,
            isEditing,
            submit,
        };
    },
});
</script>
<template>
    <div class="form-group">
        <label>Gene</label>
        <DCodeSystem
            :code="'https://www.genenames.org/'"
            :lazy-load="true"
        >
            <template #default="{ data }">
                <DCollectionTransform
                    :items="data.concepts"
                    :transform="transformConcepts"
                >
                    <template #default="options">
                        <VCFormSelectSearch
                            v-model="form.gene"
                            :options="options"
                            placeholder="HGNC"
                        />
                    </template>
                </DCollectionTransform>
            </template>
            <template #loading>
                <VCFormSelectSearch
                    :disabled="true"
                    :options="[]"
                    placeholder="HGNC"
                />
            </template>
        </DCodeSystem>
    </div>
    <VCFormGroup>
        <label>kodierende DNA-Änderung</label>
        <VCFormInput
            v-model="form.cDNAChange"
            placeholder="HGVS"
        />
    </VCFormGroup>
    <VCFormGroup>
        <label>genomische DNA-Änderung</label>
        <VCFormInput
            v-model="form.gDNAChange"
            placeholder="HGVS"
        />
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
    </Ivuelidate>
    <div>
        <button
            :disabled="vuelidate.$invalid"
            type="button"
            class="btn btn-dark btn-xs"
            @click.prevent="submit()"
        >
            {{ isEditing ? 'Aktualisieren' : 'Hinzufügen' }}
        </button>
    </div>
</template>
