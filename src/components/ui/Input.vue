<template>
  <div
    :class="cn('flex items-center', 'shadow-md', className)"
  >
    <slot></slot>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :class="[
        cn(
          'h-10 w-full rounded-xl px-3 focus:outline-none',
          error && 'border-red-500',
          className
        ),
      ]"
    />
  </div>
</template>

<script setup>
import { cn } from "@/utils/cn";
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
