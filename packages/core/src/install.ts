import type { App } from 'vue';
import { installHTTPClient } from './core';
import type { InstallOptions } from './types';

export function install(app: App, options: InstallOptions) : void {
    installHTTPClient(app, {
        baseURL: options.baseURL,
    });
}
