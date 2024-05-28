/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { type PropType, computed, defineComponent } from 'vue';
import type { Coding } from '../../../domains';

export default defineComponent({
    props: {
        entity: {
            required: true,
            type: Object as PropType<Coding>,
        },
    },
    async setup(props) {
        const display = computed(() => {
            if (props.entity.display) {
                return `${props.entity.code}: ${props.entity.display}`;
            }

            return props.entity.code;
        });

        return () => [
            display.value,
        ];
    },
});
