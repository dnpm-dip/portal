import type { Coding } from '@dnpm-dip/http-kit';

export type KMSurvivalRate = {
    censored: boolean,
    confInterval: {
        min: number,
        max: number
    },
    survRate: number,
    time: number
};
export type KMDataItem = {
    key: string,
    value: {
        medianSurvivalTime: number,
        survivalRates: KMSurvivalRate[]
    }
};
export type KMSurvivalReport = {
    data: KMDataItem[],
    grouping: Coding,
    survivalType: Coding,
    timeUnit?: string
};
