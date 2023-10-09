export type Patient = {
    id: string,
    age: number,
    gender: {
        code: string,
        display: string,
        system: string,
    },
    vitalStatus: {
        code: string,
        display: string,
        system: string
    },
    matchingCriteria: unknown // todo: type must be defined
};

export type PatientRecord = {
    case: {
        externalId: {
            value: string
        },
        face2geneId: {
            system: string,
            value: string
        },
        gestaltMatcherId: {
            system: string,
            value: string,
        },
        id: string,
        patient: {
            id: string
        },
        reason: {
            id: string
        },
        recordedOn: string,
        referrer: {
            name: string
        }
    },
    diagnosis: unknown, // todo: grab type from doc
    hpoTerms: unknown, // todo: grab type from doc
    ngsReport: unknown, // todo: grab type from doc
    patient: unknown, // todo: other type than Patient?!
    therapy: {
        id: string,
        notes: string,
        patient: unknown // todo: same type than patient ?
    }
};
