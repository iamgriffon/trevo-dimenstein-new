<template>
  <AgCharts :options="chartOptions" :style="{ height: '300px' }" />
</template>

<script setup>
import { computed } from 'vue';
import { AgCharts } from 'ag-charts-vue3';

const props = defineProps({
  plotPointsCs: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotCs: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsCsPlus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsCsMinus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  }
});

const chartOptions = computed(() => ({
  title: {
    text: 'Teste de Reprodutibilidade Diário do Calibrador de Doses - Cs(137)'
  },
  series: [
    {
      type: 'scatter',
      data: props.plotPointsCs,
      xKey: 'x',
      yKey: 'y',
      title: 'Medidas Cs(137)',
      marker: {
        fill: '#666666',
        stroke: '#666666'
      }
    },
    {
      type: 'line',
      data: props.calculatedPlotCs,
      xKey: 'x',
      yKey: 'y',
      title: 'Decaimento calculado para Cs(137)',
      stroke: '#A71D00',
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsCsPlus,
      xKey: 'x',
      yKey: 'y',
      title: 'Limite Superior CNEN',
      stroke: '#F3BDB2', // Use stroke for line color
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsCsMinus,
      xKey: 'x',
      yKey: 'y',
      title: 'Limite Inferior CNEN',
      stroke: '#F3BDB2', // Use stroke for line color
      marker: { enabled: false }
    }
  ],
  axes: [
    {
      type: 'time',
      position: 'bottom',
      title: { text: 'Tempo' },
      tick: { format: '%d/%m/%Y' } // Adjust format string as needed
    },
    {
      type: 'number',
      position: 'left',
      title: { text: 'Atividade (µCi)' },
      label: {
        formatter: params => params.value.toFixed(0) // Format tick labels
      }
      // Add min: 0 if axis must start at zero, ag-charts might include negative if data requires
      // min: 0
    }
  ],
  legend: {
    position: 'top'
  }
}));
</script> 