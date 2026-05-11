import { isObject } from '../../utils';
import type { Coding } from './types';

export function isCoding(input: unknown) : input is Coding {
    return isObject(input) &&
        (typeof input.code === 'string' || typeof input.code === 'number');
}

export function toCoding(input: number | string | Coding) : Coding {
    if (!isCoding(input)) {
        return { code: input };
    }

    return input;
}

type FormSelectOption = {
    id: string | number,
    value: any
};

export function transformCodingsToFormSelectOptions(
    input: Coding[],
): FormSelectOption[] {
    const output : FormSelectOption[] = [];

    for (const item of input) {
        output.push({
            id: item.code,
            value: item.display || item.code,
        });
    }

    return output;
}

export function transformFormSelectOptionsToCodings(
    input: FormSelectOption[],
): Coding[] {
    const output : Coding[] = [];

    for (const item of input) {
        output.push({ code: `${item.id}` });
    }

    return output;
}

export function extractCodeFromCodingsRecord(
    input: Record<string, Coding | Coding[] | boolean | string>,
): Record<string, any> {
    const output : Record<string, any> = {};

    for (const key of Object.keys(input)) {
        const value = input[key];
        if (Array.isArray(value)) {
            output[key] = value
                .filter((v) => isCoding(v))
                .map((v) => v.code);
            continue;
        }

        if (isCoding(value)) {
            output[key] = value.code;
            continue;
        }

        output[key] = value;
    }

    return output;
}

// todo: implement this in form-controls package
function isFormSelectOption(input: unknown) : input is FormSelectOption {
    return isObject(input) &&
        typeof input.id !== 'undefined' &&
        typeof input.value !== 'undefined';
}

export function buildCodingsRecord(input: Record<string, any>) : Record<string, any> {
    const output : Record<string, any> = {};
    for (const key of Object.keys(input)) {
        const value = input[key];

        if (Array.isArray(value)) {
            output[key] = value.map((v) => ({ code: isFormSelectOption(v) ? v.id : v } satisfies Coding));
            continue;
        }

        if (isCoding(value)) {
            output[key] = { code: value.code } satisfies Coding;
            continue;
        }

        if (isFormSelectOption(value)) {
            output[key] = { code: `${value.id}` } satisfies Coding;
            continue;
        }

        if (
            typeof value === 'string' &&
            value.length > 0
        ) {
            output[key] = { code: value } satisfies Coding;
            continue;
        }

        if (typeof value === 'boolean') {
            output[key] = value;
        }
    }
    return output;
}

export function serializeCoding(coding: Coding) {
    const parts: string[] = [];
    parts.push(`${coding.code}`);
    if (coding.system) {
        parts.push(coding.system);

        if (coding.version) {
            parts.push(coding.version);
        }
    }

    return parts.join('|');
}
