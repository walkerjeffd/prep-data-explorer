<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue'
import type Result from '../types/Result'
import type Variable from '../types/Variable'
import type Value from '../types/Value'
import { useStationsStore } from '../stores/stations'
import { useResultsStore } from '../stores/results'
import { useVariablesStore } from '../stores/variables'
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getValues } from '@/services/values'

const chart = ref(null)
const show = ref(true)
const loading = ref(false)
const tab = ref('chart')
const error: Ref<string | null> = ref(null)
const values: Ref<Value[]> = ref([])

const { station } = storeToRefs(useStationsStore())
const { results } = storeToRefs(useResultsStore())
const { variables } = storeToRefs(useVariablesStore())
const stationResults: ComputedRef<Result[]> = computed(() => {
  if (station === null) return []
  return results.value.filter((result) => result.samplingfeatureid === station.value?.samplingfeatureid)
})
const selectedVariableId: Ref<number | null> = ref(null)
const selectedVariable: ComputedRef<Variable | null> = computed(() => {
  if (selectedVariableId.value === null) return null
  return variables.value.find(variable => variable.variable_id_pwde === selectedVariableId.value) || null
})
const stationVariables: ComputedRef<Variable[]> = computed(() => {
  const stationVariableIds = stationResults.value.map(d => d.variable_id_pwde)
  return variables.value.filter(variable => stationVariableIds.includes(variable.variable_id_pwde))
})
watch(stationVariables, () => {
  const stationVariableIds = stationVariables.value.map(d => d.variable_id_pwde)
  if (selectedVariableId.value !== null && !stationVariableIds.includes(selectedVariableId.value)) {
    selectedVariableId.value = stationVariableIds[0]
  } else if (selectedVariableId.value === null && stationVariableIds.length > 0) {
    selectedVariableId.value = stationVariableIds[0]
  }
})
watch([station, selectedVariable], async () => {
  if (!station) return
  if (!selectedVariable.value) return

  error.value = null
  loading.value = true
  try {
    // @ts-ignore
    values.value = await getValues(station.value, selectedVariable.value)
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      console.log(err)
      alert('unknown error')
    }
  } finally {
    loading.value = false
  }
}, { immediate: true })

watch(loading, () => {
  if (chart.value === null) return
  const { chart: chartObject } = chart.value
  if (loading.value) {
    // @ts-ignore
    chartObject.showLoading()
  } else {
    // @ts-ignore
    chartObject.hideLoading()
  }
})

function variableAxisLabel(variable: Variable | null) {
  if (variable === null) return ''
  return `${variable.variablenamecv} (${variable.unitsabbreviation})`
}

const options = computed(() => {
  return {
    chart: {
      zoomType: 'xy'
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
        text: variableAxisLabel(selectedVariable.value)
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      valueSuffix: ` ${selectedVariable.value?.unitsabbreviation}`,
      valueDecimals: 2,
    },
    series: [
      {
        name: selectedVariable.value?.variablenamecv,
        data: values.value.map(value => [value.datetime.valueOf(), value.value]),
        marker: {
          enabled: values.value.length < 1000
        }
      }
    ]
  }
})
</script>

<template>
  <v-card>
    <v-toolbar class="pl-4">
      <span class="text-h6">Selected Station: {{ error ? 'Error' : station === null ? 'None' : station?.samplingfeaturecode }}</span>
      <v-spacer></v-spacer>
      <v-btn disabled icon="mdi-arrow-expand-all" size="x-small"></v-btn>
      <v-btn :icon="show ? '$expand' : '$collapse'" size="x-small" @click="show = !show"></v-btn>
    </v-toolbar>

    <v-progress-linear
      color="accent"
      :active="loading"
      :indeterminate="loading"
      absolute
    ></v-progress-linear>
    <div v-if="show">
      <v-alert v-if="error !== null" type="error" class="ma-4" variant="tonal" border="start">
        <div class="text-h5">{{ error }}</div>
      </v-alert>
      <v-alert v-if="station === null" type="info" class="mx-4 my-8" variant="tonal" border="start">
        <div class="text-h5">No Station Selected</div>
        <p>Select a station on the map to view its data.</p>
      </v-alert>
      <v-sheet v-else>
        <div class="px-4 py-2">
          <v-autocomplete
            v-model="selectedVariableId"
            :items="stationVariables"
            variant="underlined"
            label="Select Parameter"
            item-title="variablenamecv"
            item-value="variable_id_pwde"
          ></v-autocomplete>
        </div>

        <v-tabs
          v-model="tab"
          bg-color="grey-lighten-4"
          color="accent"
          grow
          class="px-4"
        >
          <v-tab value="chart" prepend-icon="mdi-chart-line">Chart</v-tab>
          <v-tab value="table" prepend-icon="mdi-table">Table</v-tab>
          <v-tab value="metadata" prepend-icon="mdi-map-marker">Station Metadata</v-tab>
        </v-tabs>

        <div class="pa-4">
          <v-window v-model="tab">
            <v-window-item value="chart">
              <p class="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus eveniet modi rerum quia eos odit velit totam itaque at, ipsa voluptate numquam, sapiente quae temporibus? Quo quae commodi harum doloribus?</p>
              <highcharts :options="options" ref="chart"></highcharts>
              <v-divider class="my-4"></v-divider>
              <div class="d-flex mt-4">
                <v-btn variant="tonal" color="accent" disabled>
                  <v-icon icon="mdi-plus" start></v-icon> Add to Compare
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="accent" disabled>
                  <v-icon icon="mdi-download" start></v-icon> Download
                </v-btn>
              </div>
            </v-window-item>

            <v-window-item value="table">
              <v-alert
                type="error"
                title="Not Implemented Yet"
                text="This tab will contain a table of data for the selected station and variable."
                variant="tonal"
                class="my-8"
              ></v-alert>
            </v-window-item>

            <v-window-item value="metadata">
              <v-table>
                <tbody>
                  <tr>
                    <td class="text-right" style="width:0px">ID</td>
                    <td class="font-weight-bold">{{ station.samplingfeatureid }}</td>
                  </tr>
                  <tr>
                    <td class="text-right">Code</td>
                    <td class="font-weight-bold">{{ station.samplingfeaturecode }}</td>
                  </tr>
                  <tr>
                    <td class="text-right">Name</td>
                    <td class="font-weight-bold">{{ station.samplingfeaturename }}</td>
                  </tr>
                  <tr>
                    <td class="text-right">Description</td>
                    <td class="font-weight-bold">{{ station.samplingfeaturedescription }}</td>
                  </tr>
                  <tr>
                    <td class="text-right">Type</td>
                    <td class="font-weight-bold">{{ station.sitetypecv }}</td>
                  </tr>
                  <tr>
                    <td class="text-right">Coordinates</td>
                    <td class="font-weight-bold">{{ station.latitude.toFixed(4) }}, {{ station.longitude.toFixed(4) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
          </v-window>
        </div>
      </v-sheet>
    </div>
  </v-card>
</template>
