<!--
  - Copyright (c) 2025.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import {
    defineComponent, ref, toRef, watch,
} from 'vue';

export default defineComponent({
    props: {
        loading: {
            type: Boolean,
            required: true,
        },
    },
    setup(props) {
        const showLoader = ref(false);
        const loadingProp = toRef(props, 'loading');

        const btnClasses = ref([]);

        watch(loadingProp, (val, oldVal) => {
            if (val !== oldVal) {
                showLoader.value = val;
            }
        });

        return {
            btnClasses,
            showLoader,
        };
    },
});
</script>
<template>
    <button
        type="button"
        :class="['loading-button', showLoader ? 'active' : '']"
    >
        <span v-show="showLoader">
            <span class="spinner">
                <slot name="spinner">
                    <i class="fa fa-refresh fa-spin" />
                </slot>
            </span>
        </span>
        <span v-show="!showLoader">
            <span class="text">
                <slot name="default">
                    Submit
                </slot>
            </span>
        </span>
    </button>
</template>
<style scoped>
.loading-button {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    overflow: hidden;
}

.loading-button:before {
    position: absolute;
    content: "";
    bottom: 0;
    right: 0;
    width: 0%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
}

.loading-button .spinner i {
    transform-origin: center center;
}
.loading-button .spinner {
    top: 100%;
    transform: translateY(0%);
}

.loading-button.active:before {
    animation-duration: 1.5s;
    animation-name: loaderScaleWidth;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

.loading-button.active .spinner {
    top: 50%;
    transform: translateY(-50%);
}

@keyframes loaderScaleWidth {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}
</style>
