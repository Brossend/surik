<template>
  <component
      :is="linkTag"
      :aria-disabled="props.disabled || undefined"
      :class="[
      $style['ui-link'],
      props.underline && $style['ui-link--underline'],
      props.disabled && $style['ui-link--disabled'],
    ]"
      :href="resolvedHref"
      :rel="resolvedRel"
      :tabindex="props.disabled ? -1 : undefined"
      :target="resolvedTarget"
      :to="resolvedTo"
      v-bind="attrs"
      @click="handleClick"
  >
    <slot>
      {{ props.label }}
    </slot>
  </component>
</template>

<script lang="ts" setup>
import {computed, useAttrs} from 'vue';

import {uiLinkDefaultProps} from './ui-link.constants';
import type {IUiLinkProps, TUiLinkEmits} from './ui-link.types';

defineOptions({
  name: 'UiLink',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<IUiLinkProps>(), uiLinkDefaultProps);

const emit = defineEmits<TUiLinkEmits>();
const attrs = useAttrs();

const isNuxtLink = computed((): boolean => {
  return Boolean(props.to);
});

const isExternal = computed((): boolean => {
  return Boolean(props.href) && props.target === '_blank';
});

const linkTag = computed((): string => {
  return isNuxtLink.value ? 'NuxtLink' : 'a';
});

const resolvedTo = computed((): string | undefined => {
  return isNuxtLink.value ? props.to : undefined;
});

const resolvedHref = computed((): string | undefined => {
  return !isNuxtLink.value ? props.href || undefined : undefined;
});

const resolvedTarget = computed((): string | undefined => {
  return !isNuxtLink.value && props.target ? props.target : undefined;
});

const resolvedRel = computed((): string | undefined => {
  return isExternal.value ? 'noopener noreferrer' : undefined;
});

const handleClick = (event: MouseEvent): void => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();

    return;
  }

  emit('click', event);
};
</script>

<style
    lang="scss"
    module
    src="./ui-link.module.scss"
/>