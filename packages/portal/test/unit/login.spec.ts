// @vitest-environment happy-dom
import { loadAuthorizationRequest } from '@authup/client-web-kit';
import type * as Authup from '@authup/client-web-kit';
import type * as PortalVue from '@dnpm-dip/vue';
import { flushPromises, mount } from '@vue/test-utils';
import {
    beforeEach,
    expect,
    it,
    vi,
} from 'vitest';
import Login from '../../pages/login/index.vue';

const { query } = vi.hoisted(() => ({ query: {} as Record<string, string | (string | null)[]> }));

vi.mock('nuxt/app', async () => ({
    defineNuxtComponent: (await import('vue')).defineComponent,
    definePageMeta: () => {},
    useRoute: () => ({ query }),
    useRuntimeConfig: () => ({ public: {} }),
}));

vi.mock('@authup/client-web-kit', async (importOriginal) => ({
    ...await importOriginal<typeof Authup>(),
    injectHTTPClient: () => ({ getBaseURL: () => 'https://idp.example/auth/' }),
    createPKCE: async () => ({
        code_verifier: 'verifier',
        code_challenge: 'challenge',
        code_challenge_method: 'S256',
    }),
    createState: () => 'state',
}));

vi.mock('@dnpm-dip/vue', async (importOriginal) => ({
    ...await importOriginal<typeof PortalVue>(),
    useToast: () => undefined,
}));

beforeEach(() => {
    window.location.href = 'https://portal.example/login';
    sessionStorage.clear();
    for (const key of Object.keys(query)) {
        delete query[key];
    }
});

it.each([
    [{}, null],
    [{ redirect: '/mtb?existing=1#results', site: ['a', null, 'b'] }, '/mtb?existing=1&site=a&site=b#results'],
    [{ redirect: 'https://external.example/rd' }, '/rd'],
])('carries a local post-login destination in the saved and sent callback URI (%j)', async (input, destination) => {
    Object.assign(query, input);
    const wrapper = mount(Login, {
        global: {
            stubs: {
                LogoSvg: true,
                VCIcon: true,
                VCButton: { template: '<button><slot /></button>' },
            },
        },
    });
    await wrapper.get('button').trigger('click');
    await flushPromises();

    const request = loadAuthorizationRequest();
    expect(request).toMatchObject({
        state: 'state',
        code_verifier: 'verifier',
        client_id: 'admin-console',
    });
    const callback = new URL(request!.redirect_uri);
    expect(callback.origin).toBe('https://portal.example');
    expect(callback.pathname).toBe('/login/callback');
    expect(callback.searchParams.get('redirect')).toBe(destination);
    expect(new URL(window.location.href).searchParams.get('redirect_uri')).toBe(request!.redirect_uri);
    expect(request).not.toHaveProperty('target');
    wrapper.unmount();
});
