import { describe, expect, it } from 'vitest';
import { LogicalOperator } from '@dnpm-dip/http-kit';
import { DLogicalOperatorSwitch } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const UNION = '∪';
const INTERSECTION = '∩';

describe('DLogicalOperatorSwitch', () => {
    it('should default to the or operator', () => {
        const { wrapper } = mountComponent(DLogicalOperatorSwitch, {}, {});

        expect(wrapper.text()).toContain(UNION);
    });

    it('should adopt the initial modelValue', () => {
        const { wrapper } = mountComponent(DLogicalOperatorSwitch, { modelValue: LogicalOperator.AND }, {});

        expect(wrapper.text()).toContain(INTERSECTION);
    });

    it('should flip or to and and back on toggle', async () => {
        const { wrapper } = mountComponent(DLogicalOperatorSwitch, {}, {});

        await wrapper.find('button').trigger('click');

        expect(wrapper.text()).toContain(INTERSECTION);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([LogicalOperator.AND]);

        await wrapper.find('button').trigger('click');

        expect(wrapper.text()).toContain(UNION);
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([LogicalOperator.OR]);
    });

    it('should flip and to or when it started as and', async () => {
        const { wrapper } = mountComponent(DLogicalOperatorSwitch, { modelValue: LogicalOperator.AND }, {});

        await wrapper.find('button').trigger('click');

        expect(wrapper.text()).toContain(UNION);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([LogicalOperator.OR]);
    });
});
