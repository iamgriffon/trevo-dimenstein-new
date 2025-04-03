<template>
  <AgCharts :options="chartOptions" :style="{ height: '300px' }" />
</template>

<script setup>
import { computed } from 'vue';
import { AgCharts } from 'ag-charts-vue3';

const props = defineProps({
  plotTests: {
    type: Array,
    required: true,
    default: () => []
  },
  calculatedPlotTests: {
    type: Array,
    required: true,
    default: () => []
  }
});

const chartOptions = computed(() => ({
  title: {
    text: 'Teste de Linearidade',
    fontSize: 18
  },
  series: [
    {
      type: 'scatter',
      data: props.plotTests,
      xKey: 'x',
      yKey: 'y',
      title: 'Medidas',
      marker: {
        size: 5,
        fill: '#3B82F6',
        stroke: '#3B82F6'
      }
      // Add hover effects if needed via listeners or tooltip configuration
    },
    {
      type: 'line',
      data: props.calculatedPlotTests,
      xKey: 'x',
      yKey: 'y',
      title: 'Regressão Linear',
      stroke: '#EF4444',
      marker: {
        enabled: false
      }
    }
  ],
  axes: [
    {
      type: 'number',
      position: 'bottom',
      title: {
        text: 'Tempo (h)',
        enabled: true,
        fontSize: 14,
        fontWeight: 'bold'
      },
    },
    {
      type: 'log',
      position: 'left',
      title: {
        text: 'Atividade (µCi)',
        enabled: true,
        fontSize: 14,
        fontWeight: 'bold'
      },
    }
  ],
  legend: {
    position: 'top'
  },
  tooltip: {
    enabled: true
  },
  // `responsive` and `maintainAspectRatio` are generally handled well by default
}));

// Optional watch is removed as computed handles reactivity
</script>
