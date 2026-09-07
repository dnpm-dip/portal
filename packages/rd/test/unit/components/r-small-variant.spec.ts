import { describe, expect, it } from 'vitest';
import RSmallVariant from '../../../src/runtime/components/core/RSmallVariant.vue';
import type { SmallVariant } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

function createSmallVariant(extra: Partial<SmallVariant> = {}) : SmallVariant {
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
        endPosition: 41276046,
        ref: 'C',
        alt: 'CG',
        ...extra,
    };
}

function mountSmallVariant(entity: SmallVariant = createSmallVariant()) {
    const mounted = mountModuleComponent(RSmallVariant, { entity });

    return {
        ...mounted,
        labels: mounted.wrapper.findAll('strong').map((el) => el.text()),
        values: mounted.wrapper.findAll('small').map((el) => el.text()),
    };
}

describe('RSmallVariant', () => {
    it('should render the inherited variant fields', () => {
        const { wrapper, labels } = mountSmallVariant();

        expect(labels[0]).toBe('Gene');
        expect(wrapper.text()).toContain('BRCA1');
    });

    it('should label every small variant specific section', () => {
        const { labels } = mountSmallVariant();

        expect(labels).toEqual(['Gene', 'Chromosme', 'Position', 'Ref', 'Alt']);
    });

    it('should prefer the chromosome display over its code', () => {
        const { values } = mountSmallVariant();

        expect(values[0]).toBe('Chromosome 17');
    });

    it('should fall back to the chromosome code without a display', () => {
        const { values } = mountSmallVariant(createSmallVariant({ chromosome: { code: 'chr17' } }));

        expect(values[0]).toBe('chr17');
    });

    it('should render both positions and the ref/alt alleles', () => {
        const { values } = mountSmallVariant();

        expect(values).toEqual(['Chromosome 17', '41276044', '41276046', 'C', 'CG']);
    });

    it('should omit the position section when neither position is given', () => {
        const { labels } = mountSmallVariant(createSmallVariant({
            startPosition: undefined as unknown as number,
            endPosition: undefined as unknown as number,
        }));

        expect(labels).not.toContain('Position');
    });
});
