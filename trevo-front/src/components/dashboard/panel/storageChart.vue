<script setup>
import { AgCharts } from "ag-charts-vue3";
import { ref } from "vue";
import auth from "@/services/authentication.js";
import axios from "axios";

defineOptions({
  name: 'Chart'
})

const chartOptions = ref({
  data: [],
  series: [
    {
      type: "doughnut",
      angleKey: "value",
      calloutLabelKey: "label",
      innerRadiusOffset: -40,
      fills: ["#f8f8f8", "#028090"],
    },
  ],
});

const errors = ref({});

axios
  .get(auth.apiUrl() + "dbinfo/")
  .then((response) => {
    if (response.data) {
      chartOptions.value.data = [
        { label: "Espaço utilizado", value: response.data },
        { label: "Espaço restante", value: 0.5 - response.data },
      ];
    }
  })
  .catch((error) => {
    errors.value = error.data;
  });
</script>

<template>
  <AgCharts :options="chartOptions" />
</template>
