<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <div
      :class="
        cn(
          'flex items-center px-4',
          'h-10 w-full', // Ensure consistent height
          'bg-white', // Default background
          'shadow-md',
          'border border-gray-300/40',
          'rounded-lg', // Apply rounding to the wrapper
          error && 'border-red-500',
          disabled && 'bg-gray-100 cursor-not-allowed',
          className
        )
      "
    >
      <FontAwesomeIcon
          v-if="icon"
          :icon="icon"
          class="mr-2 text-gray-400"
          :class="{'text-gray-500': disabled}"
      />
      <select
        :id="selectId"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        :class="[
          cn(
              'w-full focus:outline-none bg-inherit',
              'cursor-pointer',
               disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900',
               !modelValue && placeholder ? 'text-gray-400' : '' // Style placeholder text
          ),
        ]"
      >
        <option v-if="placeholder" value="" disabled selected hidden>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <!-- Optional: Add a dropdown arrow icon here if needed -->
       <FontAwesomeIcon
           :icon="['fas', 'chevron-down']"
           class="ml-2 text-gray-400 text-xs"
           :class="{'text-gray-500': disabled}"
       />
    </div>
    <!-- Optional: Add error message display here -->
     <p v-if="error && typeof error === 'string'" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { cn } from "@/utils/cn";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps({
  modelValue: [String, Number, Boolean, Object], // Can be various types depending on option values
  options: {
    type: Array,
    required: true,
    default: () => [], // Should be an array of { value: any, label: string, disabled?: boolean }
  },
  label: String,
  placeholder: String,
  className: String,
  error: [Boolean, String], // Allow string for error message
  disabled: Boolean,
  icon: [String, Array], // Accept FontAwesome icon prop
});

defineEmits(["update:modelValue"]);

// Generate a unique ID for label association
const selectId = computed(() => `select-${Math.random().toString(36).substring(7)}`);

</script>

<style scoped>
/* Scoped styles can be added here if needed, but prefer Tailwind utilities */
select {
  /* Remove default browser appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  /* Ensure background color is inherited for consistent styling */
  background-color: inherit;
   /* Ensure padding doesn't add extra space inside the wrapper */
  padding-left: 0.1rem; /* Adjust as needed if icon is present */
  padding-right: 0;
}

/* Style for the placeholder option text color when selected */
select:required:invalid {
  color: #9ca3af; /* gray-400 */
}
</style> 