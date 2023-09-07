<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { storeToRefs } from 'pinia'

import BulkDownload from '../components/BulkDownload.vue'

import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'

import type Variable from '@/types/Variable'
import type Station from '@/types/Station'

const {
  resultsFilteredByDatesStations,
  resultsFilteredByDatesStationsSelected,
  visibleStations,
  minDate,
  maxDate,
  valueCountTickLabels,
  valueCountSelectedRange
} = storeToRefs(useResultsStore())
const { valueCountQuantile } = useResultsStore()

const {
  allStations,
  stations,
  coreStationsOnly,
  selectedStations,
  selectedStation,
  spatialFilter
} = storeToRefs(useStationsStore())
const { selectStation, setSpatialFilter } = useStationsStore()

const { variables, selectedVariables, coreVariablesOnly } = storeToRefs(useVariablesStore())

const availableStations: ComputedRef<Station[]> = computed(() => {
  return stations.value
    .filter(d => {
      return resultsFilteredByDatesStations.value
        .some(result => result.samplingfeatureid === d.samplingfeatureid)
    })
})

const availableVariables: ComputedRef<Variable[]> = computed(() => {
  return variables.value
    .filter(d => {
      return resultsFilteredByDatesStationsSelected.value
        .some(result => result.prep_variableid === d.prep_variableid)
    })
})

const firstSelectedVariable: ComputedRef<Variable | null> = computed(() => {
  if (selectedVariables.value.length > 0) {
    return selectedVariables.value[0]
  } else {
    return null
  }
})

watch(visibleStations, () => {
  if (selectedStation.value && !visibleStations.value.includes(selectedStation.value)) {
    selectStation()
  }
})

watch(availableVariables, () => {
  if (selectedVariables.value.length > 0) {
    selectedVariables.value = selectedVariables.value.filter(d => availableVariables.value.includes(d))
  }
})

function reset () {
  minDate.value = null
  maxDate.value = null
  coreStationsOnly.value = true
  setSpatialFilter(null)
  selectedVariables.value = []
  valueCountSelectedRange.value = [0, 100]
  coreVariablesOnly.value = true
}

const showBulkDownload: Ref<boolean> = ref(false)

function truncateString (str: string, num: number) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

function filterStations (value: string, query: string, item: { value: Station}) {
  if (value == null || query == null) return -1

  const text = item.value.samplingfeaturecode + ' ' + item.value.samplingfeaturename + ' ' + item.value.samplingfeaturedescription

  return text.toString().toLocaleLowerCase().indexOf(query.toString().toLocaleLowerCase())
}
</script>

<template>
  <!-- TIME PERIOD -->
  <div class="px-4">
    <div class="d-flex align-center">
      <div class="text-body-1">Time Period</div>
      <v-spacer></v-spacer>
      <v-tooltip dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
        <span v-html="'Filter by first and last date of available data.<br>Note: does not account for timeseries gaps.'"></span>
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
  <div class="px-4">
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
    <div class="d-flex align-center mb-2">
      <div class="d-flex align-center" style="max-width:100%">
        <span class="text-body-2 pl-2 text-grey-darken-1">Spatial:</span>
        <v-chip class="ma-2" color="accent" label outlined size="small" v-if="spatialFilter">
          <span class="text-body-1">{{ truncateString(spatialFilter.options.label(spatialFilter.feature), 55) }}</span>
          <v-icon small @click="setSpatialFilter(null)" class="ml-2">mdi-close</v-icon>
        </v-chip>
        <v-chip v-else class="ma-2" color="gray" label outlined size="small">
          Add a spatial filter to Map Layers, think click a polygon to filter stations by area
        </v-chip>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
        <span v-html="'Add a spatial filters layer from the Map Layers dropdown (HUC12, Waterbody, Towns),<br>then click on a polygon to filter stations within that area.'"></span>
      </v-tooltip>
    </div>
    <div class="d-flex">
      <v-autocomplete
        v-model="selectedStations"
        :items="availableStations"
        variant="underlined"
        placeholder="Select station(s)"
        item-title="samplingfeaturecode"
        :custom-filter="filterStations"
        filter-mode=""
        return-object
        multiple
        clearable
        chips
        closable-chips
        hide-details
        class="pl-2 mt-n4 mb-4"
      >
        <template #item="{ props }">
          <v-list-item v-bind="props" style="max-width:494px">
            <template #prepend="{isSelected}">
              <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
            </template>
            <v-list-item-subtitle>{{ props.value.samplingfeaturename }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text-caption">{{ props.value.samplingfeaturedescription }}</v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-autocomplete>
      <v-tooltip text="Select one or more stations from the dropdown to view only those stations" dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
      </v-tooltip>
    </div>
  </div>
  <v-divider class="my-4"></v-divider>

  <!-- VARIABLES -->
  <div class="px-4">
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
        v-model="selectedVariables"
        :items="availableVariables"
        variant="underlined"
        placeholder="Select parameter(s)"
        item-title="variable_label"
        return-object
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
  <div class="px-4">
    <div class="d-flex align-center">
      <div class="text-body-1">Measurement Counts</div>
      <v-spacer></v-spacer>
      <v-tooltip dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
        <span v-html="'Filter by # measurements at each station.<br>Slider range based on relative percentile of # measurements<br>(middle value = median # measurements per station over all stations).<br><br>NOTE: Counts include measurements from all selected parameters,<br>but are <strong>NOT</strong> filtered by time period.'"></span>
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

  <div class="px-4">
    Showing <strong>{{ visibleStations.length.toLocaleString() }}</strong> of <strong>{{ allStations.length.toLocaleString() }}</strong> available stations
  </div>

  <!-- <div class="my-4">
    <pre>dates: {{ resultsFilteredByDates.length }}<br>dates+stations: {{ resultsFilteredByDatesStations.length }}<br>dates+stations+variables: {{ resultsFilteredByDatesStationsVariables.length }}<br>visible stations: {{ visibleStations.length }}</pre>
  </div> -->

  <v-divider class="my-4"></v-divider>

  <div class="d-flex px-4">
    <v-btn variant="tonal" color="accent" @click="reset" :density="$vuetify.display.width > 1440 ? 'default' : 'comfortable'">
      <v-icon icon="mdi-refresh" start></v-icon> Reset
    </v-btn>
    <v-spacer></v-spacer>
    <v-dialog
      v-model="showBulkDownload"
      scrollable
      width="800px"
    >
      <template v-slot:activator="{ props }">
        <v-btn variant="tonal" color="accent" v-bind="props" :density="$vuetify.display.width > 1440 ? 'default' : 'comfortable'">
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
