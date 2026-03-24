<template>
  <div :class="$style['ui-input']">
    <label
        v-if="props.showLabel && props.label"
        :class="$style['ui-input__label']"
        :for="inputId"
    >
      <span
          v-if="props.required"
          :class="$style['ui-input__required']"
      >
        *
      </span>

      {{ props.label }}
    </label>

    <div
        :class="[
        $style['ui-input__control'],
        props.disabled && $style['ui-input__control--disabled'],
        hasError && $style['ui-input__control--error'],
      ]"
    >
      <span
          v-if="resolvedLeftIcon"
          :class="$style['ui-input__left-icon']"
          aria-hidden="true"
      >
        <Icon
            :name="resolvedLeftIcon"
            size="18"
        />
      </span>

      <input
          :id="inputId"
          :aria-describedby="ariaDescribedby"
          :aria-invalid="hasError || undefined"
          :autocomplete="resolvedAutocomplete"
          :class="[
          $style['ui-input__field'],
          resolvedLeftIcon && $style['ui-input__field--with-left-icon'],
          isPassword && $style['ui-input__field--with-toggle'],
        ]"
          :disabled="props.disabled"
          :inputmode="resolvedInputMode"
          :name="props.name"
          :placeholder="props.placeholder"
          :readonly="props.readonly"
          :type="currentInputType"
          :value="model"
          v-bind="attrs"
          @blur="handleBlur"
          @focus="handleFocus"
          @input="handleInput"
      />

      <button
          v-if="isPassword"
          :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
          :aria-pressed="showPassword"
          :class="$style['ui-input__toggle']"
          type="button"
          @click="togglePassword"
          @mousedown.prevent
      >
        <Icon
            :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
            size="18"
        />
      </button>
    </div>

    <p
        v-if="message"
        :id="messageId"
        :class="[
        $style['ui-input__message'],
        hasError && $style['ui-input__message--error'],
      ]"
    >
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useAttrs, useId } from 'vue';

import { uiInputDefaultProps } from './ui-input.constants';
import type {
  IUiInputProps,
  TResolvedInputType,
  TUiInputEmits,
} from './ui-input.types';

defineOptions({
  name: 'UiInput',
  inheritAttrs: false,
});

const model = defineModel<string>({
  default: '',
});

const props = withDefaults(defineProps<IUiInputProps>(), uiInputDefaultProps);

const emit = defineEmits<TUiInputEmits>();
const attrs = useAttrs();
const generatedId = useId();
const showPassword = ref(false);

const inputId = computed((): string => props.id || props.name || generatedId);

const messageId = computed((): string => `${inputId.value}-message`);

const hasError = computed((): boolean => Boolean(props.error));

const message = computed((): string => props.error || props.hint);

const ariaDescribedby = computed((): string | undefined => {
  return message.value ? messageId.value : undefined;
});

const isPassword = computed((): boolean => props.type === 'password');

const currentInputType = computed((): string => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }

  if (props.type === 'email') {
    return 'email';
  }

  return 'text';
});

const resolvedAutocomplete = computed((): string => {
  if (props.autocomplete) {
    return props.autocomplete;
  }

  if (props.type === 'email') {
    return 'email';
  }

  if (props.type === 'password') {
    return 'current-password';
  }

  if (props.type === 'nickname') {
    return 'username';
  }

  return 'off';
});

const resolvedInputMode = computed((): TResolvedInputType => {
  if (props.type === 'email') {
    return 'email';
  }

  return 'text';
});

const resolvedLeftIcon = computed((): string => {
  if (props.leftIcon) {
    return props.leftIcon;
  }

  if (props.type === 'email') {
    return 'mdi:email-outline';
  }

  if (props.type === 'password') {
    return 'mdi:lock-outline';
  }

  if (props.type === 'nickname') {
    return 'mdi:user-outline';
  }

  return '';
});

const normalizeEmail = (value: string): string => {
  let nextValue = value.replace(/\s+/g, '');

  if (props.lowercaseEmail) {
    nextValue = nextValue.toLowerCase();
  }

  nextValue = nextValue.replace(/[^a-z0-9@._+\-]/gi, '');

  const [local = '', ...rest] = nextValue.split('@');

  nextValue = rest.length ? `${local}@${rest.join('')}` : local;
  nextValue = nextValue.replace(/\.{2,}/g, '.');

  return nextValue;
};

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  let nextValue = target.value;

  if (props.type === 'email' && props.emailMask) {
    nextValue = normalizeEmail(nextValue);

    if (target.value !== nextValue) {
      target.value = nextValue;
    }
  }

  model.value = nextValue;
};

const handleFocus = (event: FocusEvent): void => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent): void => {
  const target = event.target as HTMLInputElement;

  if (props.type === 'email' && props.emailMask) {
    const nextValue = normalizeEmail(target.value).replace(/^\.|\.$/g, '');

    if (target.value !== nextValue) {
      target.value = nextValue;
    }

    model.value = nextValue;
  }

  emit('blur', event);
};

const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
};
</script>

<style
    lang="scss"
    module
    src="./ui-input.module.scss"
/>