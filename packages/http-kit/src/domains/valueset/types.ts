import type { ResourceCollectionResponse } from '../types';

export type ValueSetCoding = {
    code: string,
    display: string,
    system: string,
    version: string
};

export type ValueSet = {
    name: string,
    title: string,
    uri: string,
    date: string,
    codings?: ValueSetCoding[]
};

export interface IValueSetAPI {
    getMany() : Promise<ResourceCollectionResponse<ValueSet>>;
    getOne(id: string, version?: string, filter?: string[]) : Promise<ValueSet>;
}
