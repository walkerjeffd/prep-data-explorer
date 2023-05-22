<script setup lang="ts">
import { useCompareStore } from '@/stores/compare'
import { useStationsStore } from '@/stores/stations'
import { useVariablesStore } from '@/stores/variables'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type Result from '@/types/Result'
import type Value from '@/types/Value'
import { downloadResults } from '@/services/download'

const { results } = storeToRefs(useCompareStore())
const { reset, removeResult } = useCompareStore()
const { getStationCodeById, getStationById } = useStationsStore()
const { getVariableCodeById, getVariableById } = useVariablesStore()

const visibleResults: ComputedRef<Result[]> = computed(() => results.value.filter(d => d.visible))

function download(): void {
  const rows = visibleResults.value.map(d => ({
    ...d,
    station: getStationById(d.samplingfeatureid),
    variable: getVariableById(d.variableid_prep)
  }))
  downloadResults(rows)
}

const chartOptions = computed(() => {
  const series = visibleResults.value.map(d => ({
    name: `${getStationCodeById(d.samplingfeatureid)} - ${getVariableCodeById(d.variableid_prep)}`,
    data: d.values ? d.values.map((value: Value) => [value.datetime.valueOf(), Number(value.value)]) : [],
    marker: {
      enabled: d.values ? d.values.length < 1000 : false
    }
  }))
  return {
    chart: {
      zoomType: 'xy',
      height: '70%'
    },
    title: {
      text: null
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        enabled: false
        // text: variableAxisLabel(selectedVariable.value)
      }
    },
    legend: {
      enabled: true
    },
    tooltip: {
      // valueSuffix: ` ${selectedVariable.value?.unitsabbreviation}`,
      valueDecimals: 2,
    },
    series
  }
})
</script>

<template>
  <v-alert v-if="results.length === 0" type="warning" class="mx-4 my-8" variant="flat" border="start">
    <div class="text-h5">No Data Selected</div>
    <p>Click the <code>Add to Compare</code> button below a timeseries in the selected station box.</p>
  </v-alert>
  <div v-else>
    <highcharts :options="chartOptions" ref="chart"></highcharts>
    <pre>TODO: multiple y-axes</pre>
    <v-divider class="mb-4"></v-divider>
    <v-table>
      <thead>
        <tr>
          <!-- <th></th> -->
          <th class="text-center">
            Station
          </th>
          <th class="text-center">
            Variable
          </th>
          <th class="text-center">
            Period
          </th>
          <th class="text-right">
            # Values
          </th>
          <th>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="result in results"
          :key="`${result.samplingfeatureid}:${result.variableid_prep}`"
        >
          <!-- <td><v-checkbox hide-details v-model="result.visible"></v-checkbox></td> -->
          <td class="text-left">{{ getStationCodeById(result?.samplingfeatureid) }}</td>
          <td class="text-left">{{ getVariableCodeById(result?.variableid_prep) }}</td>
          <td class="text-right">
            {{ result.start?.toLocaleDateString() }} to {{ result.end?.toLocaleDateString() }}
          </td>
          <td class="text-right">{{ result.n_values.toLocaleString() }}</td>
          <td class="text-center">
            <v-btn size="small" icon="mdi-close-circle" variant="flat" @click="removeResult(result)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-divider class="my-4"></v-divider>
    <div class="d-flex mt-4">
      <v-btn variant="tonal" color="accent" @click="reset">
        <v-icon icon="mdi-close" start></v-icon> Clear
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="tonal" color="accent" @click="download">
        <v-icon icon="mdi-download" start></v-icon> Download
      </v-btn>
    </div>
  </div>
</template>
