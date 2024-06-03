import type { ModuleMeta } from '@dnpm-dip/core';
import { defineStore } from 'pinia';

const useModuleStore = defineStore(
    'modules',
    () => {
        const items = ref<ModuleMeta[]>([]);

        const register = (item: ModuleMeta) => {
            const index = items.value.findIndex((el) => el.name === item.name);
            if (index === -1) {
                items.value.push(item);
            }
        };

        return {
            items,
            register,
        };
    },
);

export {
    useModuleStore,
};
