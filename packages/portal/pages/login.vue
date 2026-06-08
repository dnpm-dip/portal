<script lang="ts">
import { PageMetaKey, PageNavigationTopID, useToast } from '@dnpm-dip/core';
import { isClientError } from 'hapic';
import type { BuildInput } from 'rapiq';
import {
    AIdentityProviderIcon,
    AIdentityProviders,
    APagination,
    injectHTTPClient,
    injectStore,
} from '@authup/client-web-kit';
import { type IdentityProvider, IdentityProviderProtocol } from '@authup/core-kit';
import { IFieldValidation } from '@ilingo/validup-vue';
import { useValidup } from '@validup/vue';
import { createValidator } from '@validup/zod';
import { Container } from 'validup';
import { z } from 'zod';
import {
    computed,
    toRef,
    watch,
} from 'vue';
import {
    definePageMeta,
    reactive,
    ref,
} from '#imports';
import {
    defineNuxtComponent, 
    navigateTo, 
    useRoute,
} from '#app';

class LoginCredentialsValidator extends Container<{
    name: string;
    password: string;
    realm_id: string;
}> {
    protected override initialize() {
        super.initialize();
        this.mount('name', createValidator(z.string().min(3).max(255)));
        this.mount('password', createValidator(z.string().min(3).max(255)));
        this.mount('realm_id', { optional: true }, createValidator(z.string()));
    }
}

export default defineNuxtComponent({
    components: {
        APagination,
        AIdentityProviders,
        AIdentityProviderIcon,
        IFieldValidation,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_OUT]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const store = injectStore();

        const apiClient = injectHTTPClient();
        const toast = useToast();

        const form = reactive({
            name: '',
            password: '',
            realm_id: '',
        });

        const v = useValidup(new LoginCredentialsValidator(), form);

        const busy = ref(false);

        const realmId = toRef(form, 'realm_id');

        const identityProviderQuery = computed<BuildInput<IdentityProvider>>(() => ({
            filters: {
                realm_id: realmId.value || '',
                protocol: `!${IdentityProviderProtocol.LDAP}`,
                enabled: true,
            },
        }));
        const identityProviderList = ref<null | { load: () => unknown }>(null);

        watch(realmId, async (val, oldVal) => {
            if (val !== oldVal) {
                if (identityProviderList.value) {
                    identityProviderList.value.load();
                }
            }
        });

        const submit = async () => {
            try {
                await store.login({
                    name: form.name,
                    password: form.password,
                    realmId: form.realm_id,
                });

                const route = useRoute();
                const { redirect, ...query } = route.query;

                navigateTo({
                    path: (redirect || '/') as string,
                    query,
                });
            } catch (e) {
                if (e instanceof Error && isClientError(e) && toast) {
                    toast.show({ variant: 'warning', body: e.message });
                }
            }
        };

        Promise.resolve()
            .then(store.logout);

        const buildIdentityProviderURL = (id: string) => apiClient.identityProvider.getAuthorizeUri(id);

        return {
            v,
            form,
            submit,
            busy,

            identityProviderQuery,
            identityProviderList,
            buildIdentityProviderURL,
        };
    },
});
</script>
<template>
    <div class="container">
        <h4>
            <VCIcon
                name="fa6-solid:arrow-right-to-bracket"
                class="pe-2"
            />
            Login
        </h4>
        <form @submit.prevent="submit">
            <div class="row">
                <div class="col-8">
                    <IFieldValidation
                        v-slot="{ value }"
                        :field="v.fields.name"
                    >
                        <VCFormGroup :validation="value">
                            <template #label>
                                Name
                            </template>
                            <VCFormInput v-model="v.fields.name.$model.value" />
                        </VCFormGroup>
                    </IFieldValidation>

                    <IFieldValidation
                        v-slot="{ value }"
                        :field="v.fields.password"
                    >
                        <VCFormGroup :validation="value">
                            <template #label>
                                Password
                            </template>
                            <VCFormInput
                                v-model="v.fields.password.$model.value"
                                type="password"
                            />
                        </VCFormGroup>
                    </IFieldValidation>

                    <VCButton
                        type="submit"
                        color="primary"
                        label="Login"
                        :loading="busy"
                        :disabled="busy || v.$invalid.value"
                    />

                    <hr>

                    <AIdentityProviders
                        ref="identityProviderList"
                        :query="identityProviderQuery"
                        :footer="false"
                    >
                        <template #footer="props">
                            <APagination
                                :busy="props.busy"
                                :meta="props.meta"
                                :load="props.load"
                                :total="props.total"
                            />
                        </template>
                        <template #body="props">
                            <div class="flex flex-row">
                                <div
                                    v-for="(item, key) in props.data"
                                    :key="key"
                                >
                                    <a
                                        :href="buildIdentityProviderURL(item.id)"
                                        class="btn btn-dark btn-xs p-2 me-1 identity-provider-box bg-fg"
                                    >
                                        <div class="flex flex-col">
                                            <div class="text-center mb-1">
                                                <AIdentityProviderIcon
                                                    class="text-2xl"
                                                    :entity="item"
                                                />
                                            </div>
                                            <div>
                                                {{ item.name }}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </template>
                    </AIdentityProviders>
                </div>
            </div>
        </form>
    </div>
</template>
<style scoped>
.identity-provider-box {
    min-width: 150px;
}
</style>
