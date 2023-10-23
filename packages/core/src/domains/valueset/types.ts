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
