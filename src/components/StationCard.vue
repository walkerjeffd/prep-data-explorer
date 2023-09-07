<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue'
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'

import { parseDate } from '@/lib/utils'
import type Variable from '@/types/Variable'
import type ResultValues from '@/types/ResultValues'
import type Result from '@/types/Result'
import type Value from '@/types/Value'

import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'
import { useCompareStore } from '@/stores/compare'

import { getResultValues } from '@/services/resultValues'
import { downloadFile } from '@/services/download'

const { width } = useDisplay()

const chart = ref(null)
const downloading = ref(false)
const lockPeriod = ref(true)
const logScale = ref(false)
const show = ref(true)
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const resultValues: Ref<ResultValues[]> = ref([])

const { selectedStation, nearbyStations } = storeToRefs(useStationsStore())
const { selectStation } = useStationsStore()
const { getResultsByStation } = useResultsStore()
const { minDate, maxDate } = storeToRefs(useResultsStore())
const { variables, selectedVariables } = storeToRefs(useVariablesStore())
const { getVariableById } = useVariablesStore()
const { addResult } = useCompareStore()

const stationResults: ComputedRef<Result[]> = computed(() => getResultsByStation(selectedStation.value))
const selectedVariableId: Ref<number | null> = ref(null)
const selectedVariable: ComputedRef<Variable | null> = computed(() => {
  if (selectedVariableId.value === null) return null
  return getVariableById(selectedVariableId.value) || null
})
const stationVariables: ComputedRef<Variable[]> = computed(() => {
  const stationVariableIds = stationResults.value.map(d => d.prep_variableid)
  return variables.value.filter(variable => stationVariableIds.includes(variable.prep_variableid))
})
const chartKey: ComputedRef<string> = computed(() => {
  if (!selectedStation.value) return ''
  return `${selectedStation.value.samplingfeatureid}-${selectedVariableId.value}`
})
const seriesValues: ComputedRef<Array<Array<number>>> = computed(() => {
  const values = resultValues.value
    .map((d: ResultValues) => d.values)
    // @ts-ignore
    .flat()

  return values
    .map((d: Value) => [(new Date(d.valuedatetime)).valueOf(), Number(d.datavalue)])
    .sort((a: number[], b: number[]) => a[0] - b[0])
})
const selectedStationIndex: ComputedRef<number> = computed(() => {
  if (!selectedStation.value) return -1
  return nearbyStations.value.findIndex(d => d.samplingfeatureid === selectedStation.value?.samplingfeatureid)
})
function nextStation () {
  if (nearbyStations.value.length === 0) return
  const index = selectedStationIndex.value
  if (index >= 0 && index < nearbyStations.value.length - 1) {
    selectStation(nearbyStations.value[index + 1].samplingfeatureid)
  }
}
function prevStation () {
  if (nearbyStations.value.length === 0) return
  const index = selectedStationIndex.value
  if (index > 0 && (index - 1) < nearbyStations.value.length) {
    selectStation(nearbyStations.value[index - 1].samplingfeatureid)
  }
}

watch(stationVariables, () => {
  const stationVariableIds = stationVariables.value.map(d => d.prep_variableid)

  // keep selected variable for new station
  if (selectedVariableId.value !== null && stationVariableIds.includes(selectedVariableId.value)) {
    return
  }

  if (selectedVariables.value.length > 0) {
    // use first of selected variables for results filter
    selectedVariableId.value = selectedVariables.value[0].prep_variableid
  } else if (stationVariableIds.length > 0) {
    // use first of station variables
    selectedVariableId.value = stationVariableIds[0]
  }
})
watch([selectedStation, selectedVariable], async ([newStation, newSelectedVariable]) => {
  if (!newStation) return
  if (!newSelectedVariable) return

  error.value = null
  loading.value = true
  resultValues.value = []
  try {
    // @ts-ignore
    const newResultValues = await getResultValues([newStation], newSelectedVariable)
    if (selectedStation.value?.samplingfeatureid === newStation.samplingfeatureid) {
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

watch([minDate, maxDate], () => {
  if (!chart.value) return
  // @ts-ignore
  const chartObj = chart.value.chart
  updateChartPeriod(chartObj)
})

function variableAxisLabel(variable: Variable | null) {
  if (variable === null) return ''
  return `${variable.variablenamecv} (${variable.unitsabbreviation})`
}

function download(): void {
  if (!selectedStation.value) return
  if (!resultValues.value || resultValues.value.length === 0) return
  downloading.value = true
  setTimeout(() => {
    downloadFile(resultValues.value)
    downloading.value = false
  }, 100)
}

function addToCompare(): void {
  if (selectedVariable.value === null) return
  const result = stationResults.value.find(d => d.prep_variableid === selectedVariable.value?.prep_variableid)
  if (!result) return
  result.resultValues = resultValues.value
  addResult(result)
}

function updateChartPeriod (chart: any) {
  if (!chart || !lockPeriod.value) return

  let minDateValue, maxDateValue
  if (minDate.value !== null) {
    minDateValue = parseDate(minDate.value).valueOf()
    if (minDate.value.length != 10 || minDateValue < 0) return
  }
  if (maxDate.value !== null) {
    maxDateValue = parseDate(maxDate.value).valueOf()
    if (maxDate.value.length != 10 || maxDateValue < 0) return
  }

  chart.xAxis[0].setExtremes(minDateValue, maxDateValue)
  chart.render()
}

const chartOptions = computed(() => {
  // console.log('compute: chartOptions', seriesValues.value.length)
  return {
    chart: {
      zoomType: 'x',
      height: '70%',
      events: {
        load: (event: any) => {
          const chart = event.target
          updateChartPeriod(chart)
        },
      }
    },
    title: {
      text: null
    },
    rangeSelector: {
      selected: 4,
      buttons: [{
        type: 'month',
        count: 1,
        text: '1m',
        title: 'View 1 month'
      }, {
        type: 'month',
        count: 6,
        text: '6m',
        title: 'View 6 months'
      }, {
        type: 'year',
        count: 1,
        text: '1y',
        title: 'View 1 year'
      }, {
        type: 'all',
        text: 'All',
        title: 'View all'
      }]
    },
    xAxis: {
      // type: 'datetime',
      title: {
        text: 'Date',
        style: {
          font: width.value > 1440 ? '18px "Roboto Condensed", sans-serif' : '12px "Roboto Condensed", sans-serif'
        }
      },
      ordinal: false,
      minRange: 24 * 3600 * 1000,
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
      type: logScale.value ? 'logarithmic' : 'linear',
      title: {
        text: variableAxisLabel(selectedVariable.value),
        style: {
          color: 'black',
          font: width.value > 1440 ? '18px "Roboto Condensed", sans-serif' : '12px "Roboto Condensed", sans-serif'
        }
      },
      opposite: false,
    },
    legend: {
      enabled: false
    },
    exporting: {
      chartOptions: {
        title: {
          text: `${selectedStation.value?.samplingfeaturecode} - ${variableAxisLabel(selectedVariable.value)}`
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
        data: seriesValues.value,
        lineWidth: 1,
        marker: {
          enabled: seriesValues.value.length < 500,
          radius: 3
        },
        states: {
          hover: {
            lineWidthPlus: seriesValues.value.length < 25 ? 0 : 1,
          }
        },
        dataGrouping: {
          enabled: false
        }
      }
    ]
  }
})
</script>

<template>
  <v-card>
    <v-toolbar class="pl-4" v-if="$vuetify.display.width > 1440">
      <span class="text-h6">Selected Station Data</span>
      <v-spacer></v-spacer>
      <div class="d-flex align-center" v-if="nearbyStations.length >= 1">
        <v-btn size="x-small" :disabled="selectedStationIndex === 0" @click="prevStation">
          <v-icon size="small" left>mdi-menu-left</v-icon>
          Prev
        </v-btn>
        <span class="align-self-center text-caption mx-4">{{ selectedStationIndex + 1 }} of {{ nearbyStations.length }}</span>
        <v-btn size="x-small" :disabled="selectedStationIndex === (nearbyStations.length - 1)" @click="nextStation">
          Next
          <v-icon size="small" right>mdi-menu-right</v-icon>
        </v-btn>
      </div>
      <v-divider vertical class="mx-4"></v-divider>
      <v-btn :icon="show ? '$expand' : '$collapse'" size="x-small" @click="show = !show"></v-btn>
      <v-btn icon="$close" size="x-small" @click="selectStation()"></v-btn>
    </v-toolbar>
    <v-toolbar class="pl-4 d-flex" v-else>
      <div class="flex-grow-1">
        <div class="text-h6">Selected Station Data</div>
        <div class="d-flex align-center" v-if="nearbyStations.length >= 1">
          <v-btn size="x-small" :disabled="selectedStationIndex === 0" @click="prevStation">
            <v-icon size="small" left>mdi-menu-left</v-icon>
            Prev
          </v-btn>
          <span class="align-self-center text-caption mx-4">{{ selectedStationIndex + 1 }} of {{ nearbyStations.length }}</span>
          <v-btn size="x-small" :disabled="selectedStationIndex === (nearbyStations.length - 1)" @click="nextStation">
            Next
            <v-icon size="small" right>mdi-menu-right</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider vertical class="mx-4"></v-divider>
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
      <v-alert v-if="selectedStation === null" type="info" class="mx-4 mt-4 mb-6" variant="tonal" border="start" title="No Station Selected">
        <div class="font-weight-bold">Select a station on the map to view its data.</div>
      </v-alert>
      <v-sheet v-else class="prep-station-sheet">
        <v-container v-if="$vuetify.display.width > 1440">
          <v-row align="end">
            <v-col cols="12" lg="8" xl="9">
              <div class="text-h6 font-weight-black">{{ selectedStation.samplingfeaturecode }}</div>
              <div>{{ selectedStation.samplingfeaturename }}</div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" lg="4" xl="3" class="text-right">
              <div>{{ selectedStation.latitude.toFixed(4) }}, {{ selectedStation.longitude.toFixed(4) }}</div>
            </v-col>
          </v-row>
          <div class="text-caption">{{ selectedStation.samplingfeaturedescription }}</div>
        </v-container>
        <v-container v-else>
          <div class="text-body-1 font-weight-black">{{ selectedStation.samplingfeaturecode }}</div>
          <div class="text-caption">{{ selectedStation.samplingfeaturename }}</div>
          <div class="text-caption">{{ selectedStation.latitude.toFixed(4) }}, {{ selectedStation.longitude.toFixed(4) }}</div>
          <div class="text-caption">{{ selectedStation.samplingfeaturedescription }}</div>
        </v-container>
        <v-divider class="mb-4"></v-divider>
        <div class="px-4 py-2">
          <v-autocomplete
            v-model="selectedVariableId"
            :items="stationVariables"
            variant="underlined"
            label="Select Parameter"
            item-title="variable_label"
            item-value="prep_variableid"
            hide-details
            :density="$vuetify.display.width > 1440 ? 'default' : 'compact'"
          ></v-autocomplete>
        </div>

        <div class="py-4 px-4">
          <highcharts :constructor-type="'stockChart'" :options="chartOptions" ref="chart" :key="chartKey"></highcharts>
          <div class=" d-flex align-center">
            <div class="ml-4">
              <v-menu open-on-hover :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-btn prepend-icon="mdi-cog" variant="text" size="small" v-bind="props">
                    Chart Options
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-action class="px-2">
                      <v-switch v-model="logScale" color="primary" label="Log Scale" hide-details dense></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-action class="px-2">
                      <v-switch v-model="lockPeriod" color="primary" label="Lock to Time Period" hide-details></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-spacer></v-spacer>
            <div class="text-caption d-flex align-center">
              <v-icon size="small" start>$info</v-icon>
              <div>Click + drag to zoom in</div>
            </div>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="d-flex mt-4">
            <v-btn variant="tonal" color="accent" :disabled="resultValues.length === 0" @click="addToCompare">
              <v-icon icon="mdi-plus" start></v-icon> Add to Compare
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="accent" :disabled="resultValues.length === 0" @click="download" :loading="downloading">
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
  max-height: calc(100vh - 270px);
  overflow-y: auto;
}
</style>