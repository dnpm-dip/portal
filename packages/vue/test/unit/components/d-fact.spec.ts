import { describe, expect, it } from 'vitest';
import DFact from '../../../src/components/utility/DFact.vue';
import { mountComponent } from '../../../src/testing';

describe('DFact', () => {
    it('should render the label', () => {
        const { wrapper } = mountComponent(DFact, { label: 'Diagnose' }, {});

        expect(wrapper.text()).toContain('Diagnose');
    });

    it('should render the icon only when one is provided', () => {
        const withoutIcon = mountComponent(DFact, { label: 'Diagnose' }, {});
        expect(withoutIcon.wrapper.findComponent({ name: 'VCIcon' }).exists()).toBe(false);

        const withIcon = mountComponent(DFact, { label: 'Diagnose', icon: 'fa6-solid:stethoscope' }, {});
        expect(withIcon.wrapper.findComponent({ name: 'VCIcon' }).exists()).toBe(true);
    });
});
