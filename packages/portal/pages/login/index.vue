<script lang="ts">
import { CLIENT_WEB_NAME, REALM_MASTER_NAME } from '@authup/core-kit';
import {
    buildAuthorizeURL,
    createPKCE,
    createState,
    injectHTTPClient,
    saveAuthorizationRequest,
} from '@authup/client-web-kit';
import { PageMetaKey, useToast } from '@dnpm-dip/core';
import { VCButton } from '@vuecs/button';
import { VCIcon } from '@vuecs/icon';
import { ref } from 'vue';
import {
    defineNuxtComponent,
    useRoute,
    useRuntimeConfig,
} from '#app';
import { definePageMeta } from '#imports';
import LogoSvg from '../../components/svg/LogoSvg.vue';

export default defineNuxtComponent({
    components: {
        LogoSvg,
        VCButton,
        VCIcon,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_OUT]: true,
            layout: 'auth',
        });

        const route = useRoute();
        const toast = useToast();
        const runtimeConfig = useRuntimeConfig();
        const apiClient = injectHTTPClient();

        // Configurable per deployment (AUTHUP_CLIENT_ID); defaults to the
        // Authup built-in "web" client. The client must register
        // `<portal-origin>/login/callback` as a redirect URI.
        const clientId = (runtimeConfig.public.authupClientId as string) || CLIENT_WEB_NAME;

        // A name-identified client (e.g. the built-in "web") is only resolvable
        // with a realm hint — every realm ships its own "web" client, so Authup
        // rejects the authorize request ("A realm is required to resolve a client
        // by name.") without one. `realm_id` accepts a realm UUID or name; dnpm-dip
        // runs a single (master) realm, so we default to REALM_MASTER_NAME and
        // allow an override per deployment (AUTHUP_REALM_ID).
        const realmId = (runtimeConfig.public.authupRealmId as string) || REALM_MASTER_NAME;

        const busy = ref(false);

        // There is no realm picker: Authup's `/authorize` page hosts the credential
        // form and the configured identity providers; the portal only starts the flow.
        const startLogin = async () => {
            busy.value = true;
            try {
                const pkce = await createPKCE();
                const state = createState();
                const redirectUri = `${window.location.origin}/login/callback`;

                // Preserve the post-login destination AND any sibling query
                // params on the login URL (e.g. /login?redirect=/mtb&x=1 → /mtb?x=1).
                const { redirect, ...rest } = route.query;
                let target: string | undefined;
                if (typeof redirect === 'string') {
                    const url = new URL(redirect, window.location.origin);
                    for (const [key, value] of Object.entries(rest)) {
                        if (Array.isArray(value)) {
                            for (const entry of value) {
                                if (entry != null) {
                                    url.searchParams.append(key, entry);
                                }
                            }
                        } else if (value != null) {
                            url.searchParams.set(key, value);
                        }
                    }
                    target = `${url.pathname}${url.search}${url.hash}`;
                }

                saveAuthorizationRequest({
                    state,
                    code_verifier: pkce.code_verifier,
                    redirect_uri: redirectUri,
                    client_id: clientId,
                    realm_id: realmId,
                    target,
                });

                window.location.href = buildAuthorizeURL({
                    baseURL: apiClient.getBaseURL() as string,
                    clientId,
                    realmId,
                    redirectUri,
                    scope: 'global openid',
                    state,
                    codeChallenge: pkce.code_challenge,
                    codeChallengeMethod: pkce.code_challenge_method,
                });
            } catch (e) {
                // The redirect never fired — let the user try again.
                busy.value = false;
                if (toast) {
                    toast.show({
                        variant: 'warning',
                        body: e instanceof Error ? e.message : 'Die Anmeldung konnte nicht gestartet werden.',
                    });
                }
            }
        };

        return {
            busy,
            startLogin,
        };
    },
});
</script>
<template>
    <div class="login-entry">
        <div class="login-card">
            <LogoSvg :height="60" />
            <div class="login-heading">
                <h1 class="login-title">
                    DNPM:DIP
                </h1>
                <p class="login-subtitle">
                    Melden Sie sich an, um fortzufahren
                </p>
            </div>
            <VCButton
                color="primary"
                size="lg"
                class="login-action"
                :loading="busy"
                :disabled="busy"
                @click="startLogin"
            >
                <VCIcon
                    name="fa6-solid:arrow-right-to-bracket"
                    class="me-2"
                />
                Anmelden
            </VCButton>
        </div>
    </div>
</template>
<style scoped>
.login-entry {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
}

.login-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2.75rem 2rem;
    text-align: center;
    /* Glass panel so the content stays legible over the animated backdrop. */
    border-radius: var(--vc-radius-lg, 14px);
    border: 1px solid var(--vc-color-border, rgba(140, 170, 220, 0.25));
    background: color-mix(in srgb, var(--vc-color-bg-elevated, #11182b) 72%, transparent);
    backdrop-filter: blur(12px);
    box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.45);
}

.login-heading {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.login-title {
    margin: 0;
    font-weight: 800;
    font-size: 1.9rem;
    letter-spacing: 0.3px;
}

.login-subtitle {
    margin: 0;
    color: var(--vc-color-fg-muted, #9aa6bd);
    font-size: 0.95rem;
}

.login-action {
    min-width: 12rem;
}
</style>
