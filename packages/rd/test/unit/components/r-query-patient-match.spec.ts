import type { VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RQueryPatientMatch from '../../../src/runtime/components/core/RQueryPatientMatch.vue';
import type { PatientMatch } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

function createPatientMatch(extra: Partial<PatientMatch> = {}) : PatientMatch {
    return {
        id: 'p-1',
        gender: { code: 'male', display: 'Männlich' },
        age: { value: 42, unit: 'Years' },
        vitalStatus: { code: 'alive', display: 'Lebend' },
        matchingCriteria: {
            diagnoses: [{ code: 'ORPHA:98896' }],
            hpoTerms: [{ code: 'HP:0001250' }],
        },
        ...extra,
    };
}

function mountPatientMatch(entity: PatientMatch = createPatientMatch(), index = 0) {
    return mountModuleComponent(RQueryPatientMatch, {
        entity, 
        queryId: 'q-1', 
        index, 
    });
}

function statusBadge(wrapper: VueWrapper<any>, display: string) {
    return wrapper.findAll('span.rounded-full').find((el) => el.text() === display);
}

describe('RQueryPatientMatch', () => {
    it('should number the match by its one-based position in the collection', () => {
        const { wrapper } = mountPatientMatch(createPatientMatch(), 2);

        expect(wrapper.find('span.size-9').text()).toBe('3');
    });

    it('should fall back to the patient id without a usable position', () => {
        const { wrapper } = mountPatientMatch(createPatientMatch(), NaN);

        expect(wrapper.find('span.size-9').text()).toBe('p-1');
    });

    it('should render the patient facts', () => {
        const { wrapper } = mountPatientMatch();

        expect(wrapper.text()).toContain('42');
        expect(wrapper.text()).toContain('Männlich');
        expect(wrapper.text()).toContain('Lebend');
    });

    it('should omit the site fact for a match without a managing site', () => {
        const { wrapper } = mountPatientMatch();

        expect(wrapper.text()).not.toContain('Standort');
    });

    it('should render the managing site of the match', () => {
        const { wrapper } = mountPatientMatch(createPatientMatch({ managingSite: { code: 'site-a', display: 'Standort A' } }));

        expect(wrapper.text()).toContain('Standort A');
    });

    it('should tint the vital status of a living patient in the success color', () => {
        const { wrapper } = mountPatientMatch();

        expect(statusBadge(wrapper, 'Lebend')?.classes()).toContain('text-success-600');
    });

    it('should tint the vital status of a deceased patient in the error color', () => {
        const { wrapper } = mountPatientMatch(createPatientMatch({ vitalStatus: { code: 'deceased', display: 'Verstorben' } }));

        expect(statusBadge(wrapper, 'Verstorben')?.classes()).toContain('text-error-600');
    });

    it('should expand the matching criteria by default', () => {
        const { wrapper } = mountPatientMatch();

        expect(wrapper.text()).toContain('ORPHA:98896');
        expect(wrapper.text()).toContain('HP:0001250');
        expect(wrapper.find('[aria-label="Kriterien ein-/ausklappen"]').attributes('aria-expanded')).toBe('true');
    });

    it('should collapse the matching criteria on toggle', async () => {
        const { wrapper } = mountPatientMatch();

        const toggle = wrapper.find('[aria-label="Kriterien ein-/ausklappen"]');
        await toggle.trigger('click');

        expect(wrapper.text()).not.toContain('ORPHA:98896');
        expect(toggle.attributes('aria-expanded')).toBe('false');
    });

    it('should render every variant criterion as a property/value pair', () => {
        const { wrapper } = mountPatientMatch(createPatientMatch({ matchingCriteria: { variants: [{ gene: { code: 'BRCA1' }, zygosity: { code: 'hom' } }] } }));

        const text = wrapper.text().replace(/\s+/g, ' ');

        expect(text).toContain('Varianten');
        expect(text).toContain('gene:');
        expect(text).toContain('zygosity:');
    });

    it('should link to the patient detail page of the query', () => {
        const { wrapper } = mountPatientMatch();

        expect(wrapper.find('[title="Patient öffnen"]').attributes('to')).toBe('/rd/query/q-1/patients/p-1');
    });
});
