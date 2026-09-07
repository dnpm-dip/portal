import type { ResourceCollectionResponse } from '../types';

export type PreparedQueryCreate<T = any> = {
    name?: string,
    criteria: T
};

export type PreparedQueryUpdate<T = any> = PreparedQueryCreate<T>;

export type PreparedQuery<T = any> = {
    id: string,
    name: string,
    criteria: T
};

export interface IPreparedQueryAPI {
    create(data: PreparedQueryCreate) : Promise<PreparedQuery>;
    getOne(id: string) : Promise<PreparedQuery>;
    getMany() : Promise<ResourceCollectionResponse<PreparedQuery>>;
    update(id: string, data: PreparedQueryUpdate) : Promise<PreparedQuery>;
    delete(id: string) : Promise<PreparedQuery>;
}
