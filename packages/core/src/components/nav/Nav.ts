import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { buildNav } from './utils';
import type { NavItems } from './types';

export default defineComponent({
    props: {
        path: {
            type: String,
            required: true,
        },
        items: {
            type: Array as PropType<NavItems>,
            required: true,
        },
        direction: {
            type: String as PropType<'vertical' | 'horizontal'>,
        },
        prevLink: {
            type: Object as PropType<string | boolean>,
        },
    },
    setup(props) {
        const items = toRef(props, 'items');
        const direction = toRef(props, 'direction');
        return () => buildNav(props.path, items.value, {
            direction: direction.value,
            prevLink: props.prevLink,
        });
    },
});
