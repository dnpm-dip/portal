import type { CodeRecord, QueryBase } from '@dnpm-dip/core';
import type { QueryRequestMode } from './constants';

export type RDVariantCriteria = 'gene' |
'cDNAChange' |
'gDNAChange' |
'proteinChange' |
'acmgClass' |
'acmgCriteria' |
'zygosity' |
'segregationAnalysis' |
'modeOfInheritance' |
'significance';

export type RDQueryCriteria = {
    diagnoses?: CodeRecord[],
    hpoTerms?: CodeRecord[],
    variants?: {
        [K in RDVariantCriteria]?: CodeRecord[]
    }[]
};

export type RDQuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}`>,
    criteria: RDQueryCriteria
};

export type RDQuerySession = QueryBase<RDQueryCriteria>;

export type RDQuerySummary = {
    id: string,
    numPatients: number
};
