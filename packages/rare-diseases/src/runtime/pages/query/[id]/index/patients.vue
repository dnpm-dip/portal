<script lang="ts">
import { Nav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import QueryPatientMatchEntity from '../../../../components/core/QueryPatientMatchEntity.vue';
import QueryPatientMatchList from '../../../../components/core/QueryPatientMatchList';
import type { RDQuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        QueryPatientMatchEntity,
        QueryPatientMatchList,
        Nav,
    },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
    setup() {

    },
});
</script>
<template>
    <div>
        <h6>Patienten</h6>

        <QueryPatientMatchList :query-id="entity.id">
            <template #default="props">
                <template v-if="props.data.length > 0">
                    <div class="list">
                        <ul class="list-body list-unstyled">
                            <template
                                v-for="(item, index) in props.data"
                                :key="item.id"
                            >
                                <li class="list-item flex-row">
                                    <QueryPatientMatchEntity
                                        :entity="item"
                                        :query-id="entity.id"
                                        :index="index"
                                    />
                                </li>
                            </template>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <div class="alert alert-sm alert-info">
                        Es wurden keine Patienten gefunden, die die Suchkriterien erfüllen.
                    </div>
                </template>
            </template>
        </QueryPatientMatchList>
    </div>
</template>
