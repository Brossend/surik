<template>
  <button
      :class="[
      $style['ui-button'],
      $style[`ui-button--${props.variant}`],
      props.fullWidth && $style['ui-button--full-width'],
      isDisabled && $style['ui-button--disabled'],
      props.loading && $style['ui-button--loading'],
    ]"
      :disabled="isDisabled"
      :type="props.nativeType"
      v-bind="attrs"
      @click="handleClick"
  >
    <span
        v-if="props.loading"
        :class="$style['ui-button__loader']"
        aria-hidden="true"
    />

    <span :class="$style['ui-button__content']">
      <slot>
        {{ props.label }}
      </slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
import {computed, useAttrs} from 'vue';

import {uiButtonDefaultProps} from './ui-button.constants';
import type {IUiButtonProps, TUiButtonEmits} from './ui-button.types';

defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<IUiButtonProps>(), uiButtonDefaultProps);

const emit = defineEmits<TUiButtonEmits>();
const attrs = useAttrs();

const isDisabled = computed((): boolean => {
  return props.disabled || props.loading;
});

const handleClick = (event: MouseEvent): void => {
  if (isDisabled.value) {
    event.preventDefault();

    return;
  }

  emit('click', event);
};
</script>

<style
    lang="scss"
    module
    src="./ui-button.module.scss"
/>