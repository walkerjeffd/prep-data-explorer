<script setup lang="ts">
import { ref } from 'vue'
import { useCompareStore } from '@/stores/compare'
import { useResultsStore } from '@/stores/results'
import { useStationsStore } from '@/stores/stations'
import { useVariablesStore } from '@/stores/variables'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'

import type Result from '@/types/Result'
import type ResultValues from '@/types/ResultValues'
import type Value from '@/types/Value'
import { downloadFile } from '@/services/download'
import { parseDate } from '@/lib/utils'

const { results } = storeToRefs(useCompareStore())
const { reset, removeResult } = useCompareStore()
const { getStationCodeById } = useStationsStore()
const { getVariableCodeById, getVariableById } = useVariablesStore()
const { minDate, maxDate } = storeToRefs(useResultsStore())

const chart = ref<HTMLInputElement | null>(null)
const chartIsVisible = useElementVisibility(chart)
const logScale = ref(false)
const lockPeriod = ref(true)

watch(chartIsVisible, () => {
  // re-render chart to fix range options (needs to know el width)
  if (!chart.value || chartIsVisible.value === false) return
  // @ts-ignore
  const chartObj = chart.value.chart
  chartObj.render()
})

function download(): void {
  const resultValues: ResultValues[] = results.value
    .map(d => d.resultValues || [])
    // @ts-ignore
    .flat()
  downloadFile(resultValues)
}

watch([minDate, maxDate], () => {
  if (!chart.value) return
  // @ts-ignore
  const chartObj = chart.value.chart
  updateChartPeriod(chartObj)
})

function updateChartPeriod (chart: any) {
  console.log('updateChartPeriod')
  if (!chart || !lockPeriod.value) return

  let minDateValue, maxDateValue
  if (minDate.value !== null) {
    minDateValue = parseDate(minDate.value).valueOf()
  }
  if (maxDate.value !== null) {
    maxDateValue = parseDate(maxDate.value).valueOf()
  }

  console.log(minDateValue, maxDateValue)
  chart.xAxis[0].setExtremes(minDateValue, maxDateValue)
  chart.render()
}


const chartOptions = computed(() => {
  const resultsGroupedByVariable = results.value.reduce((acc, cur) => {
    if (!acc[cur.variableid_prep]) {
      acc[cur.variableid_prep] = []
    }
    acc[cur.variableid_prep].push(cur)
    return acc
  }, {} as Record<number, Result[]>)
  const groupedSeries = Object
    // @ts-ignore
    .entries(resultsGroupedByVariable)
    .map(([variableId, series]: [string, Result[]], i: number) => {
      const variable = getVariableById(Number(variableId))
      return {
        variable,
        series,
        yAxis: {
          gridLineWidth: i === 0 ? 1 : 0,
          type: logScale.value ? 'logarithmic' : 'linear',
          title: {
            text: variable?.variable_label,
            style: {
              font: '14px "Roboto Condensed", sans-serif'
            }
          },
          labels: {
            format: '{value}'
          },
          opposite: i > 0
        },
        data: series.map((d: Result) => {
          const values = (d.resultValues || [])
            .map((d: ResultValues | undefined) => d ? d.values : [])
            // @ts-ignore
            .flat()
          return {
            name: `${getStationCodeById(d.samplingfeatureid)} - ${getVariableCodeById(d.variableid_prep)}`,
            data: values
              .map((value: Value) => [(new Date(value.valuedatetime)).valueOf(), Number(value.datavalue)])
              .sort((a: number[], b: number[]) => a[0] - b[0]),
            // lineWidth: values && values.length >= 25 ? 1 : 0,
            lineWidth: 1,
            marker: {
              enabled: values ? values.length < 200 : false,
              radius: 3
            },
            states: {
              hover: {
                lineWidthPlus: values && values.length >= 25 ? 1 : 0,
              }
            },
            dataGrouping: {
              enabled: false
            },
            yAxis: i,
            showInNavigator: true
          }
        })
      }
    })
  return {
    chart: {
      zoomType: 'x',
      width: 600,
      height: '80%',
      events: {
        load: function (event: any) {
          // @ts-ignore
          const chart = event.target
          updateChartPeriod(chart)
        }
      }
    },
    title: {
      text: null
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
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
    plotOptions: {
      line: {
        states: {
          inactive: {
            enabled: false
          },
          hover: {
            lineWidthPlus: 0
          }
        }
      }
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
    // @ts-ignore
    yAxis: groupedSeries.map(d => d.yAxis),
    legend: {
      enabled: true
    },
    tooltip: {
      valueDecimals: 2,
      xDateFormat: '%b %d, %Y %l:%M %p'
    },
    // @ts-ignore
    series: groupedSeries.map(d => d.data).flat()
  }
})
</script>

<template>
  <v-alert v-if="results.length === 0" type="warning" class="mx-4 my-4" variant="tonal" border="start" title="No Data Selected">
    <div class="font-weight-bold">
      Click the <code>Add to Compare</code> button below a timeseries in the selected station box.
    </div>
  </v-alert>
  <div v-else>
    <highcharts :constructor-type="'stockChart'" :options="chartOptions" ref="chart"></highcharts>

    <div class=" d-flex align-center mb-4">
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
                <v-switch v-model="lockPeriod" color="primary" label="Lock to Time Period" hide-details dense></v-switch>
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
    <v-divider class="mb-4"></v-divider>
    <v-table density="compact">
      <thead>
        <tr>
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
            Values
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
          <td class="text-left truncate" style="max-width:200px;">{{ getStationCodeById(result?.samplingfeatureid) }}</td>
          <td class="text-left truncate" style="max-width:200px;">{{ getVariableCodeById(result?.variableid_prep) }}</td>
          <td class="text-right">
            {{ result.start?.toLocaleDateString() }} to {{ result.end?.toLocaleDateString() }}
          </td>
          <td class="text-right">{{ result.n_values.toLocaleString() }}</td>
          <td class="text-center px-0" style="max-width:60px">
            <v-btn size="x-small" icon="mdi-close-circle" variant="flat" @click="removeResult(result)">
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-divider class="mb-8"></v-divider>
    <div class="d-flex mt-4">
      <v-btn variant="tonal" color="accent" @click="reset">
        <v-icon icon="mdi-close" start></v-icon> Clear
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="tonal" color="accent" @click="download">
        <v-icon icon="$download" start></v-icon> Download
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
