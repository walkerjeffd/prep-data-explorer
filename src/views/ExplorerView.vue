<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type Station from '@/types/Station'
import type Result from '@/types/Result'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { interpolateViridis } from 'd3-scale-chromatic'
import {
  LMap,
  LTileLayer,
  LCircleMarker
} from '@vue-leaflet/vue-leaflet'

import StationCard from '../components/StationCard.vue'
import ExplorerSidebar from '../components/ExplorerSidebar.vue'

import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'

const { stations, station: selectedStation } = storeToRefs(useStationsStore())
const { results } = storeToRefs(useResultsStore())
const { fetchStations, selectStation } = useStationsStore()
const { fetchResults } = useResultsStore()
const { fetchVariables } = useVariablesStore()

const loading = ref(false)

const maxValueCount: ComputedRef<number> = computed(() => {
  const nValues = results.value.map(d => d.n_values)
  return Math.max(...nValues)
})

function stationColor (station: Station) {
  if (station === selectedStation.value) return 'rgb(255, 69, 0)'
  const stationResults = results.value.filter(d => d.samplingfeatureid === station.samplingfeatureid)
  const nValues = stationResults.reduce((acc: number, d: Result) => acc + d.n_values, 0)
  return interpolateViridis(nValues / maxValueCount.value)
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchStations(), fetchResults(), fetchVariables()])
  loading.value = false
})
</script>

<template>
  <div class="explorer">
    <div class="explorer-map">
      <div style="height:100%;width:100%">
        <LMap :zoom="11" :center="[43.2, -71]">
          <LTileLayer
            layer-type="base"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            name="CartoDB Positron"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
          />
          <LCircleMarker
            v-for="station in stations"
            :key="station.samplingfeatureid"
            :latLng="[station.latitude, station.longitude]"
            :radius="station === selectedStation ? 10 : 5"
            :color="stationColor(station)"
            @click="selectStation(station.samplingfeatureid)"
          ></LCircleMarker>
        </LMap>
        <div class="explorer-station">
          <StationCard></StationCard>
        </div>
          <v-sheet class="explorer-loading elevation-2 px-4 py-2 ma-2" color="primary" rounded v-if="loading">
            <v-progress-circular
              color="white"
              indeterminate
              size="24"
            ></v-progress-circular>
            <span class="ml-4">Loading...</span>
          </v-sheet>
      </div>
    </div>
    <div class="explorer-sidebar">
      <ExplorerSidebar></ExplorerSidebar>
    </div>
  </div>
</template>

<style scoped>
.explorer {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.explorer-map {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
}
.explorer-sidebar {
  display: flex;
  flex-basis: 600px;
  flex-grow: 0;
  flex-shrink: 1;
}
.explorer-station {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 800px;
  z-index:1000;
}
.explorer-loading {
  position: absolute;
  top: 0;
  right: 0;
  z-index:1000;
}
</style>