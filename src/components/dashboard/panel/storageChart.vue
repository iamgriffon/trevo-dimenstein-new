<script setup>
import { AgCharts } from "ag-charts-vue3";
import { ref, onMounted, computed } from "vue";
import auth from "@/services/authentication.js";
import axios from "axios";
const amount = ref(0.10864693900000001);
const chartOptions = ref({
  data: computed(() => [
    { label: "Espaço restante", value: 0.5 - amount.value },
    { label: "Espaço utilizado", value: amount.value },
  ]),
  title: {
    text: "Armazenamento",
  },
  series: [
    {
      type: "donut",
      calloutLabelKey: "label",
      angleKey: "value",
      innerRadiusRatio: 0.7,
    },
  ],
});

const errors = ref({});


onMounted(() => {
  fetchStorageData();
});

const fetchStorageData = async () => {
  try {
    const response = await axios.get(auth.apiUrl() + "dbinfo/");
    if (response.data) {
      amount.value = response.data;
    }
  } catch (error) {
    errors.value = error.response?.data || error.message;
  }
};
</script>

<template>
  <div class="w-full h-[400px]">
    <AgCharts :options="chartOptions" />
  </div>
</template>
