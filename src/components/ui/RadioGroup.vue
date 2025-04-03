<template>
  <div class="w-full" :class="className">
    <fieldset>
      <legend v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
        {{ label }}
      </legend>
      <div class="space-y-2 sm:space-y-0 sm:flex sm:space-x-6">
        <div
          v-for="option in options"
          :key="option.value"
          class="flex items-center"
        >
          <input
            :id="`${name}-${option.value}`"
            :name="name"
            type="radio"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="$emit('update:modelValue', option.value)"
            :disabled="disabled"
            class="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
          <label
            :for="`${name}-${option.value}`"
            class="ml-3 block text-sm font-medium text-gray-700"
            :class="{'text-gray-500': disabled, 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled}"
          >
            {{ option.label }}
          </label>
        </div>
      </div>
      <p v-if="error && typeof error === 'string'" class="mt-1 text-xs text-red-600">{{ error }}</p>
    </fieldset>
  </div>
</template>

<script setup>
import { cn } from "@/utils/cn"; // Assuming cn utility exists

const props = defineProps({
  modelValue: [String, Number, Boolean],
  options: {
    type: Array,
    required: true,
    default: () => [], // Should be an array of { value: any, label: string }
  },
  name: {
    type: String,
    required: true, // Name is important for grouping radio buttons
  },
  label: String,
  className: String,
  error: [Boolean, String],
  disabled: Boolean,
});

defineEmits(["update:modelValue"]);

</script>

<style scoped>
/* Add any specific scoped styles if Tailwind isn't sufficient */
</style> 