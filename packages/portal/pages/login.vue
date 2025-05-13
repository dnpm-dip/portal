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
import { IVuelidate } from '@ilingo/vuelidate';
import useVuelidate from '@vuelidate/core';
import { maxLength, minLength, required } from '@vuelidate/validators';
import {
    computed, toRef, watch,
} from 'vue';
import {
    definePageMeta,
    reactive,
    ref,
} from '#imports';
import {
    defineNuxtComponent, navigateTo, useRoute, useRuntimeConfig,
} from '#app';

export default defineNuxtComponent({
    components: {
        APagination,
        AIdentityProviders,
        AIdentityProviderIcon,
        IVuelidate,
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

        const vuelidate = useVuelidate({
            name: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(255),
            },
            password: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(255),
            },
            realm_id: {

            },
        }, form);

        const runtimeConfig = useRuntimeConfig();

        const busy = ref(false);

        const realmId = toRef(form, 'realm_id');

        const identityProviderQuery = computed<BuildInput<IdentityProvider>>(() => ({
            filters: {
                realm_id: realmId.value || '',
                protocol: `!${IdentityProviderProtocol.LDAP}`,
                enabled: true,
            },
        }));
        const identityProviderList = ref<null | { load:() => any, [key: string]: any}>(null);

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
            } catch (e: any) {
                if (isClientError(e) && toast) {
                    toast.show({ variant: 'warning', body: e.message });
                }
            }
        };

        Promise.resolve()
            .then(store.logout);

        const buildIdentityProviderURL = (id: string) => apiClient.identityProvider.getAuthorizeUri(
            runtimeConfig.public.authupUrl,
            id,
        );

        return {
            vuelidate,
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
            <i class="fa-solid fa-arrow-right-to-bracket pe-2" />
            Login
        </h4>
        <form @submit.prevent="submit">
            <div class="row">
                <div class="col-8">
                    <IVuelidate :validation="vuelidate.name">
                        <template #default="props">
                            <VCFormGroup
                                :validation-messages="props.data"
                                :validation-severity="props.severity"
                            >
                                <template #label>
                                    Name
                                </template>
                                <template #default>
                                    <VCFormInput
                                        v-model="vuelidate.name.$model"
                                    />
                                </template>
                            </VCFormGroup>
                        </template>
                    </IVuelidate>

                    <IVuelidate :validation="vuelidate.password">
                        <template #default="props">
                            <VCFormGroup
                                :validation-messages="props.data"
                                :validation-severity="props.severity"
                            >
                                <template #label>
                                    Password
                                </template>
                                <template #default>
                                    <VCFormInput
                                        v-model="vuelidate.password.$model"
                                        type="password"
                                    />
                                </template>
                            </VCFormGroup>
                        </template>
                    </IVuelidate>

                    <VCFormSubmit
                        v-model="busy"
                        :invalid="vuelidate.$invalid"
                        :create-text="'Login'"
                        :create-button-class="{value: 'btn btn-sm btn-dark btn-block', presets: { bootstrap: false }}"
                        :create-icon-class="'fa-solid fa-right-to-bracket'"
                        :submit="submit"
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
                            <div class="d-flex flex-row">
                                <div
                                    v-for="(item, key) in props.data"
                                    :key="key"
                                >
                                    <a
                                        :href="buildIdentityProviderURL(item.id)"
                                        class="btn btn-dark btn-xs p-2 me-1 identity-provider-box bg-dark"
                                    >
                                        <div class="d-flex flex-column">
                                            <div class="text-center mb-1">
                                                <AIdentityProviderIcon
                                                    class="fa-2x"
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
