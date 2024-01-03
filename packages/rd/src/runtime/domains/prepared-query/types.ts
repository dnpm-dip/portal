import type { QueryCriteria } from '../query';

export type PreparedQueryCreate = {
    name?: string,
    criteria: QueryCriteria
};

export type PreparedQueryUpdate = PreparedQueryCreate;

export type PreparedQuery = {
    id: string,
    name: string,
    criteria: QueryCriteria
};
