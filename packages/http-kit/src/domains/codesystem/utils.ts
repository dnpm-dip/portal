import type { CodeSystemConcept } from './types';

type FormSelectOption = {
    value: string | number,
    label: any
};

export function transformConceptToFormSelectOption(
    input: CodeSystemConcept,
) : FormSelectOption {
    /*

    let label : any;
    if (typeof input.properties.name !== 'undefined') {
        label = `${input.display}: ${input.properties.name}`;
    } else {
        label = `${input.code}: ${input.display}`;
    }
     */

    return {
        value: input.code,
        label: input.display,
    };
}
