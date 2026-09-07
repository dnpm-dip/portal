import { describe, expect, it } from 'vitest';
import type { Coding, DistributionConceptsCount } from '@dnpm-dip/http-kit';
import MTherapyResponseDistributionBar from '../../../src/runtime/components/core/MTherapyResponseDistributionBar.vue';
import { RecistColor } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

const distribution : DistributionConceptsCount<Coding<string> | string> = {
    total: 4,
    elements: [
        { key: { code: 'CR', display: 'Complete Response' }, value: { count: 3, percent: 74.6 } },
        { key: 'PD', value: { count: 1, percent: 25.4 } },
    ],
};

function mountBar(input: DistributionConceptsCount<Coding<string> | string> = distribution) {
    const mounted = mountModuleComponent(MTherapyResponseDistributionBar, { distribution: input });

    return {
        ...mounted,
        segments: mounted.wrapper.findAll('.distribution-bar > div'),
    };
}

describe('MTherapyResponseDistributionBar', () => {
    it('should render one segment per distribution element', () => {
        const { segments } = mountBar();

        expect(segments).toHaveLength(2);
    });

    it('should label a coding element with its display and a string element with itself', () => {
        const { segments } = mountBar();

        expect(segments[0]?.attributes('title')).toBe('Complete Response (3/4; 75%)');
        expect(segments[1]?.attributes('title')).toBe('PD (1/4; 25%)');
    });

    it('should render the code and the absolute count', () => {
        const { segments } = mountBar();

        expect(segments[0]?.text()).toBe('CR (3)');
        expect(segments[1]?.text()).toBe('PD (1)');
    });

    it('should size and color a segment by its recist code', () => {
        const { segments } = mountBar();

        expect(segments[0]?.attributes('style')).toContain('height: 93.25px');
        expect(segments[0]?.attributes('style')).toContain(RecistColor.CR);
        expect(segments[1]?.attributes('style')).toContain(RecistColor.PD);
    });

    it('should render nothing for an empty distribution', () => {
        const { segments } = mountBar({ total: 0, elements: [] });

        expect(segments).toHaveLength(0);
    });
});
