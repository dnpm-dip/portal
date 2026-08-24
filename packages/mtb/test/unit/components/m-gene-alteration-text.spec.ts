import { describe, expect, it } from 'vitest';
import type { QueryGeneAlteration } from '../../../src/runtime/domains';
import MGeneAlterationText from '../../../src/runtime/components/core/MGeneAlterationText.vue';
import { mountModuleComponent } from '../../utils';

function mountWith(entity: QueryGeneAlteration) {
    return mountModuleComponent(MGeneAlterationText, { entity });
}

describe('MGeneAlterationText', () => {
    it('should render the protein change of a SNV', () => {
        const { wrapper } = mountWith({
            gene: { code: 'BRAF', display: 'BRAF' },
            type: 'SNV',
            proteinChange: 'V600E',
        });

        expect(wrapper.text()).toBe('BRAF V600E');
    });

    it('should fall back to the mutation type of a SNV without protein change', () => {
        const { wrapper } = mountWith({
            gene: { code: 'BRAF' },
            type: 'SNV',
        });

        expect(wrapper.text()).toBe('BRAF SNV');
    });

    it('should render the copy number type of a CNV', () => {
        const { wrapper } = mountWith({
            gene: { code: 'ERBB2', display: 'ERBB2' },
            type: 'CNV',
            copyNumberType: { code: 'high-level-gain', display: 'High Level Gain' },
        });

        expect(wrapper.text()).toBe('ERBB2 High Level Gain');
    });

    it('should render a plain string copy number type of a CNV', () => {
        const { wrapper } = mountWith({
            gene: { code: 'ERBB2' },
            type: 'CNV',
            copyNumberType: 'loss',
        });

        expect(wrapper.text()).toBe('ERBB2 loss');
    });

    it('should render both partners of a fusion', () => {
        const { wrapper } = mountWith({
            gene: { code: 'EML4' },
            type: 'Fusion',
            partner: { code: 'ALK', display: 'ALK' },
        });

        expect(wrapper.text()).toBe('EML4-ALK Fusion');
    });

    it('should render a placeholder for an unknown alteration type', () => {
        const { wrapper } = mountWith({ gene: { code: 'BRAF' }, type: 'INDEL' } as unknown as QueryGeneAlteration);

        expect(wrapper.text()).toBe('???');
    });

    it('should re-render when the alteration changes', async () => {
        const { wrapper } = mountWith({
            gene: { code: 'BRAF' },
            type: 'SNV',
            proteinChange: 'V600E',
        });

        await wrapper.setProps({
            entity: {
                gene: { code: 'KRAS' },
                type: 'SNV',
                proteinChange: 'G12C',
            },
        });

        expect(wrapper.text()).toBe('KRAS G12C');
    });
});
