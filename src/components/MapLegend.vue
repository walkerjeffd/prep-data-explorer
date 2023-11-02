<script setup lang="ts">
import { ref } from 'vue'
import type L from 'leaflet'
import type { Feature } from 'geojson'
import { storeToRefs } from 'pinia'
import { useResultsStore } from '@/stores/results'
import { useMapStore } from '@/stores/map'
const { valueCountTickLabels } = storeToRefs(useResultsStore())
const { overlays, selectedOverlays } = storeToRefs(useMapStore())

defineProps<{
  layers: Array<L.GeoJSON>
}>()

const show = ref(true)

function getLayers (layer: L.GeoJSON): L.Layer[] {
  return layer.getLayers() as L.LayerGroup[]
}
</script>

<template>
  <v-sheet elevation="2" width="350">
    <v-toolbar class="pl-4" density="compact">
      <span class="text-body-1">Legend</span>
      <v-spacer></v-spacer>
      <v-btn :icon="show ? '$expand' : '$collapse'" size="x-small" @click="show = !show"></v-btn>
    </v-toolbar>
    <div class="py-2 px-4" v-if="show">
      <div class="d-flex mb-0 align-center">
        <div class="text-subtitle-1"># Measurements per Station</div>
        <v-spacer></v-spacer>
        <v-tooltip dir="left">
          <template v-slot:activator="{ props }">
            <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
          </template>
          <span v-html="'Stations colored by relative percentile of # values<br>(middle value is median # values over all stations)'"></span>
        </v-tooltip>
      </div>
      <div>
        <svg width="320" height="40" viewBox="0,0,320,40" style="overflow: visible; display: block;">
          <image x="0" y="8" width="320" height="10" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAYAAAAxWXB3AAAAAXNSR0IArs4c6QAAAOxJREFUOE+FkYttxDAMQ0l7tY7Q/UeJDyIlW06LFodAovj0SY5f/F7gAAfRI6QJjqGIHQlyoPzLC05sxjfXvKUc5vN517pWTvMr+1bqqBdbXHmO0E2Vv70fWvNjZu7LGXd/+bl78723M3lH4xZ+qdW9/8w798WQs6fX97tz7Xe/+rQrvbzFPSu/dd1n3b34Oy4OZpi9J5oL7b/5cP68xxs7N1t64KWTC9/eEns9+Kv2mN3Mg7m1vSkvc3lVr9qj/inm2Xz1zcaLKRbeZT/6andE62I1S37Nd593+EbncAQwlTPziExNTIaOX+TOPlHoiQoe9KDCAAAAAElFTkSuQmCC"></image>
          <g transform="translate(0,18)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle">
            <g class="tick" opacity="1" transform="translate(0,0)">
              <line stroke="currentColor" y2="6" y1="-10"></line>
              <text fill="currentColor" y="9" dy="0.71em">0</text>
            </g>
            <g class="tick" opacity="1" transform="translate(160,0)">
              <line stroke="currentColor" y2="6" y1="-10"></line>
              <text fill="currentColor" y="9" dy="0.71em">{{ valueCountTickLabels[1]?.toLocaleString() }}</text>
            </g>
            <g class="tick" opacity="1" transform="translate(320,0)">
              <line stroke="currentColor" y2="6" y1="-10"></line>
              <text fill="currentColor" y="9" dy="0.71em" text-anchor="end">
                {{ valueCountTickLabels[2]?.toLocaleString() }}
              </text>
            </g>
          </g>
        </svg>
      </div>
      <v-divider class="my-4"></v-divider>
      <div class="mb-4">
        <div class="text-subtitle-1">Map Layers</div>
        <v-autocomplete
          variant="underlined"
          density="compact"
          v-model="selectedOverlays"
          :items="overlays"
          item-title="title"
          placeholder="Select layer(s)"
          return-object
          multiple
          clearable
          hide-details
        >
          <template #prepend-item>
            <v-list-item density="compact">
              <v-list-item-subtitle class="d-flex align-center justify-end">
                <v-icon size="small" class="align-self-center">mdi-filter</v-icon> = Spatial Filter Layer
              </v-list-item-subtitle>
            </v-list-item>
          </template>
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #prepend="{isSelected}">
                <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
              </template>
              <template #append>
                <div v-if="item.raw.interactive">
                  <v-icon color="grey-darken-1" size="small" class="align-self-center">mdi-filter</v-icon>
                </div>
              </template>
            </v-list-item>
          </template>
          <template #selection="{ index }">
            <span class="grey--text text-body-1" v-if="index === 0">
              {{ selectedOverlays.length  }} {{ selectedOverlays.length > 1 ? 'layers' : 'layer' }} selected
            </span>
          </template>
        </v-autocomplete>
      </div>
      <div v-if="layers.length > 0">
        <div v-for="layer in layers" :key="// @ts-ignore
                                          layer.options.id" class="my-1">
          <div v-if="// @ts-ignore
                    layer.options.legend?.byFeature" class="mb-4">
            <div class="text-subtitle-2 mb-1">{{ // @ts-ignore
                                                layer.options.title }}</div>
            <div v-for="// @ts-ignore
                        layer in layer.getLayers()" :key="layer.feature.id" class="ml-4">
              <svg width="20" height="20" style="display:inline">
                <rect
                  x="2"
                  y="2"
                  width="15"
                  height="15"
                  rx="3"
                  :fill="layer.options.color"
                  :fill-opacity="layer.options.fillOpacity"
                  :stroke="layer.options.color"
                  :stroke-width="layer.options.weight"
                ></rect>
              </svg>
              <span style="vertical-align: top;" class="ml-2">
                {{layer.feature.properties[layer.options.legend.featureLabel]}}
              </span>
            </div>
          </div>
          <div v-else>
            <div v-for="(x, i) in (getLayers(layer) as L.LayerGroup[])" :key="(x.feature as Feature).id">
              <div v-if="i === 0">
                <svg width="20" height="20" style="display:inline">
                  <rect
                    x="2"
                    y="2"
                    width="15"
                    height="15"
                    rx="3"
                    :fill="(x.options as any).color"
                    :fill-opacity="(x.options as any).fillOpacity"
                    :stroke="(x.options as any).color"
                    :stroke-width="(x.options as any).weight"
                  ></rect>
                </svg>
                <span style="vertical-align: top;" class="ml-2">
                  {{(layer.options as any).title}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>
