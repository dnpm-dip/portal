<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    type Coding,
    DCollectionTransform, DTags, DValueSet, type ValueSetCoding,
} from '@dnpm-dip/core';
import { type FormSelectOption, VCFormSelectSearch } from '@vuecs/form-controls';
import {
    type PropType, computed, defineComponent, nextTick, reactive, ref,
} from 'vue';

export default defineComponent({
    components: {
        DValueSet, DTags, DCollectionTransform, VCFormSelectSearch,
    },
    props: {
        drugs: {
            type: Array as PropType<Coding[]>,
            required: true,
        },
        usage: {
            type: Array as PropType<string[]>,
            required: true,
        },
        combination: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['updated'],
    setup(props, { emit }) {
        const transformCodings = (coding: ValueSetCoding) => ({
            id: coding.code,
            value: coding.display || coding.code,
        });

        const form = reactive<{
            combination: boolean,
            usage: string[],
            atcDrugs: FormSelectOption[],
            customDrugs: FormSelectOption[],
            customDrug: '',
        }>({
            combination: props.combination,
            usage: props.usage,
            atcDrugs: [],
            customDrugs: [],
            customDrug: '',
        });

        const init = () => {
            for (let i = 0; i < props.drugs.length; i++) {
                if (
                    props.drugs[i].system &&
                    props.drugs[i].system.includes('atc')
                ) {
                    form.atcDrugs.push({
                        id: props.drugs[i].code,
                        value: props.drugs[i].display || props.drugs[i].code,
                    });
                } else {
                    form.customDrugs.push({
                        id: props.drugs[i].code,
                        value: props.drugs[i].display || props.drugs[i].code,
                    });
                }
            }
        };

        init();

        const allDrugs = computed(() => [
            ...form.atcDrugs,
            ...form.customDrugs,
        ]);

        const currentTab = ref('atc');
        const tabs = ref([
            { id: 'atc', value: 'ATC' },
            { id: 'custom', value: 'Unregistriert' },
        ]);

        const changeTab = (id: string) => {
            currentTab.value = id;
        };

        const handleChanged = () => {
            const drugs: Coding[] = [];
            for (let i = 0; i < form.atcDrugs.length; i++) {
                drugs.push({
                    code: `${form.atcDrugs[i].id}`,
                    system: 'atc',
                });
            }
            for (let i = 0; i < form.customDrugs.length; i++) {
                drugs.push({
                    code: `${form.customDrugs[i].id}`,
                });
            }

            emit('updated', {
                combination: form.combination,
                usage: form.usage,
                drugs,
            });
        };

        const addCustom = () => {
            if (form.customDrug.length === 0) {
                return;
            }

            form.customDrugs.push({
                id: form.customDrug,
                value: form.customDrug,
            });

            form.customDrug = '';

            handleChanged();
        };

        const dropCustom = ({ id, value }: { id: string, value: string}) => {
            let index = form.atcDrugs.findIndex((el) => el.id === id && el.value === value);
            if (index !== -1) {
                form.atcDrugs.splice(index, 1);
                handleChanged();
                return;
            }

            index = form.customDrugs.findIndex((el) => el.id === id && el.value === value);
            if (index !== -1) {
                form.customDrugs.splice(index, 1);
                handleChanged();
            }
        };

        return {
            allDrugs,

            addCustom,
            dropCustom,

            form,
            handleChanged,
            transformCodings,

            changeTab,
            currentTab,
            tabs,
        };
    },
});
</script>
<template>
    <div class="mb-3">
        <h6><i class="fa fa-pills" /> Medikation</h6>
        <div class="d-flex flex-row">
            <div>
                <VCFormInputCheckbox
                    v-model="form.combination"
                    :group-class="'form-switch'"
                    :label="true"
                    :label-content="'In Kombination?'"
                    @change="handleChanged"
                />
            </div>
            <div class="ms-3">
                <VCFormInputCheckbox
                    v-model="form.usage"
                    :group-class="'form-switch'"
                    :value="'recommended'"
                    :label="true"
                    :group="true"
                    @change="handleChanged"
                >
                    <template #label="{id}">
                        <label :for="id">Empfohlen?</label>
                    </template>
                </VCFormInputCheckbox>
            </div>
            <div class="ms-3">
                <VCFormInputCheckbox
                    v-model="form.usage"
                    :group-class="'form-switch'"
                    :value="'used'"
                    :label="true"
                    :group="true"
                    @change="handleChanged"
                >
                    <template #label="{id}">
                        <label :for="id">Verabreicht?</label>
                    </template>
                </VCFormInputCheckbox>
            </div>
        </div>

        <ul class="nav nav-pills mt-1 mb-1">
            <template
                v-for="(tab, index) in tabs"
                :key="index"
            >
                <li
                    class="nav-item"
                >
                    <a
                        style="padding: 0.25rem 0.5rem;"
                        href="#"
                        class="nav nav-link"
                        :class="{'active': tab.id === currentTab}"
                        @click.prevent="changeTab(tab.id)"
                    >
                        {{ tab.value }}
                    </a>
                </li>
            </template>
        </ul>
        <div v-show="currentTab === 'atc'">
            <VCFormGroup>
                <template #label>
                    Name
                </template>
                <template #default>
                    <DValueSet
                        :code="'http://fhir.de/CodeSystem/bfarm/atc'"
                        :lazy-load="true"
                    >
                        <template #default="{ data }">
                            <DCollectionTransform
                                :items="data.codings"
                                :transform="transformCodings"
                            >
                                <template #default="options">
                                    <VCFormSelectSearch
                                        v-model="form.atcDrugs"
                                        :multiple="true"
                                        :options="options"
                                        placeholder="ATC"
                                        @change="handleChanged"
                                    >
                                        <template #selected>
                                            <span />
                                        </template>
                                    </VCFormSelectSearch>
                                </template>
                            </DCollectionTransform>
                        </template>
                        <template #loading>
                            <VCFormSelectSearch
                                :options="[]"
                                :disabled="true"
                                placeholder="ATC"
                            />
                        </template>
                    </DValueSet>
                </template>
            </VCFormGroup>
        </div>
        <div v-show="currentTab === 'custom'">
            <VCFormGroup>
                <template #label>
                    Name
                </template>
                <template #default>
                    <VCFormInput
                        v-model="form.customDrug"
                        class="mb-1"
                        placeholder="Unregistriert"
                    />
                </template>
            </VCFormGroup>
            <button
                :disabled="form.customDrug.length === 0"
                type="button"
                class="btn btn-dark btn-xs"
                @click.prevent="addCustom"
            >
                Hinzufügen
            </button>
        </div>
        <DTags
            class="mt-2"
            :emit-only="true"
            :items="allDrugs"
            tag-variant="light"
            @deleted="dropCustom"
        >
            <template #between>
                <span class="me-1">
                    <template v-if="combination">
                        und
                    </template>
                    <template v-else>
                        oder
                    </template>
                </span>
            </template>
        </DTags>
    </div>
</template>
