<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    type Coding,
    DCollectionTransform, 
    DTags, 
    DValueSet, 
    type ValueSetCoding,
} from '@dnpm-dip/core';
import { VCButton } from '@vuecs/button';
import { type FormOption, VCFormCheckboxGroup, VCFormSelectSearch } from '@vuecs/forms';
import {
    type PropType,
    computed,
    defineComponent,
    reactive,
    ref,
} from 'vue';

export default defineComponent({
    components: {
        DValueSet,
        DTags,
        DCollectionTransform,
        VCButton,
        VCFormCheckboxGroup,
        VCFormSelectSearch,
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
        // label lookup for ATC codes — deliberately non-reactive: it is
        // filled during option transform (render path) and read only when
        // the selection changes afterwards.
        const drugLabels = new Map<string, string>();

        const transformCodings = (coding: ValueSetCoding) => {
            drugLabels.set(`${coding.code}`, coding.display || `${coding.code}`);

            return {
                value: coding.code,
                label: coding.display || coding.code,
            };
        };

        const form = reactive<{
            combination: boolean,
            usage: string[],
            atcDrugs: string[],
            customDrugs: FormOption[],
            customDrug: '',
        }>({
            combination: props.combination,
            usage: props.usage,
            atcDrugs: [],
            customDrugs: [],
            customDrug: '',
        });

        const init = () => {
            for (const drug of props.drugs) {
                if (
                    drug.system &&
                    drug.system.includes('atc')
                ) {
                    drugLabels.set(`${drug.code}`, drug.display || `${drug.code}`);
                    form.atcDrugs.push(`${drug.code}`);
                } else {
                    form.customDrugs.push({
                        value: drug.code,
                        label: drug.display || drug.code,
                    });
                }
            }
        };

        init();

        const allDrugs = computed(() => [
            ...form.atcDrugs.map((code) => ({ id: code, value: drugLabels.get(code) || code })),
            ...form.customDrugs.map((item) => ({ id: String(item.value), value: String(item.label) })),
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
            for (const drug of form.atcDrugs) {
                drugs.push({
                    code: drug,
                    system: 'atc',
                });
            }
            for (const drug of form.customDrugs) {
                drugs.push({ code: `${drug.value}` });
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
                value: form.customDrug,
                label: form.customDrug,
            });

            form.customDrug = '';

            handleChanged();
        };

        const dropCustom = ({ id, value }: { id: string, value: string }) => {
            let index = form.atcDrugs.findIndex((el) => el === id);
            if (index !== -1) {
                form.atcDrugs.splice(index, 1);
                handleChanged();
                return;
            }

            index = form.customDrugs.findIndex((el) => el.value === id && el.label === value);
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
        <div class="flex flex-row">
            <div>
                <VCFormCheckbox
                    v-model="form.combination"
                    :group-class="'inline-flex items-center gap-2'"
                    :label="true"
                    :label-content="'In Kombination?'"
                    @update:model-value="handleChanged"
                />
            </div>
            <VCFormCheckboxGroup
                v-model="form.usage"
                @update:model-value="handleChanged"
            >
                <div class="ms-3">
                    <VCFormCheckbox
                        :group-class="'inline-flex items-center gap-2'"
                        :value="'recommended'"
                        :label="true"
                    >
                        <template #label="{id}">
                            <label :for="id">Empfohlen?</label>
                        </template>
                    </VCFormCheckbox>
                </div>
                <div class="ms-3">
                    <VCFormCheckbox
                        :group-class="'inline-flex items-center gap-2'"
                        :value="'used'"
                        :label="true"
                    >
                        <template #label="{id}">
                            <label :for="id">Verabreicht?</label>
                        </template>
                    </VCFormCheckbox>
                </div>
            </VCFormCheckboxGroup>
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
                                :items="data.codings || []"
                                :transform="transformCodings"
                            >
                                <template #default="options">
                                    <VCFormSelectSearch
                                        v-model="form.atcDrugs"
                                        :options="options"
                                        :close-on-select="true"
                                        placeholder="ATC"
                                        @change="handleChanged"
                                    >
                                        <!-- suppress the built-in chips: the merged
                                             DTags below renders ATC + custom drugs
                                             with the und/oder separator -->
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
            <VCButton
                :disabled="form.customDrug.length === 0"
                type="button"
                color="neutral"
                size="xs"
                @click.prevent="addCustom"
            >
                Hinzufügen
            </VCButton>
        </div>
        <DTags
            :emit-only="true"
            :items="allDrugs"
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
