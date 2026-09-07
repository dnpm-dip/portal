import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { DFact } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const Host = defineComponent({
    setup() {
        return () => h(
            DFact,
            {
                label: 'Diagnose',
                icon: 'fa6-solid:stethoscope',
            },
            { default: () => h('span', 'C50.9') },
        );
    },
});

describe('DFact', () => {
    it('should render the label', () => {
        const { wrapper } = mountComponent(DFact, { label: 'Diagnose' }, {});

        expect(wrapper.text()).toContain('Diagnose');
    });

    it('should render the value slot below the label', () => {
        const { wrapper } = mountComponent(Host, {}, {});

        const spans = wrapper.findAll('span');

        expect(wrapper.text()).toContain('C50.9');
        expect(spans[0]?.text()).toContain('Diagnose');
        expect(spans.at(-1)?.text()).toBe('C50.9');
    });

    it('should render no icon when none is provided', () => {
        const { wrapper } = mountComponent(DFact, { label: 'Diagnose' }, {});

        expect(wrapper.findComponent({ name: 'VCIcon' }).exists()).toBe(false);
    });

    it('should render the icon it is given', () => {
        const { wrapper } = mountComponent(DFact, { label: 'Diagnose', icon: 'fa6-solid:stethoscope' }, {});

        const icon = wrapper.findComponent({ name: 'VCIcon' });

        expect(icon.exists()).toBe(true);
        expect(icon.attributes('name')).toBe('fa6-solid:stethoscope');
    });
});
