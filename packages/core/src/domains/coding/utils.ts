import { isObject } from '../../utils';
import type { Coding } from './types';

export function isCoding(input: unknown) : input is Coding {
    return isObject(input) &&
        typeof input.code === 'string';
}

type FormSelectOption = {
    id: string | number,
    value: any
};

export function transformCodingsToFormSelectOptions(
    input: Coding[],
): FormSelectOption[] {
    const output : FormSelectOption[] = [];

    for (let i = 0; i < input.length; i++) {
        output.push({
            id: input[i].code,
            value: input[i].display || input[i].code,
        });
    }

    return output;
}

export function transformFormSelectOptionsToCodings(
    input: FormSelectOption[],
): Coding[] {
    const output : Coding[] = [];

    for (let i = 0; i < input.length; i++) {
        output.push({
            code: `${input[i].id}`,
        });
    }

    return output;
}

export function extractCodeFromCodingsRecord(
    input: Record<string, Coding | Coding[]>,
): Record<string, any> {
    const output : Record<string, any> = {};

    const keys = Object.keys(input);
    for (let i = 0; i < keys.length; i++) {
        const value = input[keys[i]];
        if (Array.isArray(value)) {
            output[keys[i]] = value.map((v) => v.code);
        } else {
            output[keys[i]] = value.code;
        }
    }

    return output;
}

export function buildCodingsRecord(input: Record<string, any>) : Record<string, any> {
    const output : Record<string, any> = {};
    const keys = Object.keys(input);
    for (let i = 0; i < keys.length; i++) {
        const value = input[keys[i]];

        if (Array.isArray(value)) {
            output[keys[i]] = value.map((v) => ({
                code: v,
            } satisfies Coding));
        } else if (value.length > 0) {
            output[keys[i]] = {
                code: value,
            } satisfies Coding;
        }
    }
    return output;
}
