import { VCAlert } from '@vuecs/elements';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import type { HTTPClientErrorIssue } from '@dnpm-dip/http-kit';
import { APIClientErrorIssueSeverity } from '@dnpm-dip/http-kit';
import { createFakeClient, fakeResponse } from '@dnpm-dip/http-kit/testing';
import type { ErrorCollectionSlotProps, ErrorSlotProps } from '../../../../src';
import { DAPIClientError } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const issues : HTTPClientErrorIssue[] = [
    { severity: APIClientErrorIssueSeverity.ERROR, details: 'Patient nicht gefunden' },
    { severity: APIClientErrorIssueSeverity.WARNING, details: 'Diagnose unvollständig' },
];

/**
 * Drives a non-2xx response through hapic's real error pipeline, so the
 * component under test sees an actual ClientError instead of a hand-rolled
 * lookalike that `isClientError` would reject.
 */
async function createClientError() : Promise<Error> {
    const client = createFakeClient({ handlers: { 'GET /mtb/sites': () => fakeResponse(422, { issues }) } });

    try {
        await client.site.getItems('mtb');
    } catch (e) {
        return e as Error;
    }

    throw new Error('expected the request to reject');
}

function mountWithSlots(error: Error, slots: Record<string, any>) {
    const Host = defineComponent({
        setup() {
            return () => h(DAPIClientError, { error }, slots);
        },
    });

    return mountComponent(Host, {}, {});
}

describe('DAPIClientError', () => {
    it('should render one alert per issue of a client error', async () => {
        const error = await createClientError();

        const { wrapper } = mountComponent(DAPIClientError, { error }, {});

        const alerts = wrapper.findAllComponents(VCAlert);

        expect(alerts).toHaveLength(2);
        expect(alerts[0]?.text()).toContain('Patient nicht gefunden');
        expect(alerts[1]?.text()).toContain('Diagnose unvollständig');
    });

    it('should map the issue severity to the alert color', async () => {
        const error = await createClientError();

        const { wrapper } = mountComponent(DAPIClientError, { error }, {});

        const alerts = wrapper.findAllComponents(VCAlert);

        expect(alerts[0]?.props('color')).toBe('error');
        expect(alerts[1]?.props('color')).toBe('warning');
    });

    it('should fall back to the error message when the error carries no issues', () => {
        const { wrapper } = mountComponent(DAPIClientError, { error: new Error('Verbindung fehlgeschlagen') }, {});

        const alerts = wrapper.findAllComponents(VCAlert);

        expect(alerts).toHaveLength(1);
        expect(alerts[0]?.text()).toContain('Verbindung fehlgeschlagen');
        expect(alerts[0]?.props('color')).toBe('error');
    });

    it('should hand the whole issue collection to the errors slot', async () => {
        const error = await createClientError();

        let received : ErrorCollectionSlotProps | undefined;

        const { wrapper } = mountWithSlots(error, {
            errors: (props: ErrorCollectionSlotProps) => {
                received = props;

                return h('span', `${props.data.length} Meldungen`);
            },
        });

        expect(received?.data).toEqual([
            { severity: APIClientErrorIssueSeverity.ERROR, message: 'Patient nicht gefunden' },
            { severity: APIClientErrorIssueSeverity.WARNING, message: 'Diagnose unvollständig' },
        ]);
        expect(wrapper.text()).toBe('2 Meldungen');
        expect(wrapper.findAllComponents(VCAlert)).toHaveLength(0);
    });

    it('should render the error slot once per issue when no errors slot is given', async () => {
        const error = await createClientError();

        const { wrapper } = mountWithSlots(error, { error: (props: ErrorSlotProps) => h('span', `${props.data.severity}/${props.data.message}`) });

        expect(wrapper.findAll('span').map((el) => el.text())).toEqual([
            'error/Patient nicht gefunden',
            'warning/Diagnose unvollständig',
        ]);
        expect(wrapper.findAllComponents(VCAlert)).toHaveLength(0);
    });
});
