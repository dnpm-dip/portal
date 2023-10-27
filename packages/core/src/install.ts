import type { App } from 'vue';
import { provideAPIClient } from './core';
import type { InstallOptions } from './types';

export function install(app: App, options: InstallOptions = {}) : void {
    if (options.apiClient) {
        provideAPIClient(options.apiClient, app);
    }
}
