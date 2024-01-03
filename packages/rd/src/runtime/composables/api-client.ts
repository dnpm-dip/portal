import { useNuxtApp } from '#imports';
import type { RDAPIClient } from '../core/api-client';

export function useRDAPIClient() {
    return useNuxtApp().$rdApi as RDAPIClient;
}
