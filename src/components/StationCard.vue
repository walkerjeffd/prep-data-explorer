<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue'
import { useDisplay } from 'vuetify'

import type Variable from '../types/Variable'
import type Value from '../types/Value'
import type Result from '../types/Result'
import { useStationsStore } from '../stores/stations'
import { useResultsStore } from '../stores/results'
import { useVariablesStore } from '../stores/variables'
import { useCompareStore } from '../stores/compare'
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getValues } from '@/services/values'
import { downloadResults } from '@/services/download'

const { lgAndUp } = useDisplay()
const chart = ref(null)
const show = ref(true)
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const values: Ref<Value[]> = ref([])

const { station } = storeToRefs(useStationsStore())
const { getResultsByStation } = useResultsStore()
const { variableIds: resultsVariableIds } = storeToRefs(useResultsStore())
const { variables } = storeToRefs(useVariablesStore())
const { getVariableById } = useVariablesStore()
const { addResult } = useCompareStore()

const stationResults: ComputedRef<Result[]> = computed(() => getResultsByStation(station.value))
const selectedVariableId: Ref<number | null> = ref(null)
const selectedVariable: ComputedRef<Variable | null> = computed(() => {
  if (selectedVariableId.value === null) return null
  return getVariableById(selectedVariableId.value) || null
})
const stationVariables: ComputedRef<Variable[]> = computed(() => {
  const stationVariableIds = stationResults.value.map(d => d.variableid_prep)
  return variables.value.filter(variable => stationVariableIds.includes(variable.variableid_prep))
})
watch(stationVariables, () => {
  const stationVariableIds = stationVariables.value.map(d => d.variableid_prep)

  // keep selected variable for new station
  if (selectedVariableId.value !== null && stationVariableIds.includes(selectedVariableId.value)) return

  if (resultsVariableIds.value.length > 0) {
    // use first of selected variables for results filter
    selectedVariableId.value = resultsVariableIds.value[0]
  } else if (stationVariableIds.length > 0) {
    // use first of station variables
    selectedVariableId.value = stationVariableIds[0]
  }
})
watch([station, selectedVariable], async () => {
  if (!station.value) return
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

function download(): void {
  const result = stationResults.value.find(d => d.variableid_prep === selectedVariable.value?.variableid_prep)
  if (!result) return
  result.variable = selectedVariable.value!
  result.station = station.value!
  result.values = values.value
  downloadResults([result])
}

function addToCompare(): void {
  if (selectedVariable.value === null) return
  const result = stationResults.value.find(d => d.variableid_prep === selectedVariable.value?.variableid_prep)
  if (!result) return
  result.values = values.value
  result.visible = true
  addResult(result)
}

const chartOptions = computed(() => {
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
      xDateFormat: '%b %d, %Y %l:%M %p'
    },
    series: [
      {
        name: selectedVariable.value?.variablenamecv,
        data: values.value.map(value => [value.datetime.valueOf(), Number(value.value)]),
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
      <span class="text-h6">Selected Station Data</span>
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
        <v-container v-if="lgAndUp">
          <v-row align="end">
            <v-col cols="12" lg="8" xl="9">
              <div class="text-h6 font-weight-black">{{ station.samplingfeaturecode }}</div>
              <div>{{ station.samplingfeaturename }}</div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" lg="4" xl="3" class="text-right">
              <div>{{ station.sitetypecv }}</div>
              <div>{{ station.latitude.toFixed(4) }}, {{ station.longitude.toFixed(4) }}</div>
            </v-col>
          </v-row>
          <div class="text-caption">{{ station.samplingfeaturedescription }}</div>
        </v-container>
        <v-container v-else>
          <div class="text-h6 font-weight-black">{{ station.samplingfeaturecode }}</div>
          <div>{{ station.samplingfeaturename }}</div>
          <div>{{ station.sitetypecv }} | {{ station.latitude.toFixed(4) }}, {{ station.longitude.toFixed(4) }}</div>
          <div class="text-caption">{{ station.samplingfeaturedescription }}</div>
        </v-container>
        <v-divider class="mb-4"></v-divider>
        <div class="px-4 py-2">
          <v-autocomplete
            v-model="selectedVariableId"
            :items="stationVariables"
            variant="underlined"
            label="Select Parameter"
            item-title="variablenamecv"
            item-value="variableid_prep"
          ></v-autocomplete>
        </div>

        <div class="pa-4">
          <highcharts :options="chartOptions" ref="chart"></highcharts>
          <div class="text-caption"><v-icon size="small" start>mdi-information-outline</v-icon>Click + drag to zoom in</div>
          <v-divider class="my-4"></v-divider>
          <div class="d-flex mt-4">
            <v-btn variant="tonal" color="accent" :disabled="values.length === 0" @click="addToCompare">
              <v-icon icon="mdi-plus" start></v-icon> Add to Compare
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="accent" :disabled="values.length === 0" @click="download">
              <v-icon icon="mdi-download" start></v-icon> Download
            </v-btn>
          </div>
        </div>
      </v-sheet>
    </div>
  </v-card>
</template>
