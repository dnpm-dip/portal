import { isCoding, isMinMaxRange } from '../../../domains';

type ChartLabelsGenerateOptions = {
    codingVerbose?: boolean
    codingCodeOnly?: boolean
};

type RecordWithKeyAttribute = {
    [key: string]: any,
    key: unknown
};

export function generateChartLabelsForKeyValueRecord(
    item: RecordWithKeyAttribute,
    options: ChartLabelsGenerateOptions = {},
) : string | undefined {
    if (typeof item.key === 'string') {
        return item.key;
    }

    if (isCoding(item.key)) {
        if (options.codingCodeOnly) {
            return item.key.code;
        }

        if (item.key.display) {
            if (options.codingVerbose) {
                return `${item.key.code}: ${item.key.display}`;
            }

            return item.key.display;
        }

        return item.key.code;
    }

    if (isMinMaxRange(item.key)) {
        return `${item.key.min}-${item.key.max}`;
    }

    if (Array.isArray(item.key)) {
        return item.key
            .map((el) => generateChartLabelsForKeyValueRecord({ key: el }, options))
            .join(', ');
    }

    return undefined;
}
