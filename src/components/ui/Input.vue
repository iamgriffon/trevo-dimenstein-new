<template>
  <div
    :class="cn('flex items-center', 'shadow-md', className)"
  >
    <slot></slot>
    <input
      :type="type"
      :value="modelValue"
      @input="(e) => {
        if (props.readonly) return;
        $emit('update:modelValue', e.target.value)
      }"
      :placeholder="placeholder"
      :readonly="readonly"
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
  readonly: Boolean,
});
</script>
