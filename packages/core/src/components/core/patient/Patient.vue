<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { Patient } from '../../../domains';
import DCodingText from '../coding/DCodingText';

export default defineComponent({
    components: { DCodingText },
    props: {
        entity: {
            type: Object as PropType<Patient>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="row">
        <h5>Stammdaten</h5>
        <div class="col">
            <div class="entity-card">
                <div>
                    <strong><i class="fas fa-user" /> Geschlecht</strong>
                    <DCodingText :entity="entity.gender" />
                </div>
                <div>
                    <strong><i class="fas fa-birthday-cake" />Geburtstag</strong>
                    {{ entity.birthDate }}
                </div>
                <div v-if="entity.dateOfDeath">
                    <strong><i class="fas fa-skull" /> Todestag</strong>
                    {{ entity.dateOfDeath }}
                </div>
            </div>
        </div>
        <div class="col">
            <div class="entity-card">
                <template v-if="entity.managingSite">
                    <div>
                        <strong><i class="fas fa-hospital" /> Standort</strong>
                        <DCodingText :entity="entity.managingSite" />
                    </div>
                </template>
                <template v-if="entity.vitalStatus">
                    <div>
                        <strong><i class="fas fa-heartbeat" /> VitalStatus</strong>
                        <DCodingText :entity="entity.vitalStatus" />
                    </div>
                </template>
                <div v-if="entity.address">
                    <strong><i class="fa-map-marker-alt" /> Addresse</strong>
                    {{ entity.address.municipalityCode }}
                </div>
            </div>
        </div>
    </div>
</template>
