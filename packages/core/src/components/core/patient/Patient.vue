<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { Patient } from '../../../domains';
import DFact from '../../utility/DFact.vue';
import DCodingText from '../coding/DCodingText';

export default defineComponent({
    components: { DCodingText, DFact },
    props: {
        entity: {
            type: Object as PropType<Patient>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <h5 class="section-label mb-2">
            Stammdaten
        </h5>
        <div class="entity-card">
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                <DFact
                    label="Geschlecht"
                    icon="fa6-solid:user"
                >
                    <DCodingText :entity="entity.gender" />
                </DFact>
                <DFact
                    label="Geburtstag"
                    icon="fa6-solid:cake-candles"
                >
                    {{ entity.birthDate }}
                </DFact>
                <DFact
                    v-if="entity.age"
                    label="Alter"
                    icon="fa6-solid:hourglass-half"
                >
                    {{ entity.age.value }} {{ entity.age.unit }}
                </DFact>
                <DFact
                    v-if="entity.dateOfDeath"
                    label="Todestag"
                    icon="fa6-solid:skull"
                >
                    {{ entity.dateOfDeath }}
                </DFact>
                <DFact
                    v-if="entity.managingSite"
                    label="Standort"
                    icon="fa6-solid:hospital"
                >
                    <DCodingText :entity="entity.managingSite" />
                </DFact>
                <DFact
                    v-if="entity.vitalStatus"
                    label="Vitalstatus"
                    icon="fa6-solid:heart-pulse"
                >
                    <DCodingText :entity="entity.vitalStatus" />
                </DFact>
                <DFact
                    v-if="entity.healthInsurance"
                    label="Krankenversicherung"
                    icon="fa6-solid:id-card"
                >
                    <DCodingText :entity="entity.healthInsurance.type" />
                </DFact>
                <DFact
                    v-if="entity.address"
                    label="Adresse"
                    icon="fa6-solid:location-dot"
                >
                    {{ entity.address.municipalityCode }}
                </DFact>
            </div>
        </div>
    </div>
</template>
