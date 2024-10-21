import type { App } from 'vue';
import { installHTTPClient } from './core';
import { createQueryEventBus, provideQueryEventBus } from './services';
import { installQueryFilterStore, installQuerySessionStore } from './stores';
import type { InstallOptions } from './types';

export function install(app: App, options: InstallOptions) : void {
    installHTTPClient(app, {
        baseURL: options.baseURL,
    });

    const queryEventBus = createQueryEventBus();
    provideQueryEventBus(queryEventBus, app);

    installQueryFilterStore(app, {
        queryEventBus,
    });
    installQuerySessionStore(app, {
        queryEventBus,
    });
}
