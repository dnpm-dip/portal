import type { RegistrationContext } from '@dnpm-dip/kit';
import { defineStore } from 'pinia';

const useModuleStore = defineStore(
    'modules',
    () => {
        const items = ref<RegistrationContext[]>([]);

        const register = (item: RegistrationContext) => {
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
