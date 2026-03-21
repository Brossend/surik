<template>
  <div :class="$style['ui-divider']">
    <template v-if="props.label">
      <span :class="$style['ui-divider__line']"/>

      <span :class="$style['ui-divider__label']">
        {{ props.label }}
      </span>

      <span :class="$style['ui-divider__line']"/>
    </template>

    <span
        v-else
        :class="[
        $style['ui-divider__line'],
        $style['ui-divider__line--full-width'],
      ]"
    />
  </div>
</template>

<script lang="ts" setup>
import {uiDividerDefaultProps} from './ui-divider.constants';
import type {IUiDividerProps} from './ui-divider.types';

defineOptions({
  name: 'UiDivider',
});

const props = withDefaults(defineProps<IUiDividerProps>(), uiDividerDefaultProps);
</script>

<style
    lang="scss"
    module
    src="./ui-divider.module.scss"
/>