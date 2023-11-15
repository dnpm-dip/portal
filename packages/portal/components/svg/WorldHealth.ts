/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { defineComponent, h } from 'vue';
import Search from './WorldHealth.svg';

export default defineComponent({
    props: {
        width: {
            type: [Number, String],
            default: '100%',
        },
        height: {
            type: [Number, String],
        },
    },
    setup(props) {
        return () => h('img', {
            src: Search,
            width: props.width,
            height: props.height,
            style: {
                maxWidth: '100%',
                width: '100%',
            },
        });
    },
});
