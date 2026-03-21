<template>
  <label
      :class="[
      $style['ui-checkbox'],
      props.disabled && $style['ui-checkbox--disabled'],
      model && $style['ui-checkbox--checked'],
    ]"
      :for="inputId"
  >
    <input
        :id="inputId"
        :aria-label="props.ariaLabel || props.label || undefined"
        :checked="model"
        :class="$style['ui-checkbox__native']"
        :disabled="props.disabled"
        :name="props.name"
        :required="props.required"
        type="checkbox"
        @blur="handleBlur"
        @change="handleChange"
        @focus="handleFocus"
    />

    <span
        :class="$style['ui-checkbox__box']"
        aria-hidden="true"
    >
      <span :class="$style['ui-checkbox__mark']"/>
    </span>

    <span
        v-if="props.label"
        :class="$style['ui-checkbox__label']"
    >
      {{ props.label }}
    </span>
  </label>
</template>

<script lang="ts" setup>
import {computed, useId} from 'vue';

import {uiCheckboxDefaultProps} from './ui-checkbox.constants';
import type {IUiCheckboxProps, TUiCheckboxEmits} from './ui-checkbox.types';

defineOptions({
  name: 'UiCheckbox',
});

const model = defineModel<boolean>({
  default: false,
});

const props = withDefaults(defineProps<IUiCheckboxProps>(), uiCheckboxDefaultProps);

const emit = defineEmits<TUiCheckboxEmits>();
const generatedId = useId();

const inputId = computed((): string => {
  return props.id || props.name || generatedId;
});

const handleChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;

  if (props.readonly) {
    target.checked = model.value;

    return;
  }

  model.value = target.checked;
  emit('change', target.checked);
};

const handleFocus = (event: FocusEvent): void => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent): void => {
  emit('blur', event);
};
</script>

<style
    lang="scss"
    module
    src="./ui-checkbox.module.scss"
/>