<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { Patient } from '../../../domains';

export default defineComponent({
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
                <div><strong><i class="fas fa-user" /> Geschlecht</strong> {{ entity.gender.display }}</div>
                <div><strong><i class="fas fa-birthday-cake" /> Geburtstag</strong> {{ entity.birthDate }} ({{ entity.age.value }} Jahre)</div>
            </div>
        </div>
        <div class="col">
            <div class="entity-card">
                <template v-if="entity.managingSite">
                    <div>
                        <strong><i class="fas fa-hospital" /> Standort</strong>
                        {{ entity.managingSite.display || entity.managingSite.code }}
                    </div>
                </template>
                <template v-if="entity.vitalStatus">
                    <div>
                        <strong><i class="fas fa-heartbeat" /> VitalStatus</strong>
                        {{ entity.vitalStatus.display || entity.vitalStatus.code }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
