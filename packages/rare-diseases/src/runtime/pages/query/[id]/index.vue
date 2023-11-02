<script lang="ts">
import { Nav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import QueryPatientList from '../../../components/QueryPatientList';
import type { RDQuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        QueryPatientList,
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
        <div class="d-flex flex-row">
            <h4>
                <NuxtLink
                    class="btn btn-xs btn-dark me-1"
                    :to="'/rd/search'"
                >
                    <i class="fa fa-arrow-left" />
                </NuxtLink>
                Query <small class="text-muted">{{ entity.id }}</small>
            </h4>
        </div>

        <div class="mb-2">
            <div>
                Die Anfrage wurde <strong>{{ entity.mode.display.toLowerCase() }}</strong> ausgeführt und umfasst
                Patienten mit folgenden Eigenschaften
            </div>
            <div>
                <strong>Alter:</strong> {{ entity.filters.patientFilter.ageRange.min }} - {{ entity.filters.patientFilter.ageRange.max }}
            </div>
            <div>
                <strong>Geschlecht:</strong>
                <template
                    v-for="(item, index) in entity.filters.patientFilter.genders"
                    :key="item.code"
                >
                    {{ index > 0 ? ', ' : '' }} {{ item.display }}
                </template>
            </div>
            <div>
                <strong>Vital Status:</strong>
                <template
                    v-for="(item, index) in entity.filters.patientFilter.vitalStatus"
                    :key="item.code"
                >
                    {{ index > 0 ? ', ' : '' }} {{ item.display }}
                </template>
            </div>
        </div>

        <hr>

        <h6>Patienten</h6>
        <QueryPatientList :query-id="entity.id">
            <template #default="props">
                <div class="list">
                    <ul class="list-body list-unstyled">
                        <template
                            v-for="(item, index) in props.data"
                            :key="item.id"
                        >
                            <li class="list-item flex-row">
                                <div class="list-card">
                                    <div class="d-flex flex-row">
                                        <div>
                                            <strong># {{ index + 1 }}</strong>

                                            {{ item.gender.display }}, {{ item.age.value }} Jahre
                                            (<template v-if="item.vitalStatus.code === 'alive'">
                                                <span class="text-success">{{ item.vitalStatus.display }}</span>
                                            </template>
                                            <template v-else-if="item.vitalStatus.code === 'deceased'">
                                                <span class="text-danger">{{ item.vitalStatus.display }}</span>
                                            </template>
                                            <template v-else>
                                                {{ item.vitalStatus.display }}
                                            </template>)
                                        </div>
                                        <div class="ms-auto">
                                            <button class="btn btn-dark btn-xs">
                                                <i class="fa fa-chevron-down" />
                                            </button>

                                            <NuxtLink
                                                :to="'/rd/query/'+ entity.id + '/patients/' +item.id"
                                                class="btn btn-xs btn-outline-primary ms-1"
                                            >
                                                <i class="fa-solid fa-bars" />
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </template>
        </QueryPatientList>
    </div>
</template>
