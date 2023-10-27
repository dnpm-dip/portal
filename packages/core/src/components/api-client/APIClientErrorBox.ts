import type { ClientError } from 'hapic';
import type { PropType, VNodeChild } from 'vue';
import { defineComponent, h } from 'vue';
import type { APIClientErrorIssueSeverity } from '../../core';
import { isAPIClientErrorPayload } from '../../core';

export default defineComponent({
    props: {
        error: {
            type: Object as PropType<ClientError>,
        },
    },
    setup(props) {
        const data = props.error?.response?.data;

        const toAlertClass = (severity: APIClientErrorIssueSeverity) => {
            switch (severity) {
                case 'warning': {
                    return 'alert-warning';
                }
                default: {
                    return 'alert-danger';
                }
            }
        };

        const alerts : VNodeChild[] = [];

        if (isAPIClientErrorPayload(data)) {
            for (let i = 0; i < data.issues.length; i++) {
                alerts.push(h('div', {
                    class: [
                        'alert alert-sm alert-warning mb-2',
                        toAlertClass(data.issues[i].severity),
                    ],
                }, [
                    data.issues[i].details,
                ]));
            }
        } else {
            alerts.push(h('div', { class: 'alert alert-sm alert-warning' }, [
                'An unprocessable error occurred.',
            ]));
        }

        return () => h('div', [
            alerts,
        ]);
    },
});
