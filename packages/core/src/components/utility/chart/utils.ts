import type { ConceptCount, KeyValueChildrenRecord, KeyValueRecord } from '../../../domains';
import { isCoding, isMinMaxRange } from '../../../domains';

type ChartLabelsGenerateOptions = {
    codingVerbose?: boolean
    codingCodeOnly?: boolean
};

export function generateChartLabelsForKeyValueRecord(
    item: KeyValueRecord | KeyValueChildrenRecord | ConceptCount,
    options: ChartLabelsGenerateOptions = {},
) : string | undefined {
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
        return `${item.key.join(', ')}`;
    }

    if (typeof item.key === 'string') {
        return item.key;
    }

    return undefined;
}
