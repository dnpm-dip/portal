<!--
  - Copyright (c) 2025.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { BModal } from 'bootstrap-vue-next';
import { defineComponent, toRef } from 'vue';

export default defineComponent({
    components: { BModal },
    props: {
        display: {
            type: Boolean,
            required: true,
        },
    },
    setup(props) {
        const modal = toRef(props, 'display');

        return {
            modal,
        };
    },
});
</script>
<template>
    <BModal
        v-model="modal"
        class="modal-loading"
        :no-header="true"
        :no-footer="true"
        :no-close-on-backdrop="true"
    >
        <template #default>
            <div class="modal-loading-wrapper">
                <div>
                    <div class="modal-loading-box" />
                    <div class="modal-loading-box" />
                    <div class="modal-loading-box" />
                    <div class="modal-loading-box" />
                    <div class="modal-loading-box" />
                </div>
            </div>
        </template>
    </BModal>
</template>
<style>
.modal-loading .modal-content,
.modal-loading .modal-body {
    background-color: transparent !important;
    border: none;
}

:root {
    --modal-loading-duration: 1.5s;
    --modal-loading-container-duration: 250px;
    --modal-loading-box-size: 33px;
    --modal-loading-box-border-radius: 15%;
}

.modal-loading-wrapper {
    height: 90vh;
    width: 100%;
    display: flex;
}

.modal-loading-wrapper > div {
    width: var(--modal-loading-container-duration);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.modal-loading-box {
    width: var(--modal-loading-box-size);
    height: var(--modal-loading-box-size);
    position: relative;
    display: block;
    transform-origin: -50% center;
    border-radius: var(--modal-loading-box-border-radius);
}
.modal-loading-box:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #6d7fcc;
    border-radius: var(--modal-loading-box-border-radius);
    /*
    box-shadow: 0px 0px 10px 0px rgba(28, 159, 255, 0.4);
     */
}
.modal-loading-box:nth-child(1) {
    animation: slide var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(1):after {
    animation: color-change var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(2) {
    animation: flip-1 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(2):after {
    animation: squidge-1 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(3) {
    animation: flip-2 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(3):after {
    animation: squidge-2 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(4) {
    animation: flip-3 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(4):after {
    animation: squidge-3 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(5) {
    animation: flip-4 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(5):after {
    animation: squidge-4 var(--modal-loading-duration) ease-in-out infinite alternate;
}
.modal-loading-box:nth-child(2):after {
    background-color: #6d7fcc;
}
.modal-loading-box:nth-child(3):after {
    background-color: #8192DD;
}
.modal-loading-box:nth-child(4):after {
    background-color: #94A6EE;
}
.modal-loading-box:nth-child(5):after {
    background-color: #A8B9FF;
}

@keyframes slide {
    0% {
        background-color: #6d7fcc;
        transform: translatex(0vw);
    }
    100% {
        background-color: #A8B9FF;
        transform: translatex(
            calc(var(--modal-loading-container-duration) - (var(--modal-loading-box-size) * 1.25))
        );
    }
}

@keyframes color-change {
    0% {
        background-color: #6d7fcc;
    }
    100% {
        background-color: #A8B9FF;
    }
}

@keyframes flip-1 {
    0%,
    15% {
        transform: rotate(0);
    }
    35%,
    100% {
        transform: rotate(-180deg);
    }
}

@keyframes squidge-1 {
    5% {
        transform-origin: center bottom;
        transform: scalex(1) scaley(1);
    }
    15% {
        transform-origin: center bottom;
        transform: scalex(1.3) scaley(0.7);
    }
    25%,
    20% {
        transform-origin: center bottom;
        transform: scalex(0.8) scaley(1.4);
    }
    55%,
    100% {
        transform-origin: center top;
        transform: scalex(1) scaley(1);
    }
    40% {
        transform-origin: center top;
        transform: scalex(1.3) scaley(0.7);
    }
}

@keyframes flip-2 {
    0%,
    30% {
        transform: rotate(0);
    }
    50%,
    100% {
        transform: rotate(-180deg);
    }
}

@keyframes squidge-2 {
    20% {
        transform-origin: center bottom;
        transform: scalex(1) scaley(1);
    }
    30% {
        transform-origin: center bottom;
        transform: scalex(1.3) scaley(0.7);
    }
    40%,
    35% {
        transform-origin: center bottom;
        transform: scalex(0.8) scaley(1.4);
    }
    70%,
    100% {
        transform-origin: center top;
        transform: scalex(1) scaley(1);
    }
    55% {
        transform-origin: center top;
        transform: scalex(1.3) scaley(0.7);
    }
}

@keyframes flip-3 {
    0%,
    45% {
        transform: rotate(0);
    }
    65%,
    100% {
        transform: rotate(-180deg);
    }
}

@keyframes squidge-3 {
    35% {
        transform-origin: center bottom;
        transform: scalex(1) scaley(1);
    }
    45% {
        transform-origin: center bottom;
        transform: scalex(1.3) scaley(0.7);
    }
    55%,
    50% {
        transform-origin: center bottom;
        transform: scalex(0.8) scaley(1.4);
    }
    85%,
    100% {
        transform-origin: center top;
        transform: scalex(1) scaley(1);
    }
    70% {
        transform-origin: center top;
        transform: scalex(1.3) scaley(0.7);
    }
}

@keyframes flip-4 {
    0%,
    60% {
        transform: rotate(0);
    }
    80%,
    100% {
        transform: rotate(-180deg);
    }
}

@keyframes squidge-4 {
    50% {
        transform-origin: center bottom;
        transform: scalex(1) scaley(1);
    }
    60% {
        transform-origin: center bottom;
        transform: scalex(1.3) scaley(0.7);
    }
    70%,
    65% {
        transform-origin: center bottom;
        transform: scalex(0.8) scaley(1.4);
    }
    100%,
    100% {
        transform-origin: center top;
        transform: scalex(1) scaley(1);
    }
    85% {
        transform-origin: center top;
        transform: scalex(1.3) scaley(0.7);
    }
}

</style>
