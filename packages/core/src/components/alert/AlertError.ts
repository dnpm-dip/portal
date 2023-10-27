import type { PropType } from 'vue';
import { defineComponent, h } from 'vue';

export default defineComponent({
    name: 'AlertError',
    props: {
        error: {
            type: Object as PropType<Error>,
            required: true,
        },
    },
    setup(props) {
        return () => h('div', { class: 'alert alert-sm alert-danger' }, [
            props.error.message,
        ]);
    },
});
