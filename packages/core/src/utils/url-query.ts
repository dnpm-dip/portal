import { isObject } from './is-object';

export type URlQueryRecordScalarValue = string | string[] | number | number[];
export type URLQueryRecord = Record<
string,
URlQueryRecordScalarValue | Record<string, URlQueryRecordScalarValue>
>;

function extendQueryParts(
    parts: string[],
    key: string,
    value: URlQueryRecordScalarValue,
) {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            parts.push(`${key}=${value[i]}`);
        }
    } else {
        parts.push(`${key}=${value}`);
    }
}

export function serializeURLQueryRecord(record: URLQueryRecord) : string {
    const parts : string[] = [];

    const keys = Object.keys(record);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = record[key];

        if (isObject(value)) {
            const childKeys = Object.keys(value);
            for (let j = 0; j < childKeys.length; j++) {
                const childKey = childKeys[j];
                const childValue = (value as Record<string, URlQueryRecordScalarValue>)[childKey];

                extendQueryParts(parts, `${key}[${childKeys[j]}]`, childValue);
            }
        } else {
            extendQueryParts(parts, key, value);
        }
    }

    return parts.join('&');
}
