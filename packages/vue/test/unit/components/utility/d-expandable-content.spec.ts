import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { DExpandableContent } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const Host = defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        return () => h(
            DExpandableContent,
            { modelValue: props.modelValue },
            {
                header: () => h('span', 'Kopfzeile'),
                default: () => h('span', 'Inhalt'),
            },
        );
    },
});

describe('DExpandableContent', () => {
    it('should render the header but hide the content while collapsed', () => {
        const { wrapper } = mountComponent(Host, {}, {});

        expect(wrapper.text()).toContain('Kopfzeile');
        expect(wrapper.text()).not.toContain('Inhalt');
    });

    it('should start expanded when modelValue is true', () => {
        const { wrapper } = mountComponent(Host, { modelValue: true }, {});

        expect(wrapper.text()).toContain('Inhalt');
    });

    it('should reveal the content and emit on toggle', async () => {
        const { wrapper } = mountComponent(Host, {}, {});

        await wrapper.find('button').trigger('click');

        expect(wrapper.text()).toContain('Inhalt');
        expect(wrapper.findComponent(DExpandableContent).emitted('update:modelValue')?.[0]).toEqual([true]);

        await wrapper.find('button').trigger('click');

        expect(wrapper.text()).not.toContain('Inhalt');
        expect(wrapper.findComponent(DExpandableContent).emitted('update:modelValue')?.[1]).toEqual([false]);
    });

    it('should follow a modelValue change from the parent', async () => {
        const { wrapper } = mountComponent(Host, {}, {});

        await wrapper.setProps({ modelValue: true });

        expect(wrapper.text()).toContain('Inhalt');
    });

    it('should fall back to a default header', () => {
        const { wrapper } = mountComponent(DExpandableContent, {}, {});

        expect(wrapper.text()).toContain('Header');
    });
});
