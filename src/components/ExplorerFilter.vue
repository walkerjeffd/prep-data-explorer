<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { storeToRefs } from 'pinia'

import BulkDownload from '../components/BulkDownload.vue'

import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'

import type Variable from '@/types/Variable'

const {
  resultsFilteredByCoreStations,
  coreStationsOnly,
  variableIds,
  minDate,
  maxDate,
  valueCountTickLabels,
  valueCountSelectedRange
} = storeToRefs(useResultsStore())

const { stations, station: selectedStation, filteredStations } = storeToRefs(useStationsStore())
const { selectStation } = useStationsStore()
const { variables } = storeToRefs(useVariablesStore())

const availableVariables: ComputedRef<Variable[]> = computed(() => {
  const availableVariableIds = new Set()
  for (let i = 0; i < resultsFilteredByCoreStations.value.length; i++) {
    availableVariableIds.add(resultsFilteredByCoreStations.value[i].prep_variableid)
  }
  return variables.value.filter(d => availableVariableIds.has(d.prep_variableid))
})

const firstSelectedVariable: ComputedRef<Variable | null> = computed(() => {
  if (variableIds.value.length > 0) {
    return variables.value.find(d => d.prep_variableid === variableIds.value[0]) as Variable
  } else {
    return null
  }
})

watch(resultsFilteredByCoreStations, () => {
  if (selectedStation.value) {
    const availableStations = resultsFilteredByCoreStations.value.map(d => d.samplingfeatureid)
    if (!availableStations.includes(selectedStation.value.samplingfeatureid)) {
      selectStation()
    }
  }
})

watch(availableVariables, () => {
  const availableVariableIds = availableVariables.value.map(d => d.prep_variableid)
  variableIds.value = variableIds.value.filter(d => availableVariableIds.includes(d))
})

function reset () {
  minDate.value = null
  maxDate.value = null
  variableIds.value = []
  valueCountSelectedRange.value = [0, 100]
}

const showBulkDownload: Ref<boolean> = ref(false)
</script>

<template>
  <div class="d-flex align-center mb-2">
    <v-switch
      v-model="coreStationsOnly"
      label="Core stations only"
      color="accent"
      hide-details
      class="ml-2 pt-0"
    ></v-switch>
    <v-spacer></v-spacer>
    <v-tooltip text="Turn switch OFF to view all available stations" dir="left">
      <template v-slot:activator="{ props }">
        <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
      </template>
    </v-tooltip>
  </div>
  <v-divider class="mb-4"></v-divider>
  <div class="d-flex align-center">
    <div class="text-body-1">Time Period</div>
    <v-spacer></v-spacer>
    <v-tooltip dir="left">
      <template v-slot:activator="{ props }">
        <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
      </template>
      <span v-html="'Filter stations by first and last date of available data over all selected parameters.<br>Note: does not account for timeseries gaps.'"></span>
    </v-tooltip>
  </div>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="minDate"
        label="Start"
        type="date"
        variant="underlined"
        clearable
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="maxDate"
        label="End"
        type="date"
        variant="underlined"
        clearable
      ></v-text-field>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <div class="text-body-1">Parameters</div>
    <v-spacer></v-spacer>
    <v-tooltip dir="left">
      <template v-slot:activator="{ props }">
        <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
      </template>
      <span v-html="'Select one or more parameters to see which stations have data for those parameters'"></span>
    </v-tooltip>
  </div>
  <v-autocomplete
    v-model="variableIds"
    :items="availableVariables"
    variant="underlined"
    placeholder="Select parameter(s)"
    item-title="variable_label"
    item-value="prep_variableid"
    multiple
    clearable
    chips
    closable-chips
  ></v-autocomplete>

  <div class="d-flex align-center">
    <div class="text-body-1"># Values per Station</div>
    <v-spacer></v-spacer>
    <v-tooltip dir="left">
      <template v-slot:activator="{ props }">
        <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
      </template>
      <span v-html="'# of values summed over all parameters at each station.<br>Sliders filter based on relative percentile of # values.<br>Middle value is median # values per station.'"></span>
    </v-tooltip>
  </div>
  <v-range-slider
    v-model="valueCountSelectedRange"
    strict
    class="px-2 mt-2"
    color="grey-darken-1"
    :ticks="[0, 50, 100]"
    :step="1"
    show-ticks="always"
  >
    <template v-slot:tick-label="//@ts-ignore
                                { index }">
      {{ valueCountTickLabels[index]?.toLocaleString() }}
    </template>
  </v-range-slider>

  <v-divider class="my-4"></v-divider>

  <div>Showing {{ filteredStations.length.toLocaleString() }} of {{ stations.length.toLocaleString() }} available stations</div>

  <v-divider class="my-4"></v-divider>

  <!-- <div>
    <pre>Filtered Rows: {{ resultsFilteredByDatesAndVariables.length }} (of {{  results.length  }} total)</pre>
    <pre>Range: {{ valueCountSelectedRange }}</pre>
    <pre>Quantiles: {{ valueCountSelectedQuantiles }}</pre>
  </div>

  <v-divider class="my-4"></v-divider> -->

  <div class="d-flex">
    <v-btn variant="tonal" color="accent" @click="reset">
      <v-icon icon="mdi-refresh" start></v-icon> Reset
    </v-btn>
    <v-spacer></v-spacer>
    <v-dialog
      v-model="showBulkDownload"
      scrollable
      width="800px"
    >
      <template v-slot:activator="{ props }">
        <v-btn variant="tonal" color="accent" v-bind="props">
          <v-icon icon="$download" start></v-icon> Bulk Download
        </v-btn>
      </template>
      <BulkDownload :variables="availableVariables" :selected-variable="firstSelectedVariable" :min-date="minDate" :max-date="maxDate" @close="showBulkDownload = false" />
    </v-dialog>
  </div>
</template>
