<script lang="ts">
import {
    type CodeSystemConcept,
    type FormTab,
    HGVS_CODE_REGEX,
    transformConceptToFormSelectOption,
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
import { VCFormSelectSearch } from '@vuecs/forms';
import { DCodeSystem, DCollectionTransform } from '@dnpm-dip/core';
import type { QueryCriteriaVariant } from '../../domains';

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

class VariantCriteriaValidator extends Container<{ proteinChange: string }> {
    protected override initialize() {
        super.initialize();
        this.mount('proteinChange', { optional: true }, hgvsValidator);
    }
}

export default defineComponent({
    components: {
        IFieldValidation,
        DCollectionTransform,
        DCodeSystem,
        VCFormSelectSearch,
    },
    props: {
        entity: {
            type: Object as PropType<FormTab<QueryCriteriaVariant<string>>>,
            required: true,
        },
    },
    emits: ['saved'],
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

        const v = useValidup(new VariantCriteriaValidator(), form);

        watch(entity, () => {
            init();
        }, { deep: true });

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        const isEditing = computed(() => !!entity.value?.data);
        const submit = () => {
            if (v.$invalid.value) {
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
            v,
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
    <div>
        <button
            :disabled="v.$invalid.value"
            type="button"
            class="btn btn-dark btn-xs"
            @click.prevent="submit()"
        >
            {{ isEditing ? 'Aktualisieren' : 'Hinzufügen' }}
        </button>
    </div>
</template>
