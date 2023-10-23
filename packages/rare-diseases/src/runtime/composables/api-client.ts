import type { APIClient } from '@dnpm-dip/core';
import { useNuxtApp } from '#app';
import type { RDAPIClient } from '../core/api-client';

export function useAPIClient() {
    return useNuxtApp().$api as APIClient;
}
export function useRDAPIClient() {
    return useNuxtApp().$rdApi as RDAPIClient;
}
