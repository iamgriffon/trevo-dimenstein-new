<template>
  <AgCharts :options="chartOptions" :style="{ height: '300px' }" />
</template>

<script setup>
import { computed } from 'vue';
import { AgCharts } from 'ag-charts-vue3';

const props = defineProps({
  plotPointsBa: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotBa: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsBaPlus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsBaMinus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  }
});

const chartOptions = computed(() => ({
  title: {
    text: 'Teste de Reprodutibilidade Diário do Calibrador de Doses - Ba(133)'
  },
  series: [
    {
      type: 'scatter',
      data: props.plotPointsBa,
      xKey: 'x',
      yKey: 'y',
      title: 'Medidas Ba(133)',
      marker: {
        fill: '#666666',
        stroke: '#666666'
      }
    },
    {
      type: 'line',
      data: props.calculatedPlotBa,
      xKey: 'x',
      yKey: 'y',
      title: 'Decaimento calculado para Ba(133)',
      stroke: '#A71D00',
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsBaPlus,
      xKey: 'x',
      yKey: 'y',
      title: 'Limite Superior CNEN',
      stroke: '#F3BDB2',
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsBaMinus,
      xKey: 'x',
      yKey: 'y',
      title: 'Limite Inferior CNEN',
      stroke: '#F3BDB2',
      marker: { enabled: false }
    }
  ],
  axes: [
    {
      type: 'time',
      position: 'bottom',
      title: { text: 'Tempo' },
      tick: { format: '%d/%m/%Y' }
    },
    {
      type: 'number',
      position: 'left',
      title: { text: 'Atividade (µCi)' },
      label: {
        formatter: params => params.value.toFixed(0)
      }
      // min: 0
    }
  ],
  legend: {
    position: 'top'
  }
}));
</script> 