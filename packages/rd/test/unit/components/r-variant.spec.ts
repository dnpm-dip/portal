import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import RVariant from '../../../src/runtime/components/core/RVariant.vue';
import type { Variant } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

const patient : Variant['patient'] = {
    id: 'p-1',
    gender: { code: 'male' },
    birthDate: '1980-01-01',
};

function createVariant(extra: Partial<Variant> = {}) : Variant {
    return {
        id: 'v-1',
        patient,
        genes: [{ code: 'BRCA1', display: 'BRCA1' }],
        ...extra,
    };
}

function mountVariant(entity: Variant) {
    const mounted = mountModuleComponent(RVariant, { entity });

    return {
        ...mounted,
        text: mounted.wrapper.text().replace(/\s+/g, ' '),
    };
}

describe('RVariant', () => {
    it('should render every gene display as a comma separated list', () => {
        const { text } = mountVariant(createVariant({
            genes: [
                { code: 'BRCA1', display: 'BRCA1' },
                { code: 'TP53', display: 'TP53' },
            ],
        }));

        expect(text).toContain('Gene BRCA1, TP53');
    });

    it('should render the hgvs change codes rather than their display', () => {
        const { text } = mountVariant(createVariant({
            cDNAChange: { code: 'c.5266dupC', display: 'cDNA' },
            gDNAChange: { code: 'g.41276045dupG', display: 'gDNA' },
            proteinChange: { code: 'p.Gln1756Profs', display: 'protein' },
        }));

        expect(text).toContain('c.5266dupC');
        expect(text).toContain('g.41276045dupG');
        expect(text).toContain('p.Gln1756Profs');
        expect(text).not.toContain('cDNA');
    });

    it('should render the coded classification fields by display', () => {
        const { text } = mountVariant(createVariant({
            acmgClass: { code: '5', display: 'Pathogenic' },
            zygosity: { code: 'hom', display: 'Homozygous' },
            segregationAnalysis: { code: 'de-novo', display: 'De novo' },
            modeOfInheritance: { code: 'AD', display: 'Autosomal dominant' },
            significance: { code: 'primary', display: 'Primary' },
        }));

        expect(text).toContain('ACMG-Klasse Pathogenic');
        expect(text).toContain('Zygosity Homozygous');
        expect(text).toContain('Segregationsanalyse De novo');
        expect(text).toContain('Vererbungsmodus Autosomal dominant');
        expect(text).toContain('Signifikanz Primary');
    });

    it('should render every acmg criterion as a comma separated list', () => {
        const { text } = mountVariant(createVariant({
            acmgCriteria: [
                { code: 'PVS1', display: 'PVS1' },
                { code: 'PS2', display: 'PS2' },
            ],
        }));

        expect(text).toContain('ACMG-Kriterium PVS1, PS2');
    });

    it('should render every clinvar accession number', () => {
        const { text } = mountVariant(createVariant({ clinVarID: ['VCV000017661', 'VCV000017662'] }));

        expect(text).toContain('ClinVar Zugangsnummer VCV000017661, VCV000017662');
    });

    it('should prefer the external id of a publication over its type', () => {
        const { text } = mountVariant(createVariant({
            publications: [
                { id: 'pub-1', extId: { value: '12345678', system: 'https://pubmed.ncbi.nlm.nih.gov/' } },
                { id: 'pub-2', type: 'Publication' },
            ],
        }));

        expect(text).toContain('Publikationen 12345678, Publication');
    });

    it('should omit every optional section that is not given', () => {
        const { text } = mountVariant(createVariant());

        expect(text).toContain('Gene BRCA1');
        expect(text).not.toContain('ACMG-Klasse');
        expect(text).not.toContain('Zygosity');
        expect(text).not.toContain('Publikationen');
        expect(text).not.toContain('ClinVar');
    });

    it('should pass the entity into the default slot', () => {
        const { wrapper } = mountModuleComponent({ render: () => h(RVariant, { entity: createVariant() }, { default: ({ entity }: { entity: Variant }) => h('span', `slot:${entity.id}`) }) });

        expect(wrapper.text()).toContain('slot:v-1');
    });

    it('should re-render when the variant changes', async () => {
        const { wrapper } = mountModuleComponent(RVariant, { entity: createVariant() });

        await wrapper.setProps({ entity: createVariant({ genes: [{ code: 'TP53', display: 'TP53' }] }) });

        expect(wrapper.text().replace(/\s+/g, ' ')).toContain('Gene TP53');
    });
});
