import type { PropType } from 'vue';
import { defineComponent, h } from 'vue';
import { VCAlert } from '@vuecs/elements';

export default defineComponent({
    props: {
        error: {
            type: Object as PropType<Error>,
            required: true,
        },
    },
    setup(props) {
        return () => h(VCAlert, {
            color: 'error',
            variant: 'soft',
            size: 'sm',
        }, () => props.error.message);
    },
});
