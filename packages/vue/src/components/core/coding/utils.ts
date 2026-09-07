import type { FormOption } from '@vuecs/forms';
import type { Coding } from '@dnpm-dip/http-kit';

export function transformCodingsToFormSelectOptions(
    input: Coding[],
): FormOption[] {
    const output : FormOption[] = [];

    for (const item of input) {
        output.push({
            value: item.code,
            label: item.display || item.code,
        });
    }

    return output;
}
