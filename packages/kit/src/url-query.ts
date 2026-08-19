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
        for (const item of value) {
            parts.push(`${key}=${item}`);
        }
    } else {
        parts.push(`${key}=${value}`);
    }
}

export function serializeURLQueryRecord(record: URLQueryRecord) : string {
    const parts : string[] = [];

    for (const [key, value] of Object.entries(record)) {
        if (isObject(value)) {
            const childRecord = value as Record<string, URlQueryRecordScalarValue>;
            for (const [childKey, childValue] of Object.entries(childRecord)) {
                if (childValue === undefined) {
                    continue;
                }

                extendQueryParts(parts, `${key}[${childKey}]`, childValue);
            }
        } else if (value !== undefined) {
            extendQueryParts(parts, key, value);
        }
    }

    return parts.join('&');
}
