<template>
  <AgCharts :options="chartOptions" :style="{ height: '300px' }" />
</template>

<script setup>
import { computed } from 'vue';
import { AgCharts } from 'ag-charts-vue3';

const props = defineProps({
  plotPointsCo: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotCo: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsCoPlus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  },
  calculatedPlotPointsCoMinus: {
    type: Array,
    required: true,
    default: () => [] // Assuming format [{ x: Date | number, y: number }]
  }
});

const chartOptions = computed(() => ({
  title: {
    text: 'Teste de Reprodutibilidade Diário do Calibrador de Doses - Co(57)'
  },
  series: [
    {
      type: 'scatter',
      data: props.plotPointsCo,
      xKey: 'x',
      yKey: 'y',
      title: 'Medidas Co(57)',
      marker: {
        fill: '#666666',
        stroke: '#666666'
      }
    },
    {
      type: 'line',
      data: props.calculatedPlotCo,
      xKey: 'x',
      yKey: 'y',
      title: 'Decaimento calculado para Co(57)',
      stroke: '#A71D00',
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsCoPlus,
      xKey: 'x',
      yKey: 'y',
      title: 'Limite Superior CNEN',
      stroke: '#F3BDB2',
      marker: { enabled: false }
    },
    {
      type: 'line',
      data: props.calculatedPlotPointsCoMinus,
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