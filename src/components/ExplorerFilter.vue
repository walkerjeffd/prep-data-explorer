<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'
import { sum } from 'd3-array'

const {
  variableIds,
  minDate,
  maxDate,
  valueCountTickLabels,
  valueCountSelectedRange,
  valueCountByStation,
  valueCountSelectedQuantiles
} = storeToRefs(useResultsStore())

const { stations } = storeToRefs(useStationsStore())
const { variables } = storeToRefs(useVariablesStore())

const filteredStationCount: ComputedRef<number> = computed(() => {
  const resultCounts = Array.from(valueCountByStation.value.values())
  const showStation = resultCounts
    .map(d => {
      return d >= valueCountSelectedQuantiles.value[0] && d <= valueCountSelectedQuantiles.value[1] ? 1 : 0
    })
  return sum(showStation)
})

function reset () {
  minDate.value = null
  maxDate.value = null
  variableIds.value = []
  valueCountSelectedRange.value = [0, 100]
}
</script>

<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="minDate"
        label="Start Date"
        type="date"
        variant="underlined"
        clearable
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="maxDate"
        label="End Date"
        type="date"
        variant="underlined"
        clearable
      ></v-text-field>
    </v-col>
  </v-row>
  <v-select variant="underlined" disabled label="Sample Medium"></v-select>
  <v-select variant="underlined" disabled label="Parameter Types"></v-select>
  <v-autocomplete
    v-model="variableIds"
    :items="variables"
    variant="underlined"
    label="Parameters"
    item-title="variablenamecv"
    item-value="variableid_prep"
    multiple
    clearable
    chips
    closable-chips
  ></v-autocomplete>
  <v-range-slider
    v-model="valueCountSelectedRange"
    strict
    class="pr-4"
    label="# Values per Station"
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
  <div class="text-caption text-right">
    Number of values across all selected parameters at each station.
  </div>

  <v-divider class="my-4"></v-divider>

  <div>Showing {{ filteredStationCount.toLocaleString() }} of {{ stations.length.toLocaleString() }} stations</div>

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
    <v-btn variant="tonal" color="accent" disabled>
      <v-icon icon="mdi-download" start></v-icon> Bulk Download
    </v-btn>
  </div>
</template>
