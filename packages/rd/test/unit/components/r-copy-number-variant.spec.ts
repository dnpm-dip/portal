import { describe, expect, it } from 'vitest';
import RCopyNumberVariant from '../../../src/runtime/components/core/RCopyNumberVariant.vue';
import type { CopyNumberVariant } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

function createCopyNumberVariant(extra: Partial<CopyNumberVariant> = {}) : CopyNumberVariant {
    return {
        id: 'v-1',
        patient: {
            id: 'p-1',
            gender: { code: 'male' },
            birthDate: '1980-01-01',
        },
        genes: [{ code: 'BRCA1', display: 'BRCA1' }],
        chromosome: { code: 'chr17', display: 'Chromosome 17' },
        startPosition: 41276044,
        endPosition: 41277500,
        ...extra,
    };
}

function mountCopyNumberVariant(entity: CopyNumberVariant = createCopyNumberVariant()) {
    const mounted = mountModuleComponent(RCopyNumberVariant, { entity });

    return {
        ...mounted,
        labels: mounted.wrapper.findAll('strong').map((el) => el.text()),
        values: mounted.wrapper.findAll('small').map((el) => el.text()),
    };
}

describe('RCopyNumberVariant', () => {
    it('should render the inherited variant fields', () => {
        const { wrapper, labels } = mountCopyNumberVariant();

        expect(labels[0]).toBe('Gene');
        expect(wrapper.text()).toContain('BRCA1');
    });

    it('should render both positions in their own labelled sections', () => {
        const { labels, values } = mountCopyNumberVariant();

        expect(labels).toEqual(['Gene', 'Chromosme', 'Start Position', 'End Position']);
        expect(values).toEqual(['Chromosome 17', '41276044', '41277500']);
    });

    it('should fall back to the chromosome code without a display', () => {
        const { values } = mountCopyNumberVariant(createCopyNumberVariant({ chromosome: { code: 'chr17' } }));

        expect(values[0]).toBe('chr17');
    });

    it('should prefer the copy number type display over its code', () => {
        const { labels, values } = mountCopyNumberVariant(createCopyNumberVariant({ type: { code: 'high-level-gain', display: 'High Level Gain' } }));

        expect(labels).toContain('Typ');
        expect(values.at(-1)).toBe('High Level Gain');
    });

    it('should fall back to the copy number type code without a display', () => {
        const { values } = mountCopyNumberVariant(createCopyNumberVariant({ type: { code: 'loss' } }));

        expect(values.at(-1)).toBe('loss');
    });

    it('should omit the type section when no type is given', () => {
        const { labels } = mountCopyNumberVariant();

        expect(labels).not.toContain('Typ');
    });
});
