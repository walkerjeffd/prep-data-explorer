<script setup lang="ts">
import type Station from '@/types/Station'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { interpolateViridis as interpolateColor } from 'd3-scale-chromatic'
import type L from 'leaflet'
import type { Ref } from 'vue'
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

import { distance } from '@/lib/utils'
import basemaps from '@/lib/basemaps'

import StationCard from '../components/StationCard.vue'
import ExplorerSidebar from '../components/ExplorerSidebar.vue'
import MapLegend from '@/components/MapLegend.vue'

import { useStationsStore } from '@/stores/stations'
import { useResultsStore } from '@/stores/results'
import { useVariablesStore } from '@/stores/variables'
import { useMapStore } from '@/stores/map'

const { selectedStation } = storeToRefs(useStationsStore())
const { fetchStations, selectStation, setNearbyStations, setSpatialFilter } = useStationsStore()

const { visibleStations, valueCountByStation, valueCountArray } = storeToRefs(useResultsStore())
const { fetchResults } = useResultsStore()

const { fetchVariables } = useVariablesStore()

const { selectedOverlays } = storeToRefs(useMapStore())

const mapEl = ref()
const loading = ref(false)

const valueCountQuantileScale = computed(() => {
  return scaleQuantile()
    .domain(valueCountArray.value)
    .range(range(0, 1.1, 0.1))
})

function stationColor (station: Station) {
  if (station === selectedStation.value) return 'rgb(255, 69, 0)'
  const valueCount = valueCountByStation.value.get(station.samplingfeatureid) || 0
  return interpolateColor(valueCountQuantileScale.value(valueCount))
}

const visibleLayers: Ref<Array<L.GeoJSON>> = ref([])

async function overlayAdd ({ layer }: { layer: L.GeoJSON }) {
  // console.log('add', layer.options)
  if (layer.getLayers().length === 0) {
    // @ts-ignore
    const url = layer.options.url
    if (!url) return
    const response = await fetch(url)
    const geojson = await response.json()
    layer.addData(geojson)
  }
  layer.bringToBack()
  visibleLayers.value.push(layer)
}

async function overlayRemove ({ layer }: { layer: L.GeoJSON }) {
  // console.log('remove', layer.options.id)
  visibleLayers.value = visibleLayers.value.filter(d => d !== layer)
}

function mapReady (map: L.Map) {
  map.on('overlayadd', overlayAdd)
  map.on('overlayremove', overlayRemove)
  map.eachLayer(d => {
    // @ts-ignore
    if (d.options?.visible) {
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

const MAX_DISTANCE = 10
function onClickStation (station: Station) {
  if (!mapEl.value) return
  const targetPosition = mapEl.value.leafletObject
    .latLngToContainerPoint({
      lat: station.latitude,
      lng: station.longitude
    })
  const nearbyStations = visibleStations.value.filter(d => {
    const dPosition = mapEl.value.leafletObject
      .latLngToContainerPoint({
        lat: d.latitude,
        lng: d.longitude
      })
    return d.samplingfeatureid !== station.samplingfeatureid && distance(targetPosition, dPosition) < MAX_DISTANCE
  })
  setNearbyStations([station, ...nearbyStations])
  selectStation(station.samplingfeatureid)
}

function onClickOverlay (e: L.LeafletMouseEvent) {
  const layer = e.layer
  if (!layer.options.interactive) return
  setSpatialFilter(e.layer)
}
</script>

<template>
  <div class="explorer">
    <div class="explorer-map">
      <div style="height:100%;width:100%">
        <LMap :zoom="11" :center="[43.1, -71.0]" @ready="mapReady" ref="mapEl">
          <LControlLayers position="topleft"></LControlLayers>
          <LControlScale position="bottomright"></LControlScale>
          <LControl position="topright">
            <MapLegend :layers="visibleLayers"/>
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
            v-for="overlay in selectedOverlays"
            :key="overlay.title"
            :name="overlay.title"
            :visible="overlay.visible"
            :options="overlay"
            :options-style="overlay.style as L.StyleFunction"
            layer-type="overlay"
            @click="onClickOverlay"
          ></LGeoJson>
          <LCircleMarker
            v-for="station in visibleStations"
            :key="station.samplingfeatureid"
            :latLng="[station.latitude, station.longitude]"
            :radius="station === selectedStation ? 10 : 8"
            :color="stationColor(station)"
            :weight="2"
            @click="onClickStation(station)"
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
  z-index:500;
}
.explorer-loading {
  position: absolute;
  top: 0;
  right: 0;
  z-index:1000;
}
</style>