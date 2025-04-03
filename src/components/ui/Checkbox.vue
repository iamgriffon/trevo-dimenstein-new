<template>
  <div class="relative flex items-start" :class="className">
    <div class="flex items-center h-5">
      <input
        :id="checkboxId"
        :name="name"
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        :disabled="disabled"
        class="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
    <div class="ml-3 text-sm">
      <label
        :for="checkboxId"
        class="font-medium text-gray-700"
        :class="{
          'text-gray-500': disabled,
          'cursor-pointer': !disabled,
          'cursor-not-allowed': disabled
        }"
      >
        {{ label }}
      </label>
      <p v-if="description" class="text-gray-500">{{ description }}</p>
      <p v-if="error && typeof error === 'string'" class="mt-1 text-xs text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { cn } from "@/utils/cn"; // Assuming cn utility exists

const props = defineProps({
  modelValue: Boolean,
  label: {
    type: String,
    required: true,
  },
  name: String, // Optional: Useful if submitting as part of a native form
  description: String, // Optional description text
  className: String,
  error: [Boolean, String],
  disabled: Boolean,
});

defineEmits(["update:modelValue"]);

// Generate a unique ID for label association
const checkboxId = computed(() => `checkbox-${props.name || Math.random().toString(36).substring(7)}`);

</script>

<style scoped>
/* Add any specific scoped styles if Tailwind isn't sufficient */
</style> 