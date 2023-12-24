import type { RDQueryCriteria } from '../query';

export type RDPreparedQueryCreate = {
    name?: string,
    criteria: RDQueryCriteria
};

export type RDPreparedQueryUpdate = RDPreparedQueryCreate;

export type RDPreparedQuery = {
    id: string,
    name: string,
    criteria: RDQueryCriteria
};
