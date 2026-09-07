import type { PropType } from 'vue';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { DCollectionTransform } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

// The slot output is prefixed with the length of what the slot actually
// received, so "renders nothing" (slot never invoked) cannot be mistaken for
// "was handed an empty collection".
const Host = defineComponent({
    props: {
        items: {
            type: Array as PropType<Record<string, unknown>[]>,
            required: true,
        },
        transform: { type: Function as PropType<(input: Record<string, unknown>) => unknown> },
    },
    setup(props) {
        return () => h(
            DCollectionTransform,
            { items: props.items, transform: props.transform },
            {
                default: (items: Record<string, unknown>[]) => h(
                    'span',
                    `${items.length}:${items.map((item) => item.label).join(' / ')}`,
                ),
            },
        );
    },
});

describe('DCollectionTransform', () => {
    it('should pass the items through untouched without a transform', () => {
        const { wrapper } = mountComponent(Host, { items: [{ label: 'A' }, { label: 'B' }] }, {});

        expect(wrapper.text()).toBe('2:A / B');
    });

    it('should apply the transform to every item', () => {
        const { wrapper } = mountComponent(Host, {
            items: [{ code: 'a' }, { code: 'b' }],
            transform: (input: Record<string, unknown>) => ({ label: String(input.code).toUpperCase() }),
        }, {});

        expect(wrapper.text()).toBe('2:A / B');
    });

    it('should hand an empty list to the slot for empty items', () => {
        const { wrapper } = mountComponent(Host, { items: [] }, {});

        expect(wrapper.text()).toBe('0:');
    });

    it('should re-run the transform when the items change', async () => {
        const { wrapper } = mountComponent(Host, {
            items: [{ code: 'a' }],
            transform: (input: Record<string, unknown>) => ({ label: String(input.code).toUpperCase() }),
        }, {});

        await wrapper.setProps({ items: [{ code: 'c' }, { code: 'd' }] });

        expect(wrapper.text()).toBe('2:C / D');
    });

    it('should render an empty placeholder when no default slot is given', () => {
        const { wrapper } = mountComponent(DCollectionTransform, { items: [{ label: 'A' }] }, {});

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.element.childNodes).toHaveLength(0);
    });
});
