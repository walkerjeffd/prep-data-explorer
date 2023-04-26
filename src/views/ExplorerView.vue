<script setup lang="ts">
import type Station from '@/types/Station'
import { onMounted, ref } from 'vue'
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
const { valueCountByStation, valueCountMax, valueCountSelectedQuantiles } = storeToRefs(useResultsStore())
const { fetchStations, selectStation } = useStationsStore()
const { fetchResults } = useResultsStore()
const { fetchVariables } = useVariablesStore()

const loading = ref(false)

function showStation (station: Station): boolean {
  if (!valueCountByStation.value) return true
  const value = valueCountByStation.value.get(station.samplingfeatureid)
  if (value === undefined) return false
  return value >= valueCountSelectedQuantiles.value[0] && value <= valueCountSelectedQuantiles.value[1]
}

function stationColor (station: Station) {
  if (station === selectedStation.value) return 'rgb(255, 69, 0)'
  const valueCount = valueCountByStation.value.get(station.samplingfeatureid) || 0
  return interpolateViridis(valueCount / valueCountMax.value)
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
            :visible="showStation(station)"
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