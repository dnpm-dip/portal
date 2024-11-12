import { isObject } from '../../utils';
import type { Coding } from './types';

export function isCoding(input: unknown) : input is Coding {
    return isObject(input) &&
        typeof input.code === 'string';
}

export function toCoding(input: number | string | Coding) : Coding {
    if (!isCoding(input)) {
        return {
            code: input,
        };
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
    input: Record<string, Coding | Coding[] | boolean | string>,
): Record<string, any> {
    const output : Record<string, any> = {};

    const keys = Object.keys(input);
    for (let i = 0; i < keys.length; i++) {
        const value = input[keys[i]];
        if (Array.isArray(value)) {
            output[keys[i]] = value
                .filter((v) => isCoding(v))
                .map((v) => v.code);
            continue;
        }

        if (isCoding(value)) {
            output[keys[i]] = value.code;
            continue;
        }

        output[keys[i]] = value;
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
    const keys = Object.keys(input);
    for (let i = 0; i < keys.length; i++) {
        const value = input[keys[i]];

        if (Array.isArray(value)) {
            output[keys[i]] = value.map((v) => ({
                code: isFormSelectOption(v) ? v.id : v,
            } satisfies Coding));
            continue;
        }

        if (isCoding(value)) {
            output[keys[i]] = {
                code: value.code,
            } satisfies Coding;
            continue;
        }

        if (isFormSelectOption(value)) {
            output[keys[i]] = {
                code: `${value.id}`,
            } satisfies Coding;
            continue;
        }

        if (
            typeof value === 'string' &&
            value.length > 0
        ) {
            output[keys[i]] = {
                code: value,
            } satisfies Coding;
            continue;
        }

        if (typeof value === 'boolean') {
            output[keys[i]] = value;
        }
    }
    return output;
}

export function serializeCoding(coding: Coding) {
    const parts: string[] = [];
    parts.push(coding.code);
    if (coding.system) {
        parts.push(coding.system);

        if (coding.version) {
            parts.push(coding.version);
        }
    }

    return parts.join('|');
}
