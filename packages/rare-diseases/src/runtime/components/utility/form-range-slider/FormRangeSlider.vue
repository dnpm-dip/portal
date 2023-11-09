<script lang="ts">
import {
    defineComponent, onMounted, onUnmounted, ref, toRef, watch,
} from 'vue';
import { debounce } from '@dnpm-dip/core';
import { FormRangeSlider } from './module';

export default defineComponent({
    props: {
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
    },
    emits: ['change'],
    setup(props, { emit }) {
        const el = ref<HTMLElement | null>(null);
        let instance : FormRangeSlider | undefined;

        const min = toRef(props, 'min');
        const max = toRef(props, 'max');

        watch(min, (value) => {
            if (instance) {
                instance.min = value;
            }
        });

        watch(max, (value) => {
            if (instance) {
                instance.max = value;
            }
        });

        onMounted(() => {
            instance = new FormRangeSlider({
                el: el.value as HTMLElement,
                min: props.min,
                max: props.max,
            });
            instance.mount();
        });

        onUnmounted(() => {
            if (instance) {
                instance.unmount();
            }
        });

        const handleChanged = () => {
            debounce(() => {
                if (!instance) return;

                emit('change', {
                    min: instance.min,
                    max: instance.max,
                });
            });
        };

        return {
            el,
            handleChanged,
        };
    },
});
</script>
<template>
    <div
        ref="el"
        class="bs-multi-range"
        @change="handleChanged"
    >
        <div class="track">
            <div class="thumb upper" />
            <div class="thumb lower" />
            <div class="track-diff" />
        </div>
    </div>
</template>
<style>
.bs-multi-range {
  width: 100%;
}

.bs-multi-range>.track {
  width: 100%;
  background: #f0f0f0;
  height: 8px;
  border-radius: 1rem;
}

.bs-multi-range .thumb {
  z-index: 1;
  height: 16px;
  width: 16px;

  background: #6d7fcc;

  border-radius: 100%;

  position: relative;

  cursor: pointer;
}

.bs-multi-range .upper {
  bottom: calc(16px / 4);
}

.bs-multi-range .lower {
  bottom: calc(calc(16px / 4) + 16px)
}

.bs-multi-range .track-diff {
  height: 8px;
  position: relative;
  left: 0;
  bottom: 32px;
  background: lightgray;
}
</style>
