import type { QueryCNVCriteria, QueryFusionCriteria, QuerySNVCriteria } from '../query';
import type { FormMutationType } from './constants';

export type MutationSNVDefinition = {
    type: FormMutationType.SNV,
    data: QuerySNVCriteria<string>
};
export type MutationCNVDefinition = {
    type: FormMutationType.CNV,
    data: QueryCNVCriteria<string>
};
export type MutationDNAFusionDefinition = {
    type: FormMutationType.DNA_FUSION,
    data: QueryFusionCriteria<string>
};
export type MutationRNAFusionDefinition = {
    type: FormMutationType.RNA_FUSION,
    data: QueryFusionCriteria<string>
};

export type MutationDefinition = MutationSNVDefinition | MutationCNVDefinition |
MutationDNAFusionDefinition | MutationRNAFusionDefinition;
