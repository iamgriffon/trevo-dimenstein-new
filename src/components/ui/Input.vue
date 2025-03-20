<template>
  <div
    :class="
      cn(
        'flex items-center px-4',
        'shadow-md',
        'border border-gray-300/40',
        error && 'border-red-500',
        className
      )
    "
    v-if="type !== 'date' && type !== 'datetime' && type !== 'time'"
  >
    <slot></slot>
    <input
      :disabled="readonly"
      :type="type"
      :value="modelValue"
      @input="
        (e) => {
          if (props.readonly) return;
          $emit('update:modelValue', e.target.value);
        }
      "
      :placeholder="placeholder"
      :readonly="readonly"
      :class="[cn('h-10 w-full rounded-xl px-3 focus:outline-none bg-inherit')]"
    />
  </div>
  <DatePicker
    v-if="type === 'date' || type === 'datetime' || type === 'time'"
    :modelValue="parsedDate"
    @update:modelValue="handleDateUpdate"
    :disabled="readonly"
    showIcon
    locale="pt"
    :view="viewMode"
    :timeOnly="type === 'time'"
    :showTime="type === 'datetime'"
    :hourFormat="'24'"
    :yearNavigator="viewMode !== 'year'"
    :monthNavigator="viewMode !== 'month' && viewMode !== 'year'"
    :hideOnDateTimeSelect="true"
    :showOtherMonths="false"
    :inputClass="cn('cursor-pointer bg-inherit rounded-lg', readonly && 'cursor-default')"
    :dateFormat="computedDateFormat"
    :today-button-props="{
      class: 'text-green-500',
    }"
    :class="[
      cn(
        'h-10 w-full border border-gray-300/40 px-3 shadow-md',
        error && 'border-red-500',
        className
      ),
    ]"
    :panelStyle="{
      minWidth: '280px',
      backgroundColor: 'white',
      border: '1px solid #64748b',
      borderRadius: '10px',
      zIndex: '10',
      padding: '10px',
    }"
    @onSelect="handleDateUpdate"
  >
    <template #calendar-icon>
      <FontAwesomeIcon :icon="calendarIcon" />
    </template>
  </DatePicker>
</template>

<script setup>
import { cn } from "@/utils/cn";
import DatePicker from "primevue/datepicker";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { computed } from "vue";

const props = defineProps({
  modelValue: [String, Number, Date],
  placeholder: String,
  className: String,
  type: {
    type: String,
    default: "text",
  },
  error: Boolean,
  readonly: Boolean,
  format: String,
  clearable: Boolean,
  lang: String,
  yearOnly: {
    type: Boolean,
    default: false,
  },
  dayOnly: {
    type: Boolean,
    default: false,
  },
  monthOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

// Calculate PrimeVue's dateFormat based on the component configuration
const computedDateFormat = computed(() => {
  if (props.type === "time") return "HH:mm";
  if (props.type === "datetime") return "dd/mm/yy HH:mm";
  if (props.yearOnly) return "yy";
  if (props.monthOnly) return "mm/yy";
  if (props.dayOnly) return "dd/mm/yy";
  return "dd/mm/yy";
});

// Parse input date string to Date object for DatePicker
const parsedDate = computed(() => {
  if (!props.modelValue) return null;

  // If already a Date object
  if (props.modelValue instanceof Date) return props.modelValue;

  try {
    // Handle different date formats
    if (typeof props.modelValue === "string") {
      // Common dd/MM/yyyy format used in Brazil
      if (props.modelValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return parse(props.modelValue, "dd/MM/yyyy", new Date());
      }

      // Year only format
      if (props.yearOnly && props.modelValue.match(/^\d{4}$/)) {
        return new Date(parseInt(props.modelValue, 10), 0, 1);
      }

      // Month/Year format
      if (props.monthOnly && props.modelValue.match(/^\d{2}\/\d{4}$/)) {
        const [month, year] = props.modelValue.split("/");
        return new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      }

      // Try to create date from ISO string or other formats
      const date = new Date(props.modelValue);
      return isNaN(date.getTime()) ? null : date;
    }

    return new Date(props.modelValue);
  } catch (error) {
    console.error("Date parsing error:", error);
    return null;
  }
});

// Handle date update from DatePicker
const handleDateUpdate = (value) => {
  if (props.readonly) return;
  let result = "";

  if (!value) {
    emit("update:modelValue", "");
    return;
  }

  if (props.yearOnly) result = value.getFullYear().toString();

  if (props.monthOnly) result = format(value, "MM/yyyy", { locale: ptBR });

  if (props.type === "time") result = format(value, "HH:mm", { locale: ptBR });

  if (props.type === "datetime")
    result = format(value, "dd/MM/yyyy HH:mm", { locale: ptBR });

  emit("update:modelValue", result);
  return result;
};

const viewMode = computed(() => {
  if (props.yearOnly) return "year";
  if (props.monthOnly) return "month";
  if (props.dayOnly) return "day";
  return "date";
});

const calendarIcon = computed(() => {
  if (props.type === "time") return "fa-solid fa-clock";
  return "fa-solid fa-calendar";
});
</script>

<style>
.p-datepicker-header {
  margin-bottom: 10px;
}

.p-datepicker-title {
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px !important;
}

th,
th > span {
  cursor: default !important;
}

td,
span {
  cursor: pointer !important;
}

.p-timepicker {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

/* Ensure proper sizing of input field */
.p-datepicker .p-inputtext {
  width: 100%;
  height: 40px;
}

/* Fix for initial state */
.p-datepicker-trigger {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* Ensure proper panel width */
.p-datepicker-panel {
  min-width: 280px !important;
}

.p-datepicker-today {
  color: #008000 !important;
  text-decoration: underline !important;
}

.p-datepicker-day-selected {
  background-color: #008000 !important;
  color: #fff !important;
  font-weight: 600 !important;
}

.p-datepicker-month {
  padding: 4px !important;
}
</style>
