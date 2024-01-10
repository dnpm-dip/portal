import type { CodeSystemConcept } from './types';

type FormSelectOption = {
    id: string | number,
    value: any
};

export function transformConceptToFormSelectOption(
    input: CodeSystemConcept,
) : FormSelectOption {
    let value : any;
    if (typeof input.properties.name !== 'undefined') {
        value = `${input.display}: ${input.properties.name}`;
    } else {
        value = `${input.code}: ${input.display}`;
    }
    return {
        id: input.code,
        value,
    };
}
