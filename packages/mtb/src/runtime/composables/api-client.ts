import { useNuxtApp } from '#imports';
import type { MTBAPIClient } from '../core/api-client';

export function useMTBAPIClient() {
    return useNuxtApp().$mtbApi as MTBAPIClient;
}
