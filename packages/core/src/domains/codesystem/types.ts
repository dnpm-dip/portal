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
