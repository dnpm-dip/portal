<script lang="ts">
import { PageMetaKey, PageNavigationTopID, useToast } from '@dnpm-dip/core';
import { isClientError } from 'hapic';
import {
    AIdentityProviderIcon,
    AIdentityProviders,
    APagination,
    ARealms,
    ASearch,
    ATitle,
    useStore,
} from '@authup/client-web-kit';
import { IVuelidate } from '@ilingo/vuelidate';
import useVuelidate from '@vuelidate/core';
import { maxLength, minLength, required } from '@vuelidate/validators';
import {
    definePageMeta,
    reactive,
    ref,
} from '#imports';
import {
    defineNuxtComponent, navigateTo, useRoute,
} from '#app';

export default defineNuxtComponent({
    components: {
        APagination,
        ASearch,
        ATitle,
        AIdentityProviders,
        AIdentityProviderIcon,
        ARealms,
        IVuelidate,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_OUT]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const store = useStore();
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

        const busy = ref(false);

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

        return {
            vuelidate,
            form,
            submit,
            busy,
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
        </form>
    </div>
</template>
