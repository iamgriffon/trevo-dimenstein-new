<template>
  <AgCharts :options="chartOptions" :style="{ height: '300px' }" />
</template>

<script setup>
import { computed } from 'vue';
import { AgCharts } from 'ag-charts-vue3';

const props = defineProps({
  plotPointsCsOmur: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotCsOmur: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsCsOmurPlus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsCsOmurMinus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  }
});

const chartOptions = computed(() => ({
  title: {
    text: 'Teste de Repetibilidade Diário do Calibrador de Doses - Cs(137) no Radioisótopo mais Utilizado'
  },
  series: [
    {
      type: 'scatter',
      data: props.plotPointsCsOmur,
      xKey: 'x',
      yKey: 'y',
      title: 'Medidas Cs(137) no Radioisótopo mais Utilizado',
      marker: {
        fill: '#666666',
        stroke: '#666666'
      }
    },
    {
      type: 'line',
      data: props.calculatedPlotCsOmur,
      xKey: 'x',
      yKey: 'y',
      title: 'Decaimento calculado para Cs(137) no Radioisótopo mais Utilizado',
      stroke: '#A71D00',
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsCsOmurPlus,
      xKey: 'x',
      yKey: 'y',
      title: 'Limite Superior CNEN',
      stroke: '#F3BDB2',
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsCsOmurMinus,
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