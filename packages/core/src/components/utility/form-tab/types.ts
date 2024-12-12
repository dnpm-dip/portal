/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type FormTab<T = Record<string, any>> = {
    data: T | null,
    label: string,
    index: number
};

export type FormTabInput<T = Record<string, any>> = Partial<FormTab<T>>;
