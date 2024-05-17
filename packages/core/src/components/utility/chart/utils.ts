import type { ConceptCount, KeyValueRecord } from '../../../domains';
import { isCoding, isMinMaxRange } from '../../../domains';
import { stringToColor } from '../../../utils';

type ChartLabelsGenerateOptions = {
    codingVerbose?: boolean
};

export function generateChartLabelsForKeyValueRecord(
    item: KeyValueRecord | ConceptCount,
    options: ChartLabelsGenerateOptions = {},
) : string | undefined {
    if (isCoding(item.key)) {
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
        return `${item.key.join(', ')}`;
    }

    if (typeof item.key === 'string') {
        return item.key;
    }

    return undefined;
}

export function generateChartBackgroundColorForKeyValueRecord(
    item: KeyValueRecord | ConceptCount,
) : string | undefined {
    if (isCoding(item.key)) {
        return `${stringToColor(item.key.display || item.key.code)}`;
    }

    if (isMinMaxRange(item.key)) {
        return `${stringToColor(`${(item.key.min + item.key.max) * 10}`)}`;
    }

    if (Array.isArray(item.key)) {
        return `${stringToColor(item.key.join('+'))}`;
    }

    if (typeof item.key === 'string') {
        return stringToColor(item.key);
    }

    return undefined;
}
