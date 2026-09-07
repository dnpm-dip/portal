import { describe, expect, it } from 'vitest';
import { DTags } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

function buildItems() {
    return [
        { id: 1, value: 'Alpha' },
        { id: 2, value: 'Beta' },
    ];
}

describe('DTags', () => {
    it('should render one removable chip per item', () => {
        const { wrapper } = mountComponent(DTags, { items: buildItems() }, {});

        const buttons = wrapper.findAll('button');

        expect(buttons).toHaveLength(2);
        expect(buttons[0]?.text()).toContain('Alpha');
        expect(buttons[1]?.text()).toContain('Beta');
    });

    it('should drop a chip and emit the remaining tags on click', async () => {
        const { wrapper } = mountComponent(DTags, { items: buildItems() }, {});

        await wrapper.findAll('button')[0]?.trigger('click');

        expect(wrapper.findAll('button')).toHaveLength(1);
        expect(wrapper.text()).not.toContain('Alpha');

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toHaveLength(1);
        expect(emitted?.[0]?.[0]).toEqual([{ id: 2, value: 'Beta' }]);
    });

    it('should keep the chip but still emit when emitOnly is set', async () => {
        const { wrapper } = mountComponent(DTags, { items: buildItems(), emitOnly: true }, {});

        await wrapper.findAll('button')[0]?.trigger('click');

        expect(wrapper.findAll('button')).toHaveLength(2);
        expect(wrapper.emitted('deleted')?.[0]?.[0]).toEqual({ id: 1, value: 'Alpha' });
        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(buildItems());
    });

    it('should prefer items over modelValue', () => {
        const { wrapper } = mountComponent(DTags, {
            modelValue: [{ id: 9, value: 'FromModelValue' }],
            items: [{ id: 1, value: 'FromItems' }],
        }, {});

        expect(wrapper.text()).toContain('FromItems');
        expect(wrapper.text()).not.toContain('FromModelValue');
    });

    it('should re-render when the items prop changes', async () => {
        const { wrapper } = mountComponent(DTags, { items: buildItems() }, {});

        await wrapper.setProps({ items: [{ id: 3, value: 'Gamma' }] });

        expect(wrapper.findAll('button')).toHaveLength(1);
        expect(wrapper.text()).toContain('Gamma');
    });

    it('should apply the tag class to every chip', () => {
        const { wrapper } = mountComponent(DTags, { items: buildItems(), tagClass: 'bg-primary' }, {});

        expect(wrapper.findAll('button.bg-primary')).toHaveLength(2);
    });
});
