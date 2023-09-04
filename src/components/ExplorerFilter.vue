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
  resultsFilteredByCoreDates,
  coreStationsOnly,
  variableIds,
  minDate,
  maxDate,
  valueCountTickLabels,
  valueCountSelectedRange
} = storeToRefs(useResultsStore())
const { valueCountQuantile } = useResultsStore()

const { stations, station: selectedStation, filteredStations, spatialFilter } = storeToRefs(useStationsStore())
const { selectStation, setSpatialFilter } = useStationsStore()
const { variables, coreVariablesOnly } = storeToRefs(useVariablesStore())

const availableVariables: ComputedRef<Variable[]> = computed(() => {
  const availableVariableIds = new Set()
  for (let i = 0; i < resultsFilteredByCoreDates.value.length; i++) {
    availableVariableIds.add(resultsFilteredByCoreDates.value[i].prep_variableid)
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

watch(resultsFilteredByCoreDates, () => {
  if (selectedStation.value) {
    const availableStations = resultsFilteredByCoreDates.value.map(d => d.samplingfeatureid)
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

function truncateString (str: string, num: number) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}
</script>

<template>
  <!-- TIME PERIOD -->
  <div>
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
    <v-row class="pl-2">
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
  </div>
  <v-divider class="mb-4"></v-divider>

  <!-- STATIONS -->
  <div>
    <div class="d-flex align-center">
      <div class="text-body-1">Stations</div>
      <v-spacer></v-spacer>
    </div>
    <div class="d-flex align-center">
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
    <div class="d-flex align-center">
      <div class="d-flex align-center" style="max-width:100%">
        <span class="text-body-2 pl-2 text-grey-darken-1">Spatial:</span>
        <v-chip class="ma-2" color="accent" label outlined size="small" v-if="spatialFilter">
          <span class="text-body-1">{{ truncateString(spatialFilter.options.label(spatialFilter.feature), 55) }}</span>
          <v-icon small @click="setSpatialFilter(null)" class="ml-2">mdi-close</v-icon>
        </v-chip>
        <v-chip v-else class="ma-2" color="gray" label outlined size="small">
          Add a layer and click a polygon to filter stations by area
        </v-chip>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
        <span v-html="'Add a layer from the Map Layers dropdown (HUC12, Waterbody, Towns),<br>then click on a polygon to filter stations within that area.'"></span>
      </v-tooltip>
    </div>
  </div>
  <v-divider class="my-4"></v-divider>

  <!-- PARAMETERS -->
  <div>
    <div class="d-flex align-center">
      <div class="text-body-1">Parameters</div>
    </div>
    <div class="d-flex align-center">
      <v-switch
        v-model="coreVariablesOnly"
        label="Core parameters only"
        color="accent"
        hide-details
        class="ml-2 pt-0"
      ></v-switch>
      <v-spacer></v-spacer>
      <v-tooltip text="Turn switch OFF to view all available parameters" dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
      </v-tooltip>
    </div>
    <div class="d-flex">
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
        hide-details
        class="pl-2 mt-n4 mb-4"
      ></v-autocomplete>
      <v-tooltip dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
        <span v-html="'Select one or more parameters to see which stations have data for those parameters'"></span>
      </v-tooltip>
    </div>
  </div>
  <v-divider class="mb-4"></v-divider>

  <!-- VALUES PER STATION -->
  <div>
    <div class="d-flex align-center">
      <div class="text-body-1">Measurement Counts</div>
      <v-spacer></v-spacer>
      <v-tooltip dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
        <span v-html="'Filter by # measurements (over all parameters) at each station.<br>Sliders filter based on relative percentile of # measurements.<br>Middle value is median # measurements per station over all stations.'"></span>
      </v-tooltip>
    </div>
    <v-range-slider
      v-model="valueCountSelectedRange"
      strict
      label="# per Station"
      class="px-2 mt-2"
      color="grey-darken-1"
      :ticks="[0, 50, 100]"
      :step="1"
      show-ticks="always"
      :thumb-label="true"
    >
      <template v-slot:tick-label="//@ts-ignore
                                  { index }">
        {{ valueCountTickLabels[index]?.toLocaleString() }}
      </template>
      <template v-slot:thumb-label="{ modelValue }">
        {{ valueCountQuantile(Number(modelValue)).toLocaleString() }}
      </template>
    </v-range-slider>
  </div>
  <v-divider class="my-4"></v-divider>

  <div>
    Showing <strong>{{ filteredStations.length.toLocaleString() }}</strong> of <strong>{{ stations.length.toLocaleString() }}</strong> available stations
  </div>
  <v-divider class="my-4"></v-divider>

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

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
