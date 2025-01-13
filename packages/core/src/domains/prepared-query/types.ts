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
