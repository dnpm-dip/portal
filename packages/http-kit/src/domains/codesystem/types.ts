import type { ResourceCollectionResponse, ResourceRecordResponse } from '../types';

export type CodeSystemConcept = {
    code: string,
    display: string,
    properties: Record<string, any>
};

export type CodeSystem = {
    name: string,
    title: string,
    uri: string,
    properties?: unknown[],
    concepts?: CodeSystemConcept[]
};

export interface ICodeSystemAPI {
    getMany() : Promise<ResourceCollectionResponse<CodeSystem>>;
    getOne(id: string, filter?: string[]) : Promise<ResourceRecordResponse<CodeSystem>>;
}
