<template>
  <div
    :class="[
      twMerge(className, 'flex items-center shadow-md'),
    ]"
  >
    <slot></slot>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :class="[
        twMerge(
          'h-10 w-full rounded-xl px-3 focus:outline-none',
          error && 'border-red-500',
          className
        ),
      ]"
    />
</div>
</template>

<script setup>
import { twMerge } from "tailwind-merge";
const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  className: String,
  type: {
    type: String,
    default: "text",
  },
  error: Boolean,
});
</script>
