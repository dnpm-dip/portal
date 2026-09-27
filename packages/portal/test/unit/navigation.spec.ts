import { StoreAuthStatus, createStore, createStoreDispatcher } from '@authup/client-web-kit';
import { createFakeClient } from '@authup/core-http-kit/testing';
import { createPinia, defineStore } from 'pinia';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { Navigation } from '../../core/navigation/module';

describe('navigation authorization', () => {
    it('restores nested entries when the same session gains permission', async () => {
        const store = defineStore('authup', () => createStore({
            dispatcher: createStoreDispatcher(),
            httpClient: createFakeClient({
                handlers: {
                    'POST /token': () => ({
                        access_token: 'token',
                        token_type: 'Bearer',
                        expires_in: 3600,
                    }),
                    'POST /token/introspect': () => ({
                        active: true,
                        sub: 'user',
                        sub_kind: 'user',
                        realm_id: 'realm',
                        realm_name: 'master',
                    }),
                },
            }),
        }))(createPinia());
        await store.login({ name: 'admin', password: 'test' });
        vi.spyOn(store, 'resolve').mockResolvedValue(undefined);
        expect(store.status).toBe(StoreAuthStatus.AUTHENTICATED);
        const evaluate = vi.spyOn(store.permissionEvaluator, 'preEvaluateOneOf')
            .mockRejectedValue(new Error('Denied'));
        const navigation = new Navigation(store);
        navigation.addSideElements('admin', [{
            name: 'Users',
            meta: { requireLoggedIn: true },
            children: [{ name: 'Add user', meta: { requirePermissions: ['user_create'] } }],
        }]);

        const denied = await navigation.getSideItems('admin');
        expect(denied[0]?.children).toEqual([]);

        evaluate.mockResolvedValue(undefined);
        store.permissionRevision += 1;
        const allowed = await navigation.getSideItems('admin');
        expect(allowed[0]?.children?.map((item) => item.name)).toEqual(['Add user']);
        expect(evaluate).toHaveBeenCalledWith(expect.objectContaining({ name: ['user_create'] }));
        expect(denied[0]?.children).toEqual([]);

        await store.logout({ revokeTokens: false });
        expect(await navigation.getSideItems('admin')).toEqual([]);
    });
});
