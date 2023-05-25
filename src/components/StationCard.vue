<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue'
import { useDisplay } from 'vuetify'

import type Variable from '@/types/Variable'
import type ResultValues from '@/types/ResultValues'
import type Result from '@/types/Result'
import type Value from '@/types/Value'

import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'
import { useCompareStore } from '@/stores/compare'

import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getResultValues } from '@/services/resultValues'
import { downloadFile } from '@/services/download'

const { lgAndUp } = useDisplay()
const chart = ref(null)
const show = ref(true)
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const resultValues: Ref<ResultValues[]> = ref([])

const { station } = storeToRefs(useStationsStore())
const { selectStation } = useStationsStore()
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
watch([station, selectedVariable], async ([newStation, newSelectedVariable]) => {
  if (!newStation) return
  if (!newSelectedVariable) return

  error.value = null
  loading.value = true
  resultValues.value = []
  try {
    // @ts-ignore
    const newResultValues = await getResultValues([newStation], newSelectedVariable)
    if (station.value?.samplingfeatureid === newStation.samplingfeatureid) {
      resultValues.value = newResultValues
    }
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
  if (!station.value) return
  if (!resultValues.value || resultValues.value.length === 0) return
  downloadFile(resultValues.value)
}

function addToCompare(): void {
  if (selectedVariable.value === null) return
  const result = stationResults.value.find(d => d.variableid_prep === selectedVariable.value?.variableid_prep)
  if (!result) return
  result.resultValues = resultValues.value
  addResult(result)
}

const chartOptions = computed(() => {
  const values = resultValues.value
    .map((d: ResultValues) => d.values)
    // @ts-ignore
    .flat()
  return {
    chart: {
      zoomType: 'xy',
      height: '50%'
    },
    title: {
      text: null
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      },
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%b %d, %Y',
        week: '%b %d, %Y',
        month: '%b %Y',
        year: '%Y'
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
    exporting: {
      chartOptions: {
        title: {
          text: `${station.value?.samplingfeaturecode} - ${variableAxisLabel(selectedVariable.value)}`
        }
      }
    },
    tooltip: {
      valueSuffix: ` ${selectedVariable.value?.unitsabbreviation}`,
      valueDecimals: 2,
      xDateFormat: '%b %d, %Y %l:%M %p'
    },
    series: [
      {
        name: selectedVariable.value?.variablenamecv,
        data: values
          .map((d: Value) => [(new Date(d.valuedatetime)).valueOf(), Number(d.datavalue)])
          .sort((a: number[], b: number[]) => a[0] - b[0]),
        lineWidth: values.length < 25 ? 0 : 1,
        marker: {
          enabled: values.length < 500
        },
        states: {
          hover: {
            lineWidthPlus: values.length < 25 ? 0 : 1,
          }
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
      <v-btn :icon="show ? '$expand' : '$collapse'" size="x-small" @click="show = !show"></v-btn>
      <v-btn icon="$close" size="x-small" @click="selectStation()"></v-btn>
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
      <v-alert v-if="station === null" type="info" class="mx-4 my-4" variant="tonal" border="start" title="No Station Selected">
        <div class="font-weight-bold">Select a station on the map to view its data.</div>
      </v-alert>
      <v-sheet v-else class="prep-station-sheet">
        <v-container v-if="lgAndUp">
          <v-row align="end">
            <v-col cols="12" lg="8" xl="9">
              <div class="text-h6 font-weight-black">{{ station.samplingfeaturecode }}</div>
              <div>{{ station.samplingfeaturename }}</div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" lg="4" xl="3" class="text-right">
              <div>{{ station.latitude.toFixed(4) }}, {{ station.longitude.toFixed(4) }}</div>
            </v-col>
          </v-row>
          <div class="text-caption">{{ station.samplingfeaturedescription }}</div>
        </v-container>
        <v-container v-else>
          <div class="text-h6 font-weight-black">{{ station.samplingfeaturecode }}</div>
          <div>{{ station.samplingfeaturename }}</div>
          <div>{{ station.latitude.toFixed(4) }}, {{ station.longitude.toFixed(4) }}</div>
          <div class="text-caption">{{ station.samplingfeaturedescription }}</div>
        </v-container>
        <v-divider class="mb-4"></v-divider>
        <div class="px-4 py-2">
          <v-autocomplete
            v-model="selectedVariableId"
            :items="stationVariables"
            variant="underlined"
            label="Select Parameter"
            item-title="variable_label"
            item-value="variableid_prep"
          ></v-autocomplete>
        </div>

        <div class="pa-4">
          <highcharts :options="chartOptions" ref="chart"></highcharts>
          <div class="text-caption d-flex align-center">
            <v-icon size="small" start>$info</v-icon>
            <div>Click + drag to zoom in</div>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="d-flex mt-4">
            <v-btn variant="tonal" color="accent" :disabled="resultValues.length === 0" @click="addToCompare">
              <v-icon icon="mdi-plus" start></v-icon> Add to Compare
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="accent" :disabled="resultValues.length === 0" @click="download">
              <v-icon icon="$download" start></v-icon> Download
            </v-btn>
          </div>
        </div>
      </v-sheet>
    </div>
  </v-card>
</template>

<style>
.prep-station-sheet {
  max-height: calc(100vh - 210px);
  overflow-y: auto;
}
</style>