import type { APIClient } from '@dnpm-dip/core';
import { useNuxtApp } from '#imports';
import type { MTBAPIClient } from '../core/api-client';

export function useAPIClient() {
    return useNuxtApp().$api as APIClient;
}
export function useMTBAPIClient() {
    return useNuxtApp().$mtbApi as MTBAPIClient;
}
