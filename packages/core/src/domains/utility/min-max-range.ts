import { isObject } from '../../utils';

export type MinMaxRange = {
    min: number,
    max: number
};

export function isMinMaxRange(input: unknown): input is MinMaxRange {
    return isObject(input) &&
        typeof input.min === 'number' &&
        typeof input.max === 'number';
}
