/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ObjectLiteral, PatientMatchBase, ResourceCollectionSlots } from '@dnpm-dip/core';
import { createResourceCollectionManager } from '@dnpm-dip/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { injectHTTPClient } from '../../../core/http-client';

export default defineComponent({
    props: {
        filters: {
            type: Object as PropType<ObjectLiteral>,
        },
    },
    slots: Object as SlotsType<ResourceCollectionSlots<PatientMatchBase>>,
    setup(props, setup) {
        const api = injectHTTPClient();

        const filters = toRef(props, 'filters');

        const manager = createResourceCollectionManager({
            load: async () => {
                const response = await api.validation.getValidationReport();

                return {
                    data: response.entries,
                    total: response.size,
                };
            },
            slots: setup.slots,
            expose: setup.expose,
            filters,
        });

        return () => manager.render();
    },
});
