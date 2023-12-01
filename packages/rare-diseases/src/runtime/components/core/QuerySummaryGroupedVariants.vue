<script lang="ts">
import type { FormSelectOption } from '@vue-layout/form-controls';
import type { PropType, Ref} from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import type { VariantDistribution } from '../../domains';
import QuerySummaryDistributionBar from './QuerySummaryDistributionBar.vue';

export default defineComponent({
    components: { QuerySummaryDistributionBar },
    props: {
        items: {
            type: Object as PropType<VariantDistribution[]>,
            required: true
        }
    },
    setup(props) {
        const variantId = ref(null) as Ref<string | null>;
        const variant = ref(null) as Ref<VariantDistribution | null>;

        const options = computed<FormSelectOption[]>(() => {
            return props.items.map((el) => {
                return {
                    id: el.key.code,
                    value: el.key.display || el.key.code
                }
            })
        });

        watch(variantId, (val) => {
            if(!val) {
                variant.value = null;
                return;
            }

            const index = props.items.findIndex((el) => el.key.code === val);
            if(index !== -1) {
                variant.value = props.items[index];
            }
        })

        return {
            options,
            variant,
            variantId
        }
    }
})
</script>
<template>
    <VCFormGroup>
        <template #label>
            Variante
        </template>

        <VCFormSelect
            v-model="variantId"
            :options="options"
        />
    </VCFormGroup>
    <template v-if="variant">
        <div class="row">
            <div class="col-12 col-xl-6">
                <div class="entity-card text-center mb-3 w-100">
                    <h6 class="text-center">
                        Verteilung von Diagnose Kategorien
                    </h6>
                    <QuerySummaryDistributionBar :items="variant.value.diseaseCategory" />
                </div>
            </div>
            <div class="col-12 col-xl-6">
                <div class="entity-card text-center mb-3 w-100">
                    <h6 class="text-center">
                        Verteilung von HPO Termen
                    </h6>
                    <QuerySummaryDistributionBar :items="variant.value.hpoTerm" />
                </div>
            </div>
        </div>

    </template>
</template>
