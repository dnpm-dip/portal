<template>
    <div class="dropdown">
        <input
            v-model="q"
            class="dropdown-input"
            :disabled="disabled"
            :placeholder="placeholder"
            @focus="onFocus"
            @keyup="onKeyUp"
            @keydown="onKeyDown"
            @blur="onBlur"
        >

        <div
            v-show="isDisplayed"
            class="dropdown-content"
            @mouseleave="onMouseLeave"
        >
            <template
                v-for="(option, index) in items"
                :key="option.id"
            >
                <FormSelectSearchEntry
                    :entry="option"
                    :selected="selected"
                >
                    <template #default="{ entry, active }">
                        <div
                            class="dropdown-item"
                            :class="{
                                'active': active,
                                'current': index === currentIndex || (index === 0 && currentIndex === -1)
                            }"
                            @mousedown="toggleHide(entry)"
                        >
                            {{ entry.value }}
                        </div>
                    </template>
                </FormSelectSearchEntry>
            </template>
        </div>

        <div
            v-if="isMulti"
            class="dropdown-selected"
        >
            <slot
                name="selected"
                :items="selected"
                :toggle="toggle"
            >
                <template v-for="item in selected">
                    {{ item.value }}
                </template>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import FormSelectSearchEntry from './FormSelectSearchEntry.vue';

type Option = {
    id: string | number,
    value: string
};
export default defineComponent({
    components: { FormSelectSearchEntry },
    props: {
        modelValue: {
            type: [String, Array] as PropType<string | Option[]>,
            default: '',
        },
        options: {
            type: Array as PropType<Option[]>,
            required: true,
            default: () => [],
        },
        placeholder: {
            type: String,
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        maxItems: {
            type: Number,
            required: false,
            default: 6,
        },
    },
    emits: ['update:modelValue', 'changed'],
    async setup(props, { emit }) {
        const q = ref('');
        const currentIndex = ref(-1);

        const selected = ref<Option[]>([]);
        const isMulti = computed(() => typeof props.modelValue !== 'string');

        const items = computed(() => {
            const output = [];
            const pattern = new RegExp(q.value, 'ig');
            for (let i = 0; i < props.options.length; i++) {
                const option = props.options[i];

                if (q.value.length < 1 || option.value.match(pattern)) {
                    if (output.length < props.maxItems) {
                        output.push(option);
                    }
                }
            }

            return output;
        });
        const itemsLength = computed(() => items.value.length);

        watch(itemsLength, (val, oldValue) => {
            if (val !== oldValue) {
                currentIndex.value = -1;
            }
        });

        const isDisplayed = ref(false);

        const toggle = (option: Option) => {
            if (isMulti.value) {
                const index = selected.value.findIndex((el) => el.id === option.id);
                if (index === -1) {
                    selected.value.push(option);
                } else {
                    selected.value.splice(index, 1);
                }

                emit('update:modelValue', selected.value);
                return;
            }

            if (selected.value.length === 0 || selected.value[0].id !== option.id) {
                selected.value = [option];
                q.value = option.value;
            } else {
                selected.value.length = 0;
                q.value = '';
            }

            isDisplayed.value = false;

            emit('update:modelValue', option.id);
        };

        const display = () => {
            if (props.disabled) return;

            isDisplayed.value = true;
        };

        const hide = () => {
            if (
                !isMulti.value &&
                selected.value.length === 1
            ) {
                q.value = selected.value[0].value;
            }

            isDisplayed.value = false;
        };

        const toggleHide = (option: Option) => {
            isDisplayed.value = false;
            toggle(option);
        };

        const onBlur = () => {
            hide();
        };

        const onFocus = () => {
            q.value = '';
            display();
        };

        const onKeyUp = (ev: any) => {
            if (ev.key === 'Enter') {
                if (!isDisplayed.value) {
                    return;
                }

                if (
                    currentIndex.value !== -1 &&
            items.value[currentIndex.value]
                ) {
                    if (
                        isMulti.value &&
              selected.value.length > 0
                    ) {
                        hide();
                        return;
                    }

                    toggleHide(items.value[currentIndex.value]);

                    return;
                }

                if (selected.value.length === 0) {
                    if (items.value[0]) {
                        toggleHide(items.value[0]);
                    }

                    return;
                }

                hide();

                return;
            }

            if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
                display();

                if (ev.key === 'ArrowUp') {
                    if (currentIndex.value > 0) {
                        currentIndex.value--;
                    }
                    return;
                }

                if (currentIndex.value < items.value.length - 1) {
                    currentIndex.value++;
                }
            }

            display();
        };

        const onKeyDown = (ev: any) => {
            if (ev.key === ' ') {
                if (
                    isDisplayed.value &&
            currentIndex.value >= 0 &&
            items.value[currentIndex.value]
                ) {
                    ev.preventDefault();
                    toggle(items.value[currentIndex.value]);
                }
            }

            if (ev.key === 'Tab') {
                hide();
            }
        };

        const onMouseLeave = (event: any) => {
            event.preventDefault();
            hide();
        };

        return {
            isMulti,
            toggle,
            toggleHide,
            currentIndex,
            q,
            items,
            selected,
            display,
            onBlur,
            onFocus,
            onKeyUp,
            onKeyDown,
            onMouseLeave,
            isDisplayed,
        };
    },
});
</script>

<style scoped>
.dropdown {
  position: relative;
  display: block;
}

.dropdown .dropdown-input {
  cursor: pointer;
  border: 1px solid #e7ecf5;
  display: block;
  padding: 0.375rem 0.75rem;
  width: 100%;
  color: var(--bs-body-color);
  appearance: none;
  background-color: var(--bs-body-bg);
  background-clip: padding-box;
  border: var(--bs-border-width) solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.dropdown .dropdown-input:disabled {
  background-color: var(--bs-secondary-bg);
  opacity: 1;
}

.dropdown .dropdown-content {
  display: block;
  position: absolute;
  background-color: #fff;
  width:100%;
  border: var(--bs-border-width) solid var(--bs-border-color);
  overflow: auto;
  z-index: 999;
}

.dropdown .dropdown-content .dropdown-item {
  color: black;
  cursor: pointer;
  display: block;
  padding: 0.35rem;
}

.dropdown .dropdown-content .dropdown-item:hover,
.dropdown .dropdown-content .dropdown-item.current {
  background-color: #e7ecf5 !important;
}

.dropdown .dropdown-content .dropdown-item.active {
  background-color: #a2b1f1;
}

.dropdown .dropdown-selected {
   margin-top: 0.25rem;
}
</style>
