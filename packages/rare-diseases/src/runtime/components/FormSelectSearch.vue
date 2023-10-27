<template>
    <div class="dropdown">
        <input
            v-model="q"
            class="dropdown-input"
            :disabled="disabled"
            :placeholder="placeholder"
            @focus="display()"
            @keyup="keyup"
        >

        <div
            v-show="isDisplayed"
            class="dropdown-content"
        >
            <div
                v-for="(option, index) in items"
                :key="index"
                class="dropdown-item"
                @mousedown="select(option)"
            >
                {{ option.value }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, ref, toRef, watch,
} from 'vue';

type Option = {
    id: string | number,
    value: string
};
export default defineComponent({
    props: {
        modelValue: {
            type: String,
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
    emits: ['update:modelValue'],
    async setup(props, { emit }) {
        const q = ref('');
        q.value = props.modelValue;

        const current = ref<null | Option>(null);

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

        watch(q, () => {
            if (items.value.length === 0) {
                current.value = null;
                return;
            }

            [current.value] = items.value;
        });

        const isDisplayed = ref(false);
        const select = (option: Option) => {
            current.value = option;
            isDisplayed.value = false;
            q.value = option.value;

            emit('update:modelValue', option.id);
        };

        const display = () => {
            if (props.disabled) return;

            q.value = '';
            isDisplayed.value = true;
        };

        const exit = () => {
            if (!current.value) {
                return;
            }
            isDisplayed.value = false;
            q.value = current.value.value;

            // emit selected
        };

        const keyup = (ev: any) => {
            if (ev.key === 'Enter' && items.value[0]) {
                select(items.value[0]);
            }
        };

        return {
            q,
            items,
            select,
            display,
            exit,
            keyup,
            isDisplayed,
        };
    },
});
</script>

<style scoped>
.dropdown {
  position: relative;
  display: block;
  margin: auto;
  .dropdown-input {
    cursor: pointer;
    border: 1px solid #e7ecf5;
    display: block;
    padding: 0.375rem 0.75rem;
    width: 100%;
    color: var(--bs-body-color);
    /* -webkit-appearance: none; */
    -moz-appearance: none;
    appearance: none;
    background-color: var(--bs-body-bg);
    background-clip: padding-box;
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .dropdown-content {
    position: absolute;
    background-color: #fff;
    width:100%;
    max-height: 248px;
    border: var(--bs-border-width) solid var(--bs-border-color);
    box-shadow: 0px -8px 34px 0px rgba(0,0,0,0.05);
    overflow: auto;
    z-index: 1;
    .dropdown-item {
      color: black;
      padding: 8px;
      text-decoration: none;
      display: block;
      cursor: pointer;
      &:hover {
        background-color: #e7ecf5;
      }
    }
  }
  .dropdown:hover .dropdowncontent {
    display: block;
  }
}
</style>
