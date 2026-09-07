import { describe, expect, it } from 'vitest';
import RStructuralVariant from '../../../src/runtime/components/core/RStructuralVariant.vue';
import type { StructuralVariant } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

function createStructuralVariant(extra: Partial<StructuralVariant> = {}) : StructuralVariant {
    return {
        id: 'v-1',
        patient: {
            id: 'p-1',
            gender: { code: 'male' },
            birthDate: '1980-01-01',
        },
        genes: [{ code: 'BRCA1', display: 'BRCA1' }],
        ...extra,
    };
}

function mountStructuralVariant(entity: StructuralVariant = createStructuralVariant()) {
    const mounted = mountModuleComponent(RStructuralVariant, { entity });

    return {
        ...mounted,
        labels: mounted.wrapper.findAll('strong').map((el) => el.text()),
        values: mounted.wrapper.findAll('small').map((el) => el.text()),
    };
}

describe('RStructuralVariant', () => {
    it('should render the inherited variant fields', () => {
        const { wrapper, labels } = mountStructuralVariant();

        expect(labels[0]).toBe('Gene');
        expect(wrapper.text()).toContain('BRCA1');
    });

    it('should prefer the iscn description display over its code', () => {
        const { labels, values } = mountStructuralVariant(createStructuralVariant({ iscnDescription: { code: '46,XX,t(9;22)', display: 'Translokation 9;22' } }));

        expect(labels).toContain('ISCN');
        expect(values).toEqual(['Translokation 9;22']);
    });

    it('should fall back to the iscn description code without a display', () => {
        const { values } = mountStructuralVariant(createStructuralVariant({ iscnDescription: { code: '46,XX,t(9;22)' } }));

        expect(values).toEqual(['46,XX,t(9;22)']);
    });

    it('should omit the iscn section when no description is given', () => {
        const { labels, values } = mountStructuralVariant();

        expect(labels).not.toContain('ISCN');
        expect(values).toHaveLength(0);
    });
});
