<script lang="ts">
import { BTable } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import QueryPatientList from '../../../../components/QueryPatientList';
import type { RDQuerySession } from '../../../../domains/query';

export default defineNuxtComponent({
    components: {
        BTable,
        QueryPatientList,
    },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
    async setup() {
        const fields = [
            {
                key: 'id', label: 'ID', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'gender', label: 'Gender', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'vitalStatus', label: 'Status', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'age', label: 'Age', thClass: 'text-left', tdClass: 'text-left',
            },
            { key: 'options', label: '', tdClass: 'text-left' },
        ];

        return {
            fields,
        };
    },
});
</script>
<template>
    <div>
        <h6>Patients</h6>
        <QueryPatientList :query-id="entity.id">
            <template #default="props">
                <BTable
                    :items="props.data"
                    :fields="fields"
                    :busy="props.busy"
                    head-variant="'dark'"
                    outlined
                    class="table-striped"
                >
                    <template #cell(gender)="data">
                        {{ data.item.gender.display }}
                    </template>
                    <template #cell(vitalStatus)="data">
                        {{ data.item.vitalStatus.display }}
                    </template>
                    <template #cell(age)="data">
                        {{ data.item.age.value }}
                    </template>
                    <template #cell(options)="data">
                        <NuxtLink
                            :to="'/rd/query/'+ entity.id + '/patients/' +data.item.id"
                            class="btn btn-xs btn-outline-primary me-1"
                        >
                            <i class="fa-solid fa-bars" />
                        </NuxtLink>
                    </template>
                </BTable>
            </template>
            <template #error="{ error}">
                {{ error }}
            </template>
        </QueryPatientList>
    </div>
</template>
