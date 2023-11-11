export type ListLoadMeta<
    FILTERS extends Record<string, any> = Record<string, any>,
> = {
    limit?: number,
    offset?: number,
    total?: number,
    filters?: FILTERS,
};
