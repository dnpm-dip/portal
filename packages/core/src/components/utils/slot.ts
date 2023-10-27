import type { Slot, Slots, VNode } from 'vue';
import { hasOwnProperty } from '../../utils';

export function hasNormalizedSlot(
    name : string,
    $slots : Slots = {},
) {
    return hasOwnProperty($slots, name);
}

export function normalizeSlot(
    name : string,
    scope: Record<string, any> = {},
    $slots : Slots = {},
) : VNode[] | VNode {
    if (hasOwnProperty($slots, name)) {
        return ($slots[name] as Slot)(scope);
    }

    return [];
}
