<script lang="ts">
import {
    type CodeSystemConcept,
    DCodeSystem, DCollectionTransform, DTags, HGVS_CODE_REGEX, transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import { IVuelidate } from '@ilingo/vuelidate';
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import {
    type PropType, computed, defineComponent, reactive, toRef, watch,
} from 'vue';
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { QuerySNVCriteria } from '../../domains';

export default defineComponent({
    components: {
        DTags, DCodeSystem, DCollectionTransform, IVuelidate, VCFormSelectSearch,
    },
    props: {
        entity: Object as PropType<QuerySNVCriteria<string>>,
    },
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');
        const form = reactive<QuerySNVCriteria<string>>({
            gene: '',
            dnaChange: '',
            proteinChange: '',
            supporting: false,
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

            form.gene = props.entity?.gene || '';
            form.dnaChange = props.entity?.dnaChange || '';
            form.proteinChange = props.entity?.proteinChange || '';
            form.supporting = props.entity?.supporting || false;
        };

        init();

        watch(entityRef, () => {
            init();
        });

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        const isEditing = computed(() => !!entityRef.value);
        const submit = () => {
            emit('updated', {
                gene: form.gene,
                dnaChange: form.dnaChange,
                proteinChange: form.proteinChange,
                supporting: form.supporting,
            } satisfies QuerySNVCriteria<string>);
        };

        return {
            form,
            transformConcepts,
            isEditing,
            submit,
            vuelidate,
        };
    },
});
</script>
<template>
    <div class="form-group">
        <label>Gen</label>
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
                        >
                            <template #selected="{ items, toggle }">
                                <DTags
                                    :emit-only="true"
                                    :items="items"
                                    tag-variant="dark"
                                    @deleted="toggle"
                                />
                            </template>
                        </VCFormSelectSearch>
                    </template>
                </DCollectionTransform>
            </template>
            <template #loading>
                <VCFormSelectSearch
                    :options="[]"
                    :disabled="true"
                    placeholder="HGNC"
                />
            </template>
        </DCodeSystem>
    </div>
    <VCFormGroup>
        <template #label>
            DNA-Änderung
        </template>
        <template #default>
            <VCFormInput
                v-model="form.dnaChange"
                placeholder="HGVS"
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
    <div class="mb-1">
        <VCFormInputCheckbox
            v-model="form.supporting"
            :group-class="'form-switch'"
            :label="true"
            :label-content="'Stützend?'"
        />
    </div>
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
