/*
 * Copyright (c) 2025.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Coding } from './coding';

export type ExternalId = {
    value: string,
    system?: string
};

export type History<T = any> = {
    history: T[]
};

export type Reference = {
    id: string,
};

export type InternalReference = Reference & {
    display?: string,
    href?: string,
};

export type ExternalReference = {
    system: string,
    display?: string,
    href?: string,
};

export type GeneAlterationReference = {
    variant: Reference,
    gene?: Coding,
    display?: string
};

export type Period = {
    start: string,
    end?: string
};
