<script setup lang="ts">
import type Station from '@/types/Station'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { interpolateViridis as interpolateColor } from 'd3-scale-chromatic'
import type L from 'leaflet'
import {
  LMap,
  LControlLayers,
  LControlScale,
  LControl,
  LTileLayer,
  LGeoJson,
  LCircleMarker,
  LTooltip
} from '@vue-leaflet/vue-leaflet'
import { range } from 'd3-array'
import { scaleQuantile } from 'd3-scale'

import basemaps from '@/lib/basemaps'
import overlays from '@/lib/overlays'
import StationCard from '../components/StationCard.vue'
import ExplorerSidebar from '../components/ExplorerSidebar.vue'
import MapLegend from '@/components/MapLegend.vue'

import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'

const { stations, station: selectedStation } = storeToRefs(useStationsStore())
const { valueCountByStation, valueCountSelectedQuantiles, valueCountArray } = storeToRefs(useResultsStore())
const { fetchStations, selectStation } = useStationsStore()
const { fetchResults } = useResultsStore()
const { fetchVariables } = useVariablesStore()

const loading = ref(false)

const valueCountQuantileScale = computed(() => {
  return scaleQuantile()
    .domain(valueCountArray.value)
    .range(range(0, 1.1, 0.1))
})

function showStation (station: Station): boolean {
  if (!valueCountByStation.value) return true
  const value = valueCountByStation.value.get(station.samplingfeatureid)
  if (value === undefined) return false
  return value >= valueCountSelectedQuantiles.value[0] && value <= valueCountSelectedQuantiles.value[1]
}

function stationColor (station: Station) {
  if (station === selectedStation.value) return 'rgb(255, 69, 0)'
  const valueCount = valueCountByStation.value.get(station.samplingfeatureid) || 0
  return interpolateColor(valueCountQuantileScale.value(valueCount))
}

async function overlayAdd ({ layer }: { layer: L.GeoJSON }) {
  if (layer.getLayers().length === 0) {
    // @ts-ignore
    const url = layer.options.url
    const response = await fetch(url)
    const geojson = await response.json()
    layer.addData(geojson)
  }
  layer.bringToBack()
}

function mapReady (map: L.Map) {
  map.on('overlayadd', overlayAdd)
  map.eachLayer(d => {
    // @ts-ignore
    if (d.options?.visibleOnLoad) {
    // @ts-ignore
      overlayAdd({ layer: d })
    }
  })
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([fetchStations(), fetchResults(), fetchVariables()])
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message)
    } else {
      console.log(err)
      alert('unknown error')
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="explorer">
    <div class="explorer-map">
      <div style="height:100%;width:100%">
        <LMap :zoom="11" :center="[43.1, -71.0]" @ready="mapReady">
          <LControlLayers position="topleft"></LControlLayers>
          <LControlScale position="bottomright"></LControlScale>
          <LControl position="topright">
            <MapLegend />
          </LControl>
          <LTileLayer
            v-for="tile in basemaps"
            :key="tile.name"
            :name="tile.name"
            :visible="tile.visible"
            :url="tile.url"
            :attribution="tile.attribution"
            :options="tile.options"
            layer-type="base"
          ></LTileLayer>
          <LGeoJson
            v-for="overlay in overlays"
            :key="overlay.name"
            :name="overlay.name"
            :visible="overlay.visible"
            :options="overlay.options"
            :options-style="overlay.style as L.StyleFunction"
            layer-type="overlay"
          >
          </LGeoJson>
          <LCircleMarker
            v-for="station in stations"
            :key="station.samplingfeatureid"
            :latLng="[station.latitude, station.longitude]"
            :radius="station === selectedStation ? 10 : 8"
            :color="stationColor(station)"
            :visible="showStation(station)"
            :weight="2"
            @click="selectStation(station.samplingfeatureid)"
          >
            <LTooltip>
              <div class="font-weight-bold">{{ station.samplingfeaturecode }}</div>
              <div class="text-grey-darken-2">{{ station.samplingfeaturename }}</div>
            </LTooltip>
          </LCircleMarker>
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
  width: 30%;
  min-width: 400px;
  z-index:1000;
}
.explorer-loading {
  position: absolute;
  top: 0;
  right: 0;
  z-index:1000;
}
</style>