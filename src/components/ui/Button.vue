<template>
  <button
    :class="[
      className,
      'h-10 w-full flex items-center justify-center',
      'border px-3 focus:outline-none focus:border-green-500',
      error ? 'border-red-500' : 'border-gray-300',
    ]"
    :type="type"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="animate-spin text-white w-6 h-6">
      <FontAwesomeIcon
        icon="fa-solid fa-spinner"
        class="w-6 h-6 animate-spin"
      />
    </span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineOptions({
  name: "Button",
});

defineProps({
  type: String,
  onClick: Function,
  className: String,
  loading: Boolean,
  disabled: Boolean,
  children: Element,
  error: Boolean,
});
</script>
